"""
Lightweight RAG Store with Local Sentence-Transformers
Real-time vector search for agronomic knowledge retrieval
"""

import os
import json
import sys
import numpy as np
from dotenv import load_dotenv

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from pathway_pipeline.embedding_service import EmbeddingService

load_dotenv()

class VectorRAG:
    """
    Lightweight RAG implementation using local sentence-transformers.
    Stores vectors in memory for fast retrieval.
    """
    
    def __init__(self, docs_folder: str = "./docs", cache_file: str = "./cache/rag_vectors.json"):
        self.docs_folder = docs_folder
        self.cache_file = cache_file
        self.documents = []
        self.embeddings = []
        
        # Initialize embedding service (auto-selects best provider)
        self.embedder = EmbeddingService(provider="auto")
        
        # Load or create embeddings
        self.load_or_create_embeddings()
    
    def load_documents(self):
        """Load text from seed_knowledge.json or docs folder"""
        self.documents = []
        
        # 1. Try loading from structured JSON
        seed_file = "./data/knowledge_base/seed_knowledge.json"
        if os.path.exists(seed_file):
            print(f"✅ Loading structured knowledge from {seed_file}")
            try:
                with open(seed_file, "r") as f:
                    data = json.load(f)
                    for i, entry in enumerate(data):
                        self.documents.append({
                            "filename": "seed_knowledge.json",
                            "chunk_id": i,
                            "content": entry["content"],
                            "metadata": entry.get("metadata", {})
                        })
                print(f"📚 Loaded {len(self.documents)} structured documents")
                return
            except Exception as e:
                print(f"⚠️  Failed to load seed file: {e}")

        # 2. Fallback to docs folder
        for filename in os.listdir(self.docs_folder):
            if filename.endswith(".txt"):
                filepath = os.path.join(self.docs_folder, filename)
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                    
                    # Split into chunks (500 chars each for better retrieval)
                    chunks = self._chunk_text(content, chunk_size=500)
                    for i, chunk in enumerate(chunks):
                        self.documents.append({
                            "filename": filename,
                            "chunk_id": i,
                            "content": chunk,
                            "metadata": {}
                        })
        print(f"📚 Loaded {len(self.documents)} document chunks from {self.docs_folder}")
    
    def _chunk_text(self, text: str, chunk_size: int = 500):
        """Split text into chunks"""
        words = text.split()
        chunks = []
        current_chunk = []
        current_size = 0
        
        for word in words:
            current_chunk.append(word)
            current_size += len(word) + 1
            
            if current_size >= chunk_size:
                chunks.append(" ".join(current_chunk))
                current_chunk = []
                current_size = 0
        
        if current_chunk:
            chunks.append(" ".join(current_chunk))
        
        return chunks
    
    def load_or_create_embeddings(self):
        """Load cached embeddings or create new ones"""
        # Try to load from cache
        if os.path.exists(self.cache_file):
            print(f"📂 Loading cached embeddings from {self.cache_file}...")
            try:
                with open(self.cache_file, "r") as f:
                    cache = json.load(f)
                    self.documents = cache["documents"]
                    self.embeddings = [np.array(emb) for emb in cache["embeddings"]]
                print(f"✅ Loaded {len(self.embeddings)} cached embeddings")
                return
            except Exception as e:
                print(f"⚠️  Failed to load cache: {e}")
        
        # Create new embeddings
        print(f"🔨 Creating new embeddings with {self.embedder.provider}...")
        self.load_documents()
        
        if not self.embedder.provider:
            print("⚠️  No embedding provider available. Using keyword fallback.")
            return
        
        # Batch embed all documents (much faster)
        print(f"  Embedding {len(self.documents)} documents...")
        texts = [doc["content"] for doc in self.documents]
        embeddings = self.embedder.embed_batch(texts)
        
        self.embeddings = [np.array(emb) for emb in embeddings if emb is not None]
        
        # Save cache
        self._save_cache()
        print(f"✅ Created {len(self.embeddings)} embeddings ({self.embedder.provider})")
    
    def _save_cache(self):
        """Save embeddings to cache file"""
        os.makedirs(os.path.dirname(self.cache_file) or ".", exist_ok=True)
        cache = {
            "documents": self.documents,
            "embeddings": [emb.tolist() for emb in self.embeddings]
        }
        with open(self.cache_file, "w") as f:
            json.dump(cache, f)
        print(f"💾 Saved embeddings to {self.cache_file}")
    
    def retrieve(self, query: str, k: int = 3):
        """
        Retrieve top-k most relevant documents using cosine similarity.
        
        Args:
            query: User question
            k: Number of results to return
        
        Returns:
            List of relevant text chunks
        """
        if not self.embedder.provider or not self.embeddings:
            print("⚠️  Vector search unavailable. Using fallback...")
            return self._keyword_fallback(query, k)
        
        # Embed query
        query_embedding = self.embedder.embed(query)
        if not query_embedding:
            return self._keyword_fallback(query, k)
        
        query_embedding = np.array(query_embedding)
        
        # Compute cosine similarities
        similarities = []
        for i, doc_embedding in enumerate(self.embeddings):
            similarity = self._cosine_similarity(query_embedding, doc_embedding)
            similarities.append((similarity, i))
        
        # Sort and get top-k
        similarities.sort(reverse=True, key=lambda x: x[0])
        top_k = similarities[:k]
        
        results = []
        for sim, idx in top_k:
            doc = self.documents[idx]
            results.append(doc["content"])
            print(f"  📄 {doc['filename']} (chunk {doc['chunk_id']}) - similarity: {sim:.3f}")
        
        return results
    
    def _cosine_similarity(self, a, b):
        """Calculate cosine similarity between two vectors"""
        return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
    
    def _keyword_fallback(self, query: str, k: int = 3):
        """Fallback keyword-based retrieval"""
        print("📊 Using keyword-based retrieval...")
        query_lower = query.lower()
        keywords = query_lower.split()
        
        scored_docs = []
        for i, doc in enumerate(self.documents):
            content_lower = doc["content"].lower()
            score = sum(1 for kw in keywords if kw in content_lower)
            if score > 0:
                scored_docs.append((score, i))
        
        scored_docs.sort(reverse=True, key=lambda x: x[0])
        top_k = scored_docs[:k]
        
        results = [self.documents[idx]["content"] for score, idx in top_k]
        return results


# For backward compatibility
class SimpleRAG(VectorRAG):
    """Alias for VectorRAG for backward compatibility"""
    pass


if __name__ == "__main__":
    print("🚀 Testing RAG Vector Store with Sentence-Transformers...")
    print("="*60)
    
    # Initialize RAG
    rag = VectorRAG("./docs")
    
    # Test retrieval
    print("\n💡 Testing vector retrieval...")
    query = "What is the best nitrogen fertilizer for wheat crops?"
    results = rag.retrieve(query, k=3)
    
    print(f"\n✅ Retrieved {len(results)} relevant chunks for: '{query}'")
    for i, chunk in enumerate(results, 1):
        print(f"\nChunk {i}:")
        print(chunk[:200] + "..." if len(chunk) > 200 else chunk)
    
    print("\n" + "="*60)
    print("✅ RAG Vector Store is ready!")
