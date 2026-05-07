import os
import google.generativeai as genai
from app.core.config import settings

class InsightAgent:
    def __init__(self):
        self.api_key = settings.LLM_API_KEY
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
        else:
            self.model = None

    def generate_insight(self, state: str, best_model: str, metrics: dict, recent_data: list, forecast: list) -> str:
        if not self.model:
            return "LLM integration is disabled because LLM_API_KEY is not set. However, we can see the forecast shows general trends based on the historical data."

        prompt = f"""
        You are a senior data science advisor analyzing a time series forecast.
        State: {state}
        Best performing model: {best_model}
        Model metrics: RMSE: {metrics['rmse']:.2f}, MAPE: {metrics['mape']:.2f}%
        
        Recent actual sales (last 4 periods): {recent_data}
        Forecasted sales (next 4 periods): {forecast}
        
        Please provide a concise (3-4 sentences), professional, plain English explanation of the upcoming trends. 
        Explain what the forecast means, mention any obvious seasonality or trend, and explain why this model might have been chosen based on the metrics.
        """
        
        try:
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Could not generate insights due to an error: {e}"
