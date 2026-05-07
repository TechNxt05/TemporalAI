from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import ModelRegistry
from app.pipelines.training import TrainingPipeline
from app.agents.insight_agent import InsightAgent
from app.core.config import settings
import json
import os

router = APIRouter()

def get_forecasts_data():
    path = os.path.join(settings.MODELS_DIR, 'forecasts.json')
    if os.path.exists(path):
        with open(path, 'r') as f:
            return json.load(f)
    return {}

@router.post("/train")
def train_models(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    def run_pipeline():
        pipeline = TrainingPipeline(db)
        pipeline.run()
        
    background_tasks.add_task(run_pipeline)
    return {"message": "Training started in background. Check /metrics or /compare later."}

@router.post("/retrain")
def retrain_models(background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    return train_models(background_tasks, db)

@router.get("/forecast")
def get_forecast(state: str):
    data = get_forecasts_data()
    if state not in data:
        raise HTTPException(status_code=404, detail="Forecast not found for state. Please train models first.")
    return data[state]

@router.get("/compare")
def compare_models(state: str, db: Session = Depends(get_db)):
    models = db.query(ModelRegistry).filter(ModelRegistry.state == state).order_by(ModelRegistry.rmse.asc()).all()
    if not models:
        raise HTTPException(status_code=404, detail="No models found for this state.")
    return [
        {
            "model_name": m.model_name,
            "rmse": m.rmse,
            "mape": m.mape,
            "mae": m.mae,
            "timestamp": m.timestamp
        } for m in models
    ]

@router.get("/metrics")
def get_global_metrics(db: Session = Depends(get_db)):
    models = db.query(ModelRegistry).all()
    if not models:
        return {"message": "No models trained yet."}
    
    # Just return the best model for each state
    best_models = {}
    for m in models:
        if m.state not in best_models or m.rmse < best_models[m.state]['rmse']:
            best_models[m.state] = {
                "model_name": m.model_name,
                "rmse": m.rmse,
                "mape": m.mape
            }
    return best_models

@router.get("/explain")
def get_explanation(state: str, db: Session = Depends(get_db)):
    data = get_forecasts_data()
    if state not in data:
        raise HTTPException(status_code=404, detail="Forecast not found.")
        
    best_model = db.query(ModelRegistry).filter(ModelRegistry.state == state).order_by(ModelRegistry.rmse.asc()).first()
    if not best_model:
        raise HTTPException(status_code=404, detail="Model metrics not found.")
        
    insight_agent = InsightAgent()
    metrics = {"rmse": best_model.rmse, "mape": best_model.mape}
    explanation = insight_agent.generate_insight(
        state=state,
        best_model=best_model.model_name,
        metrics=metrics,
        recent_data=data[state]['actuals']['values'][-4:],
        forecast=data[state]['predictions'][:4]
    )
    return {"explanation": explanation}
