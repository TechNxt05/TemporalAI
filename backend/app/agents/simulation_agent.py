import copy

class SimulationAgent:
    def simulate_scenario(self, base_forecast: dict, scenario: dict):
        """
        Takes a base forecast dictionary and applies scenario modifiers.
        base_forecast = {"dates": [...], "predictions": [...], "actuals": {...}}
        scenario = {"demand_multiplier": 1.2, "event": "festival"}
        """
        simulated = copy.deepcopy(base_forecast)
        
        multiplier = scenario.get("demand_multiplier", 1.0)
        event = scenario.get("event", "none")
        
        preds = simulated["predictions"]
        
        for i in range(len(preds)):
            # Apply base multiplier
            new_val = preds[i] * multiplier
            
            # Apply event logic
            if event == "festival":
                # Assume festival spikes mid-forecast (e.g. week 4 of 8)
                if i in [3, 4]: 
                    new_val *= 1.5 
            elif event == "supply_chain_disruption":
                # Drop in early weeks
                if i in [0, 1, 2]:
                    new_val *= 0.6
                    
            preds[i] = new_val
            
        simulated["predictions"] = preds
        return simulated
