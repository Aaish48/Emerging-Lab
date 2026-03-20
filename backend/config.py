"""
config.py - Centralized Configuration
Modify these settings to customize the RAG system behavior
"""

import os
from pathlib import Path

# Directory Paths
BASE_DIR = Path(__file__).parent
PDF_DIR = BASE_DIR / "data" / "pdfs"
CHROMA_DB_DIR = BASE_DIR / "chroma_db"

# Google API Configuration
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
EMBEDDING_MODEL = "models/embedding-001"
LLM_MODEL = "gemini-1.5-flash"

# Document Processing Configuration
CHUNK_SIZE = 1000  # Size of text chunks
CHUNK_OVERLAP = 200  # Overlap between chunks
SEPARATORS = ["\n\n", "\n", " ", ""]  # Text splitting separators

# Retrieval Configuration
RETRIEVAL_K = 4  # Number of chunks to retrieve for each query
SEARCH_TYPE = "similarity"  # Type of search: "similarity" or "mmr"

# LLM Configuration
TEMPERATURE = 0.3  # Lower = more focused, Higher = more creative (0.0 - 1.0)
MAX_TOKENS = 1000  # Maximum tokens in response

# Prompt Template
QA_PROMPT_TEMPLATE = """Use the following pieces of context to answer the question at the end. 
If you don't know the answer based on the context, just say that you don't know, don't try to make up an answer.

Context:
{context}

Question: {question}

Answer: """

# Streamlit Configuration
APP_TITLE = "Gemini-Powered Document QA System"
APP_ICON = "📚"
PAGE_LAYOUT = "wide"

# Feature Flags
SHOW_SOURCE_DOCUMENTS = True  # Display source documents in results
SHOW_CHAT_HISTORY = True  # Track and display chat history
SHOW_DATABASE_STATS = True  # Display database statistics
MAX_CHAT_HISTORY = 10  # Maximum number of questions to keep in history

# Logging
VERBOSE = True  # Enable verbose logging
LOG_FILE = "rag_system.log"  # Log file path

# Validation
def validate_config():
    """Validate configuration settings"""
    issues = []
    
    if not GOOGLE_API_KEY or GOOGLE_API_KEY == "your_api_key_here":
        issues.append("GOOGLE_API_KEY not configured")
    
    if CHUNK_SIZE < 100:
        issues.append("CHUNK_SIZE too small (minimum 100)")
    
    if CHUNK_OVERLAP >= CHUNK_SIZE:
        issues.append("CHUNK_OVERLAP must be less than CHUNK_SIZE")
    
    if RETRIEVAL_K < 1:
        issues.append("RETRIEVAL_K must be at least 1")
    
    if not (0 <= TEMPERATURE <= 1):
        issues.append("TEMPERATURE must be between 0 and 1")
    
    return issues

# Export configuration as dictionary
CONFIG = {
    "paths": {
        "pdf_dir": str(PDF_DIR),
        "chroma_db_dir": str(CHROMA_DB_DIR),
    },
    "models": {
        "embedding_model": EMBEDDING_MODEL,
        "llm_model": LLM_MODEL,
    },
    "processing": {
        "chunk_size": CHUNK_SIZE,
        "chunk_overlap": CHUNK_OVERLAP,
    },
    "retrieval": {
        "k": RETRIEVAL_K,
        "search_type": SEARCH_TYPE,
    },
    "llm": {
        "temperature": TEMPERATURE,
        "max_tokens": MAX_TOKENS,
    }
}

if __name__ == "__main__":
    print("=" * 60)
    print("⚙️  Configuration Settings")
    print("=" * 60)
    
    for category, settings in CONFIG.items():
        print(f"\n{category.upper()}:")
        for key, value in settings.items():
            print(f"  {key}: {value}")
    
    print("\n" + "=" * 60)
    print("Validation:")
    print("=" * 60)
    
    issues = validate_config()
    if issues:
        print("⚠️  Issues found:")
        for issue in issues:
            print(f"  - {issue}")
    else:
        print("✅ All configuration settings are valid")
    
    print("=" * 60)
