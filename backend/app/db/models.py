from sqlalchemy import Column, Integer, String, Float, DateTime
from app.db.database import Base
import datetime

class ModelRegistry(Base):
    __tablename__ = "model_registry"

    id = Column(Integer, primary_key=True, index=True)
    state = Column(String, index=True)
    model_name = Column(String)
    rmse = Column(Float)
    mape = Column(Float)
    mae = Column(Float)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    model_path = Column(String)
