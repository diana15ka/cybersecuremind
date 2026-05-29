from sqlalchemy import Column, Integer, String, DateTime, Float
from datetime import datetime
from database import Base

class ThreatLog(Base):

    __tablename__ = "threat_logs"

    id = Column(Integer, primary_key=True, index=True)

    url = Column(String)

    country = Column(String)

    city = Column(String)

    threat_type = Column(String)

    severity = Column(String)

    fraud_score = Column(Integer)

    confidence = Column(Integer)

    financial_risk = Column(String)

    timestamp = Column(DateTime, default=datetime.utcnow)
    
    latitude = Column(Float)
    
    longitude = Column(Float)