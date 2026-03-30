import os
from urllib import response
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
from pypdf import PdfReader
import io


load_dotenv()

app = Flask(__name__)
CORS(app)

genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))
model = genai.GenerativeModel("gemini-flash-latest")
# Store extracted PDF text in memory (keyed by filename)
pdf_store = {}


def extract_text_from_pdf(file_bytes):
    reader = PdfReader(io.BytesIO(file_bytes))
    text = ""
    for page in reader.pages:
        text += page.extract_text() or ""
    return text.strip()


@app.route("/upload", methods=["POST"])
def upload_pdf():
    if "file" not in request.files:
        return jsonify({"error": "No file provided"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "No file selected"}), 400

    if not file.filename.lower().endswith(".pdf"):
        return jsonify({"error": "Only PDF files are supported"}), 400

    file_bytes = file.read()
    text = extract_text_from_pdf(file_bytes)

    if not text:
        return jsonify({"error": "Could not extract text from PDF"}), 400

    pdf_store[file.filename] = text

    return jsonify({
        "message": "PDF uploaded and processed successfully",
        "filename": file.filename,
        "char_count": len(text)
    })


@app.route("/ask", methods=["POST"])
def ask_question():
    data = request.get_json()

    if not data:
        return jsonify({"error": "No data provided"}), 400

    question = data.get("question", "").strip()
    filename = data.get("filename", "").strip()

    if not question:
        return jsonify({"error": "No question provided"}), 400

    if not filename or filename not in pdf_store:
        return jsonify({"error": "Please upload a PDF first"}), 400

    doc_text = pdf_store[filename]

    # Truncate text if too long (Gemini has token limits)
    max_chars = 120000
    if len(doc_text) > max_chars:
        doc_text = doc_text[:max_chars] + "\n\n[Document truncated]"

    prompt = f"""You are a helpful document assistant. Answer the user's question based ONLY on the content of the provided document.
If the answer is not found in the document, say so clearly.

Document:
{doc_text}

User Question: {question}

Answer:"""

    try:
        response = model.generate_content(prompt)
    
    # Check if the response was blocked by safety filters
        if not response.candidates or not response.candidates[0].content.parts:
            return jsonify({"answer": "I cannot answer this due to safety restrictions or an empty response."})

        answer = response.text
        return jsonify({"answer": answer})

    except Exception as e:
    # This will tell you the EXACT error (e.g., "API_KEY_INVALID")
        print(f"Error: {e}") 
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
# source venv/bin/activate