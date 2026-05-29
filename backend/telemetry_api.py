from fastapi import APIRouter
from database import SessionLocal
from models import ThreatLog

router = APIRouter()


@router.get("/api/telemetry")
def get_telemetry():
    try:
        db = SessionLocal()

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

        db.close()
        return data

    except Exception as e:
        return {
            "telemetry_error": str(e),
            "error_type": type(e).__name__
        }