import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./temporalai.db")
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    DATA_PATH: str = os.getenv("DATA_PATH", "../Forecasting Case- Study.xlsx")
    MODELS_DIR: str = os.getenv("MODELS_DIR", "./saved_models")

    class Config:
        env_file = ".env"

settings = Settings()

os.makedirs(settings.MODELS_DIR, exist_ok=True)
