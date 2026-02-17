
import os
import sys

# Add project root to path
sys.path.insert(0, os.path.abspath("."))

from pathway_pipeline.rag_store import setup_rag_store, query_vector_store

def test_rag():
    print("🚀 Initializing Structured RAG...")
    
    # Initialize store (should load seed_knowledge.json)
    vector_store = setup_rag_store("./docs")
    
    # Test Query 1
    q1 = "What are the symptoms of Nitrogen deficiency?"
    print(f"\n❓ Query 1: {q1}")
    results = query_vector_store(vector_store, q1, k=1)
    if results:
        print(f"✅ Result: {results[0]}")
    else:
        print("❌ No results found")

    # Test Query 2
    q2 = "How to apply Urea?"
    print(f"\n❓ Query 2: {q2}")
    results = query_vector_store(vector_store, q2, k=1)
    if results:
        print(f"✅ Result: {results[0]}")
    else:
        print("❌ No results found")

if __name__ == "__main__":
    test_rag()
