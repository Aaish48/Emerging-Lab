"""
ingest.py - PDF Document Ingestion and Vector Database Creation
Loads PDFs, splits them into chunks, creates embeddings, and stores in ChromaDB
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma

# Load environment variables
load_dotenv()

# Configuration
PDF_DIR = "data/pdfs"
CHROMA_DB_DIR = "chroma_db"
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200


def check_api_key():
    """Verify that Google API key is set"""
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key or api_key == "your_api_key_here":
        print("❌ Error: GOOGLE_API_KEY not set in .env file")
        print("Please add your Google API key to the .env file")
        sys.exit(1)
    return api_key


def load_pdfs(pdf_directory):
    """Load all PDF files from the specified directory"""
    pdf_path = Path(pdf_directory)
    
    if not pdf_path.exists():
        print(f"❌ Error: Directory '{pdf_directory}' does not exist")
        sys.exit(1)
    
    pdf_files = list(pdf_path.glob("*.pdf"))
    
    if not pdf_files:
        print(f"❌ Error: No PDF files found in '{pdf_directory}'")
        print(f"Please add PDF files to the '{pdf_directory}' directory")
        sys.exit(1)
    
    print(f"📚 Found {len(pdf_files)} PDF file(s)")
    
    documents = []
    for pdf_file in pdf_files:
        print(f"  Loading: {pdf_file.name}")
        try:
            loader = PyPDFLoader(str(pdf_file))
            docs = loader.load()
            documents.extend(docs)
            print(f"    ✓ Loaded {len(docs)} page(s)")
        except Exception as e:
            print(f"    ✗ Error loading {pdf_file.name}: {e}")
    
    if not documents:
        print("❌ Error: No documents were successfully loaded")
        sys.exit(1)
    
    print(f"\n✓ Total pages loaded: {len(documents)}")
    return documents


def split_documents(documents):
    """Split documents into chunks"""
    print(f"\n📄 Splitting documents into chunks...")
    print(f"  Chunk size: {CHUNK_SIZE}")
    print(f"  Chunk overlap: {CHUNK_OVERLAP}")
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        length_function=len,
        separators=["\n\n", "\n", " ", ""]
    )
    
    chunks = text_splitter.split_documents(documents)
    print(f"✓ Created {len(chunks)} chunks")
    return chunks


def create_vector_database(chunks, api_key):
    """Create embeddings and store in ChromaDB"""
    print(f"\n🔮 Creating embeddings and vector database...")
    
    try:
        # Initialize Google Generative AI Embeddings
        embeddings = GoogleGenerativeAIEmbeddings(
            model="models/embedding-001",
            google_api_key=api_key
        )
        
        # Create or update ChromaDB
        vectordb = Chroma.from_documents(
            documents=chunks,
            embedding=embeddings,
            persist_directory=CHROMA_DB_DIR
        )
        
        print(f"✓ Vector database created successfully")
        print(f"✓ Database location: {CHROMA_DB_DIR}")
        print(f"✓ Total vectors: {len(chunks)}")
        
        return vectordb
        
    except Exception as e:
        print(f"❌ Error creating vector database: {e}")
        sys.exit(1)


def main():
    """Main ingestion pipeline"""
    print("=" * 60)
    print("📚 Gemini RAG Document Ingestion Pipeline")
    print("=" * 60)
    
    # Step 1: Check API key
    print("\n1️⃣  Checking API key...")
    api_key = check_api_key()
    print("✓ API key found")
    
    # Step 2: Load PDFs
    print("\n2️⃣  Loading PDF documents...")
    documents = load_pdfs(PDF_DIR)
    
    # Step 3: Split into chunks
    print("\n3️⃣  Splitting documents...")
    chunks = split_documents(documents)
    
    # Step 4: Create vector database
    print("\n4️⃣  Creating vector database...")
    vectordb = create_vector_database(chunks, api_key)
    
    print("\n" + "=" * 60)
    print("✅ INGESTION COMPLETE!")
    print("=" * 60)
    print("\nYou can now run the Streamlit app:")
    print("  streamlit run app.py")
    print("=" * 60)


if __name__ == "__main__":
    main()
