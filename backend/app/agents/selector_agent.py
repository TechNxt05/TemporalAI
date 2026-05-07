from sqlalchemy.orm import Session
from app.db.models import ModelRegistry

class SelectorAgent:
    def __init__(self, db: Session):
        self.db = db

    def select_best_model(self, state: str, results: dict):
        best_model = None
        best_rmse = float('inf')
        best_metrics = None
        best_path = None
        
        for name, data in results.items():
            metrics = data['metrics']
            path = data['path']
            
            # Simple selection based on RMSE
            if metrics['rmse'] < best_rmse:
                best_rmse = metrics['rmse']
                best_model = name
                best_metrics = metrics
                best_path = path
                
            # Log all models to DB or just best? The prompt says "compares models... selects best model per state" 
            # I will store the best model in the DB
            
        if best_model:
            db_model = ModelRegistry(
                state=state,
                model_name=best_model,
                rmse=best_metrics['rmse'],
                mape=best_metrics['mape'],
                mae=best_metrics['mae'],
                model_path=best_path
            )
            self.db.add(db_model)
            self.db.commit()
            
        return best_model, best_metrics, best_path
