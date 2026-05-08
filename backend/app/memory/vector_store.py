import faiss
import numpy as np
import google.generativeai as genai
from app.core.config import settings

class VectorStore:
    def __init__(self):
        self.dimension = 768 # Standard for Gemini text-embedding-004
        self.index = faiss.IndexFlatL2(self.dimension)
        self.memory_store = [] # To hold the actual text chunks
        
        self.api_key = settings.LLM_API_KEY
        if self.api_key:
            genai.configure(api_key=self.api_key)

    def _get_embedding(self, text: str):
        if not self.api_key:
            return np.zeros(self.dimension, dtype=np.float32)
            
        result = genai.embed_content(
            model="models/embedding-001",
            content=text,
            task_type="retrieval_document",
        )
        return np.array(result['embedding'], dtype=np.float32)

    def add_memory(self, text: str, metadata: dict = None):
        """
        Embeds text and adds it to the FAISS index.
        """
        if not self.api_key:
            return
            
        embedding = self._get_embedding(text)
        # FAISS expects 2D array
        embedding_2d = np.expand_dims(embedding, axis=0)
        
        self.index.add(embedding_2d)
        
        self.memory_store.append({
            "id": len(self.memory_store),
            "text": text,
            "metadata": metadata or {}
        })

    def search_memory(self, query: str, k: int = 3):
        """
        Searches the FAISS index for the closest matches.
        """
        if not self.api_key or self.index.ntotal == 0:
            return []
            
        query_embedding = self._get_embedding(query)
        query_embedding_2d = np.expand_dims(query_embedding, axis=0)
        
        distances, indices = self.index.search(query_embedding_2d, k)
        
        results = []
        for i, idx in enumerate(indices[0]):
            if idx != -1 and idx < len(self.memory_store):
                results.append({
                    "text": self.memory_store[idx]["text"],
                    "metadata": self.memory_store[idx]["metadata"],
                    "distance": float(distances[0][i])
                })
        return results
