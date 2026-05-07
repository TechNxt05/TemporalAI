from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import os
import json
from app.core.config import settings
from app.agents.simulation_agent import SimulationAgent

router = APIRouter()
simulation_agent = SimulationAgent()

class Scenario(BaseModel):
    demand_multiplier: Optional[float] = 1.0
    event: Optional[str] = "none"

class SimulationRequest(BaseModel):
    state: str
    scenario: Scenario

def get_forecasts_data():
    path = os.path.join(settings.MODELS_DIR, 'forecasts.json')
    if os.path.exists(path):
        with open(path, 'r') as f:
            return json.load(f)
    return {}

@router.post("/simulate")
def run_simulation(request: SimulationRequest):
    data = get_forecasts_data()
    if request.state not in data:
        raise HTTPException(status_code=404, detail="Forecast not found for state. Please train models first.")
        
    base_forecast = data[request.state]
    scenario_dict = {
        "demand_multiplier": request.scenario.demand_multiplier,
        "event": request.scenario.event
    }
    
    simulated_forecast = simulation_agent.simulate_scenario(base_forecast, scenario_dict)
    
    return {
        "state": request.state,
        "scenario": scenario_dict,
        "base_forecast": base_forecast,
        "simulated_forecast": simulated_forecast
    }
