import os
from dotenv import load_dotenv

load_dotenv()

# API Keys
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
COHERE_API_KEY = os.getenv("COHERE_API_KEY")
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")

# Pinecone Configuration
PINECONE_INDEX_NAME = "legaleagle"
PINECONE_HOST = "https://legaleagle-k8myyqs.svc.aped-4627-b74a.pinecone.io"
PINECONE_DIMENSION = 1024
PINECONE_METRIC = "cosine"

# MongoDB Configuration
MONGODB_DB_NAME = "legaleagle"
MONGODB_CHATS_COLLECTION = "chats"
MONGODB_MESSAGES_COLLECTION = "messages"
MONGODB_DOCUMENTS_COLLECTION = "documents"

# Embedding Model (llama-text-embed-v2 compatible)
EMBEDDING_MODEL = "embed-english-v3.0"  # Cohere model that produces 1024 dimensions

# LLM Configuration
LLM_MODEL = "gemini-2.5-flash"
LLM_TEMPERATURE = 0.3

# Document Processing
CHUNK_SIZE = 1000
CHUNK_OVERLAP = 200
TEMP_FOLDER = "temp_uploads"
