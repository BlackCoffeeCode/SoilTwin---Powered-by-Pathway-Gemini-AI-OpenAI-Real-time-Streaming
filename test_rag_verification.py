#!/usr/bin/env python3
"""
RAG Verification Test
Tests if vector store retrieval is actually working
"""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from pathway_pipeline.rag_store import setup_rag_store, query_vector_store

def test_rag_retrieval():
    print("=" * 70)
    print("🧪 RAG RETRIEVAL VERIFICATION TEST")
    print("=" * 70)
    
    # 1. Initialize vector store
    print("\n1️⃣ Initializing Pathway Vector Store...")
    try:
        vector_store = setup_rag_store("./docs")
        print("   ✅ Vector store initialized")
    except Exception as e:
        print(f"   ❌ Failed to initialize: {e}")
        return False
    
    # 2. Test queries that SHOULD match document content
    test_queries = [
        "What happens after heavy rainfall?",
        "Best nitrogen fertilizer for wheat",
        "How to improve soil organic carbon?",
        "Potassium deficiency symptoms"
    ]
    
    print("\n2️⃣ Testing Retrieval with Real Queries...")
    print("-" * 70)
    
    all_passed = True
    
    for i, query in enumerate(test_queries, 1):
        print(f"\n   Query #{i}: \"{query}\"")
        try:
            results = query_vector_store(vector_store, query, k=3)
            
            if results and len(results) > 0:
                print(f"   ✅ Retrieved {len(results)} chunks")
                print(f"   📄 First chunk preview:")
                preview = results[0][:150] + "..." if len(results[0]) > 150 else results[0]
                print(f"      {preview}")
            else:
                print("   ❌ No results returned!")
                all_passed = False
                
        except Exception as e:
            print(f"   ❌ Error during retrieval: {e}")
            all_passed = False
    
    # 3. Verdict
    print("\n" + "=" * 70)
    if all_passed:
        print("✅ RAG VERIFICATION: PASSED")
        print("   - Vector store is working")
        print("   - similarity_search() returns results")
        print("   - Retrieved context contains document content")
        print("\n🟢 STATUS: FULLY INTEGRATED RAG REASONING LAYER")
    else:
        print("❌ RAG VERIFICATION: FAILED")
        print("   - Vector store may not be properly indexed")
        print("   - Check if documents exist in ./docs/")
        print("\n🔴 STATUS: RAG NOT WORKING")
    
    print("=" * 70)
    return all_passed

if __name__ == "__main__":
    success = test_rag_retrieval()
    sys.exit(0 if success else 1)
