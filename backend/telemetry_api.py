from fastapi import APIRouter
from database import SessionLocal, engine
from models import ThreatLog, Base

Base.metadata.create_all(bind=engine)

router = APIRouter()


@router.get("/api/telemetry")
def get_telemetry():
    db = SessionLocal()

    try:
        threats = db.query(ThreatLog).all()

        data = []

        for threat in threats:
            data.append({
                "url": threat.url,
                "city": threat.city,
                "country": threat.country,
                "latitude": threat.latitude,
                "longitude": threat.longitude,
                "severity": threat.severity,
                "fraud_score": threat.fraud_score,
                "confidence": threat.confidence,
            })

        return data

    finally:
        db.close()