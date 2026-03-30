"""
app.py - Streamlit Web Interface for Gemini RAG Document QA System
Upload PDFs and ask questions about them
"""
import pandas as pd
import streamlit as st
import os
from pathlib import Path
from dotenv import load_dotenv
from qa import DocumentQA
import shutil
# Load environment variables
load_dotenv()

# Configuration
PDF_DIR = "data/pdfs"
CHROMA_DB_DIR = "chroma_db"

# Page configuration
st.set_page_config(
    page_title="RAG Document QA",
    page_icon="📚",
    layout="wide"
)


def check_setup():
    """Check if the system is properly set up"""
    issues = []
    
    # Check API key
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key or api_key == "your_api_key_here":
        issues.append("⚠️ GROQ_API_KEY not configured in .env file")
    
    # Check if vector database exists
    if not os.path.exists(CHROMA_DB_DIR):
        issues.append("⚠️ Vector database not found. Please upload and process PDFs first.")
    
    return issues


def save_uploaded_file(uploaded_file):
    """Save uploaded PDF file to the data/pdfs directory"""
    Path(PDF_DIR).mkdir(parents=True, exist_ok=True)
    file_path = Path(PDF_DIR) / uploaded_file.name
    
    with open(file_path, "wb") as f:
        f.write(uploaded_file.getbuffer())
    
    return file_path


def process_pdfs():
    """Process PDFs and create vector database"""
    import subprocess
    
    with st.spinner("Processing PDFs... This may take a few minutes."):
        try:
            # Run ingest.py
            result = subprocess.run(
                ["python", "ingest.py"],
                capture_output=True,
                text=True
            )
            
            if result.returncode == 0:
                st.success("✅ PDFs processed successfully!")
                st.code(result.stdout, language="text")
                return True
            else:
                st.error("❌ Error processing PDFs")
                st.code(result.stderr, language="text")
                return False
        except Exception as e:
            st.error(f"❌ Error: {e}")
            return False


