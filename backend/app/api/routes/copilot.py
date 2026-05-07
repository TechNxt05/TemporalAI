from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from app.core.config import settings
from app.memory.vector_store import VectorStore

router = APIRouter()
vector_store = VectorStore()

# Initialize some dummy memory for the sake of the copilot demo
# In production, this would be populated during the training pipeline
vector_store.add_memory("Sales in UP typically drop during mid-week due to logistics constraints.", {"state": "UP"})
vector_store.add_memory("Maharashtra shows strong increasing trends in Q4.", {"state": "Maharashtra"})
vector_store.add_memory("Delhi had a massive anomaly spike during Diwali 2023.", {"state": "Delhi"})

class CopilotRequest(BaseModel):
    query: str

@router.post("/chat")
def copilot_chat(request: CopilotRequest):
    if not settings.LLM_API_KEY:
        return {"response": "LLM API Key not configured. Copilot is currently offline."}
        
    try:
        # Retrieve context from memory
        memory_results = vector_store.search_memory(request.query, k=2)
        context_str = "\n".join([f"- {r['text']} (Context: {r['metadata']})" for r in memory_results])
        
        # System Prompt
        system_prompt = f"""
        You are TemporalAI Copilot, a highly advanced temporal intelligence assistant.
        You have access to the following memory context retrieved from our FAISS vector store:
        {context_str}
        
        Answer the user's question concisely, referencing the context if it is relevant. If the context doesn't answer the question, give general time-series advice or state that you don't have that specific data.
        """
        
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content(f"{system_prompt}\nUser Query: {request.query}")
        
        return {"response": response.text}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
