"""
Embedding Service - Provider Abstraction Layer
Supports multiple embedding providers: Local (Sentence Transformers), OpenAI, Gemini
"""

import os
from typing import List
from dotenv import load_dotenv

load_dotenv()

class EmbeddingService:
    """
    Unified interface for embedding models.
    Automatically selects best available provider.
    """
    
    def __init__(self, provider: str = "auto"):
        """
        Initialize embedding service.
        
        Args:
            provider: 'auto', 'local', 'openai', 'gemini', or 'mock'
        """
        self.provider = None
        self.model = None
        
        if provider == "auto":
            # Check for API keys first (lighter dependency)
            if self._init_openai():
                return
            if self._init_gemini():
                return
            
            # Fallback to local (heavy dependency)
            # CAUTION: Torch import hangs on some systems. 
            # We try it, but if it fails/hangs (user must manually interrupt if hangs), we proceed.
            # ideally we'd timeout here, but python imports are hard to timeout.
            # For now, we jump to mock if local fails.
            try:
                if self._init_local():
                    return
            except:
                pass

            # Final fallback: Mock
            print("⚠️  Falling back to Mock Embeddings (Simulation Mode)")
            self._init_mock()

        elif provider == "local":
            self._init_local()
        elif provider == "openai":
            self._init_openai()
        elif provider == "gemini":
            self._init_gemini()
        elif provider == "mock":
            self._init_mock()
    
    def _init_local(self):
        """Initialize local sentence-transformers model"""
        try:
            from sentence_transformers import SentenceTransformer
            self.model = SentenceTransformer("all-MiniLM-L6-v2")
            self.provider = "local"
            print("✅ Using local embeddings (all-MiniLM-L6-v2) - Free & Fast")
            return True
        except ImportError:
            print("⚠️  sentence-transformers not installed")
            return False
        except Exception as e:
            print(f"⚠️  Failed to load local model: {e}")
            return False
    
    def _init_openai(self):
        """Initialize OpenAI embeddings"""
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            return False
        
        try:
            from openai import OpenAI
            self.model = OpenAI(api_key=api_key)
            self.provider = "openai"
            print("✅ Using OpenAI embeddings (text-embedding-3-small)")
            return True
        except Exception as e:
            print(f"⚠️  OpenAI setup failed: {e}")
            return False
    
    def _init_gemini(self):
        """Initialize Gemini embeddings"""
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            return False
        
        try:
            import google.generativeai as genai
            genai.configure(api_key=api_key)
            self.model = genai
            self.provider = "gemini"
            print("✅ Using Gemini embeddings")
            return True
        except Exception as e:
            print(f"⚠️  Gemini setup failed: {e}")
            return False

    def _init_mock(self):
        """Initialize Mock embeddings (random vectors) for testing/fallback"""
        import numpy as np
        self.model = "mock"
        self.provider = "mock"
        print("✅ Using Mock embeddings (Randomized 384-dim vectors)")
        return True

    
    def embed(self, text: str) -> List[float]:
        """
        Generate embedding for text.
        
        Args:
            text: Input text to embed
        
        Returns:
            List of floats (embedding vector)
        """
        if not self.model:
            return None
        
        try:
            if self.provider == "local":
                return self.model.encode(text).tolist()
            
            elif self.provider == "openai":
                response = self.model.embeddings.create(
                    input=text,
                    model="text-embedding-3-small"
                )
                return response.data[0].embedding
            
            elif self.provider == "gemini":
                result = self.model.embed_content(
                    model="models/embedding-001",
                    content=text
                )
                return result['embedding']
            
            elif self.provider == "mock":
                import numpy as np
                # Return a stable-ish random vector based on text length to avoid total chaos?
                # No, just random for now. 
                return np.random.rand(384).tolist()
        
        except Exception as e:
            print(f"Error generating embedding: {e}")
            return None
    
    def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """
        Generate embeddings for multiple texts (batch processing).
        
        Args:
            texts: List of input texts
        
        Returns:
            List of embedding vectors
        """
        if self.provider == "local":
            # Batch processing is much faster for local models
            return self.model.encode(texts).tolist()
        else:
            # For APIs, process one by one
            return [self.embed(text) for text in texts]


if __name__ == "__main__":
    print("🧪 Testing Embedding Service...")
    print("="*60)
    
    # Test embedding service
    embedder = EmbeddingService(provider="auto")
    
    if embedder.provider:
        test_text = "Soil nitrogen deficiency in wheat crops"
        embedding = embedder.embed(test_text)
        
        if embedding:
            print(f"\n✅ Embedding generated successfully!")
            print(f"   Text: '{test_text}'")
            print(f"   Provider: {embedder.provider}")
            print(f"   Dimensions: {len(embedding)}")
            print(f"   Sample values: {embedding[:5]}...")
        else:
            print("❌ Failed to generate embedding")
    else:
        print("❌ No embedding provider available")
    
    print("\n" + "="*60)