def main():
    """Main Streamlit application"""
    
    # Header
    st.title("📚 GROQ-Powered Document QA System")
    st.markdown("**Ask questions about your PDF documents using GROQ and RAG**")
    st.divider()
    
    # Check setup
    issues = check_setup()
    
    # Sidebar for setup and configuration
    with st.sidebar:
        st.header("⚙️ Setup & Configuration")
        
        # Show setup issues
        if issues:
            st.warning("**Setup Issues:**")
            for issue in issues:
                st.markdown(issue)
            st.divider()
        
        # PDF Upload Section
        st.subheader("📤 Upload PDFs")
        uploaded_files = st.file_uploader(
            "Upload PDF documents",
            type=["pdf"],
            accept_multiple_files=True,
            help="Upload one or more PDF files to analyze"
        )
        
        if uploaded_files:
            st.write(f"**{len(uploaded_files)} file(s) uploaded:**")
            for file in uploaded_files:
                st.write(f"- {file.name}")
            
            if st.button("💾 Save and Process PDFs", type="primary", use_container_width=True):
                # Save files
                saved_files = []
                for uploaded_file in uploaded_files:
                    file_path = save_uploaded_file(uploaded_file)
                    saved_files.append(file_path.name)
                
                st.success(f"✅ Saved {len(saved_files)} file(s)")
                
                # Process PDFs
                if process_pdfs():
                    st.balloons()
                    st.rerun()
        
        st.divider()
        
        # Current PDFs
        st.subheader("📁 Current PDFs")
        if os.path.exists(PDF_DIR):
            pdf_files = list(Path(PDF_DIR).glob("*.pdf"))
            if pdf_files:
                st.write(f"**{len(pdf_files)} PDF(s) in database:**")
                for pdf in pdf_files:
                    st.write(f"- {pdf.name}")
            else:
                st.info("No PDFs uploaded yet")
        
        st.divider()
        
        # Clear database
        if st.button("🗑️ Clear Database", use_container_width=True):
            if os.path.exists(CHROMA_DB_DIR):
                shutil.rmtree(CHROMA_DB_DIR)
            if os.path.exists(PDF_DIR):
                shutil.rmtree(PDF_DIR)
                Path(PDF_DIR).mkdir(parents=True, exist_ok=True)
            st.success("Database cleared!")
            st.rerun()
    
    # Main content area
    if not os.path.exists(CHROMA_DB_DIR):
        # Show instructions if database doesn't exist
        st.info("👈 **Get Started:** Upload PDF documents using the sidebar to begin!")
        
        st.markdown("### 📖 How to Use:")
        st.markdown("""
        1. **Upload PDFs**: Use the sidebar to upload one or more PDF documents
        2. **Process**: Click "Save and Process PDFs" to create the vector database
        3. **Ask Questions**: Once processed, ask questions about your documents
        4. **Get Answers**: Receive AI-generated answers with source references
        """)
        
        st.markdown("### 🔧 System Features:")
        st.markdown("""
        - **Google GROQ AI**: Powered by `Groq` model
        - **RAG Technology**: Retrieval-Augmented Generation for accurate answers
        - **Vector Search**: ChromaDB for efficient document retrieval
        - **Source Attribution**: See which parts of documents were used for answers
        """)
    
    else:
        # Initialize QA system
        try:
            if 'qa_system' not in st.session_state:
                with st.spinner("Loading QA system..."):
                    st.session_state.qa_system = DocumentQA()
            
            qa = st.session_state.qa_system
            
            # Show database stats
            with st.expander("📊 Database Statistics"):
                stats = qa.get_database_stats()
                cols = st.columns(4)
                cols[0].metric("Total Chunks", stats.get("total_chunks", "N/A"))
                cols[1].metric("Model", stats.get("model", "N/A"))
                cols[2].metric("Retrieval K", stats.get("retrieval_k", "N/A"))
                cols[3].metric("Database", "ChromaDB")
            
            st.divider()
            
            # Question input
            st.subheader("💬 Ask a Question")
            question = st.text_input(
                "Enter your question:",
                placeholder="e.g., What is the main topic of the document?",
                label_visibility="collapsed"
            )
            
            col1, col2 = st.columns([1, 5])
            with col1:
                ask_button = st.button("🔍 Ask", type="primary", use_container_width=True)
            
            # Process question
            if ask_button and question:
                with st.spinner("Searching documents and generating answer..."):
                    response = qa.ask(question)
                
                # Display answer
                st.markdown("### 💡 Answer")
                st.markdown(response['result'])
                
                # Display source documents
                if response.get('source_documents'):
                    st.divider()
                    st.markdown("### 📄 Source Documents")
                    
                    for idx, doc in enumerate(response['source_documents'], 1):
                        with st.expander(f"Source {idx}: {doc.metadata.get('source', 'Unknown')} - Page {doc.metadata.get('page', 'N/A')}"):
                            st.markdown(doc.page_content)
            
            # Chat history
            if 'chat_history' not in st.session_state:
                st.session_state.chat_history = []
            
            if ask_button and question:
                st.session_state.chat_history.append({
                    "question": question,
                    "answer": response['result']
                })
            
            # Show chat history
            if st.session_state.chat_history:
                st.divider()
                st.subheader("📝 Chat History")
                for idx, chat in enumerate(reversed(st.session_state.chat_history[-5:]), 1):
                    with st.expander(f"Q{len(st.session_state.chat_history) - idx + 1}: {chat['question'][:60]}..."):
                        st.markdown(f"**Question:** {chat['question']}")
                        st.markdown(f"**Answer:** {chat['answer']}")
        
        except Exception as e:
            st.error(f"❌ Error initializing QA system: {e}")
            st.info("Try clearing the database and re-processing your PDFs.")


if __name__ == "__main__":
    main()
