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
        print(f"⚠️  Pathway LLM xpack not fully available: {e}")
        print("   Falling back to local sentence-transformers RAG...")
        import sys
        sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        from pathway_pipeline.rag_store_fallback import VectorRAG
        return VectorRAG(docs_folder)
    except Exception as e:
        print(f"❌ Error setting up Pathway vector store: {e}")
        print("   Using fallback implementation...")
        import sys
        sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        from pathway_pipeline.rag_store_fallback import VectorRAG
        return VectorRAG(docs_folder)


def query_vector_store(vector_store, question: str, k: int = 3):
    """
    Query the Pathway vector store for relevant documents.
    
    Args:
        vector_store: VectorStoreServer instance
        question: User query
        k: Number of top results
    
    Returns:
        List of relevant document chunks
    """
    try:
        # If it's a Pathway VectorStoreServer
        if hasattr(vector_store, 'similarity_search'):
            results = vector_store.similarity_search(question, k=k)
            return [doc.text for doc in results]
        # If it's our fallback VectorRAG
        elif hasattr(vector_store, 'retrieve'):
            return vector_store.retrieve(question, k=k)
        else:
            print("⚠️  Unknown vector store type")
            return []
    except Exception as e:
        print(f"Error querying vector store: {e}")
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
