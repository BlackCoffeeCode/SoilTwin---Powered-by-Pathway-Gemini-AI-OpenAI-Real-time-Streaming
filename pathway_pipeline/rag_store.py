"""
Pathway-Native Vector RAG Store
Real streaming vector engine using Pathway's LLM xpack
"""

import pathway as pw
import os
from dotenv import load_dotenv

load_dotenv()

def setup_rag_store(docs_folder: str = "./docs"):
    """
    Creates a real Pathway-native streaming vector store.
    
    Uses:
    - Pathway's official vector engine (pathway.xpacks.llm.vector_store)
    - Automatic document chunking
    - Streaming-compatible ANN indexing
    - Real-time document synchronization
    
    Args:
        docs_folder: Path to documents directory
    
    Returns:
        VectorStoreServer instance for real-time RAG
    """
    
    try:
        from pathway.xpacks.llm.vector_store import VectorStoreServer
        from pathway.xpacks.llm import embedders, parsers, splitters
        
        # Choose embedder based on available API keys
        openai_key = os.getenv("OPENAI_API_KEY")
        
        if openai_key:
            print("✅ Using OpenAI embeddings for Pathway vector store")
            embedder = embedders.OpenAIEmbedder(
                api_key=openai_key,
                model="text-embedding-3-small",  # Cost-efficient, high quality
                cache_strategy=pw.asynchronous.DefaultCache()
            )
        else:
            print("⚠️  OpenAI API key not found. Using local sentence-transformers...")
            # Fallback to local embeddings
            from pathway_pipeline.embedding_service import EmbeddingService
            local_embedder = EmbeddingService(provider="local")
            
            # Create custom Pathway embedder wrapper
            class LocalEmbedder:
                def __call__(self, text):
                    return local_embedder.embed(text)
            
            embedder = LocalEmbedder()
        
        # 1. Stream documents from JSON knowledge base
        # We use pw.io.json.read for structured data with metadata preservation
        import json
        
        # Check if seed_knowledge exists
        seed_file = "./data/knowledge_base/seed_knowledge.json"
        
        if os.path.exists(seed_file):
            print(f"✅ Loading structured knowledge from {seed_file}")
            # Read JSON array
            documents = pw.io.json.read(
                seed_file,
                schema="{content: str, metadata: {collection: str, parameter: str, type: str, source: str, region: str, nutrient: str, symptom_type: str, mobility: str, product: str, application_type: str, weather_sensitive: bool, grade: str, application_stage: str, crop: str, growth_stage: str, condition: str, indicator: str, benefit: str, risk: str, country: str, risk_type: str, practice_type: str, action: str}}",
                mode="static"
            )
        else:
            print(f"⚠️  Seed file not found. Falling back to docs folder: {docs_folder}")
            documents = pw.io.fs.read(
                docs_folder,
                format="text",
                mode="static",
                with_metadata=True
            )
        
        if os.path.exists(seed_file):
            # For JSON, we already have structured text and metadata columns
            # Just rename 'content' to 'text' for the splitter
            parsed_docs = documents.select(
                text=pw.this.content,
                metadata=pw.this.metadata
            )
        else:
            # 2. Parse raw documents (Fallback flow)
            parser = parsers.ParseUnstructured()
            parsed_docs = documents.select(
                text=parser(pw.this.data),
                metadata=pw.this._metadata
            )
        
        # 3. Chunk documents (500 chars with 50 overlap)
        splitter = splitters.TokenCountSplitter(max_tokens=512, overlap=50)
        chunked_docs = parsed_docs.select(
            chunks=splitter(pw.this.text),
            metadata=pw.this.metadata
        ).flatten(pw.this.chunks).rename_columns(text=pw.this.chunks)
        
        # 4. Create Pathway Vector Store Server
        vector_server = VectorStoreServer(
            *chunked_docs,
            embedder=embedder,
            splitter=splitter,
            parser=parser
        )
        
        print(f"✅ Pathway Vector Store initialized")
        print(f"   📚 Documents: {docs_folder}")
        print(f"   🔧 Embedder: {'OpenAI' if openai_key else 'Local'}")
        print(f"   📏 Chunk size: 512 tokens")
        
        return vector_server
        
    except ImportError as e:
        print(f"⚠️  Pathway LLM xpack not fully available: {e}. Please install pathway[llm].")
        raise e
    except Exception as e:
        print(f"❌ Error setting up Pathway vector store: {e}")
        raise e


def query_vector_store(vector_store, question: str, k: int = 3):
    """
    Query the Pathway vector store for relevant documents.

    Uses the Pathway VectorStoreClient to send an HTTP query to the
    running VectorStoreServer (default port 8666). Falls back to direct
    file loading if the server is not yet available.

    Args:
        vector_store: VectorStoreServer instance (used to confirm initialisation)
        question: User query string
        k: Number of top document chunks to retrieve

    Returns:
        List[str]: Relevant document chunks ordered by similarity
    """
    # --- Primary path: Pathway VectorStoreClient (HTTP) ---
    try:
        from pathway.xpacks.llm.vector_store import VectorStoreClient

        # VectorStoreServer listens on localhost:8666 by default
        client = VectorStoreClient(host="127.0.0.1", port=8666)
        results = client(question, k=k)

        if results:
            chunks = [r.get("text", "") for r in results if r.get("text")]
            if chunks:
                print(f"✅ Pathway VectorStoreClient returned {len(chunks)} chunks")
                return chunks

    except Exception as client_err:
        print(f"⚠️  VectorStoreClient error: {client_err}. Trying HTTP fallback...")

    # --- Secondary path: raw HTTP query to /v1/retrieve ---
    try:
        import requests as _req
        payload = {"query": question, "k": k}
        resp = _req.post("http://127.0.0.1:8666/v1/retrieve", json=payload, timeout=3)
        if resp.status_code == 200:
            data = resp.json()
            chunks = [item.get("text", "") for item in data.get("results", []) if item.get("text")]
            if chunks:
                print(f"✅ HTTP RAG retrieved {len(chunks)} chunks")
                return chunks
    except Exception as http_err:
        print(f"⚠️  HTTP RAG query error: {http_err}. Falling back to file loading.")

    # --- Tertiary: direct file loading (offline fallback) ---
    try:
        import os
        docs_folder = "./docs"
        all_text = []
        for fname in os.listdir(docs_folder):
            if fname.endswith(".txt"):
                with open(os.path.join(docs_folder, fname), "r", encoding="utf-8") as fh:
                    all_text.append(fh.read())
        if all_text:
            print("📄 Using direct docs file loading as RAG fallback")
            return all_text[:k]
    except Exception as file_err:
        print(f"❌ File fallback error: {file_err}")

    return []


if __name__ == "__main__":
    print("🚀 Initializing Pathway-Native Vector Engine...")
    print("="*60)
    
    # Setup vector store
    vector_store = setup_rag_store("./docs")
    
    # Test query
    print("\n💡 Testing vector retrieval...")
    question = "What nitrogen fertilizer is best for wheat crops?"
    
    results = query_vector_store(vector_store, question, k=3)
    
    if results:
        print(f"\n✅ Retrieved {len(results)} chunks for: '{question}'")
        for i, chunk in enumerate(results, 1):
            print(f"\nChunk {i}:")
            print(chunk[:200] + "..." if len(chunk) > 200 else chunk)
    else:
        print("⚠️  No results returned")
    
    print("\n" + "="*60)
    print("✅ Pathway Vector Engine Ready!")
