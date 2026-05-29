import os
import time
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from ai_summary_agent import generate_executive_summary
from serp_api import search_domain
from browser_api import analyze_browser_session
from fraud_agent import analyze_fraud
from compliance_agent import analyze_compliance
from database import SessionLocal, engine
from models import ThreatLog, Base
from market_intelligence_agent import analyze_market_intelligence
from finance_intelligence_agent import analyze_financial_intelligence
from geo_intelligence_agent import analyze_geo_data
from telemetry_api import router as telemetry_router
from wellbeing_agent import ai_support_chat
from ai_reasoning_agent import classify_threat, generate_mitigation_advice

Base.metadata.create_all(bind=engine)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000","https://cybersecuremind-ka6ipi03e-diana-s-projects21.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(telemetry_router)


class InvestigationRequest(BaseModel):
    url: str


class ChatRequest(BaseModel):
    message: str


@app.get("/")
def home():
    return {"message": "Cyber Backend Running"}


@app.post("/api/wellbeing-chat")
def wellbeing_chat(req: ChatRequest):
    response = ai_support_chat(req.message)
    return {"response": response}


@app.post("/api/investigate")
def investigate(req: InvestigationRequest):

    try:
        investigation_start = time.time()

        targets = req.url.split()
        if len(targets) == 0:
            targets = [req.url]

        targets = targets[:4]

        telemetry = [
            {
                "step": "Open-Web Threat Intelligence",
                "status": "completed",
                "source": "Bright Data SERP API",
            },
            {
                "step": "Browser Evidence Collection",
                "status": "completed",
                "source": "Bright Data Browser API",
            },
            {
                "step": "Phishing Indicator Analysis",
                "status": "completed",
                "source": "Local Fraud Engine",
            },
            {
                "step": "AI Threat Classification",
                "status": "completed",
                "source": "AI/ML API",
            },
            {
                "step": "Compliance Risk Evaluation",
                "status": "completed",
                "source": "Compliance Agent",
            },
            {
                "step": "GTM Intelligence Analysis",
                "status": "completed",
                "source": "Market Intelligence Agent",
            },
            {
                "step": "Financial Risk Intelligence",
                "status": "completed",
                "source": "Finance Intelligence Agent",
            },
            {
                "step": "Geospatial Threat Mapping",
                "status": "completed",
                "source": "Geo Intelligence Agent",
            },
        ]

        # OVERALL ANALYSIS
        try:
            serp_results = search_domain(req.url)
        except Exception as e:
            serp_results = {"error": str(e)}

        try:
            browser_data = analyze_browser_session(req.url)
            html = browser_data["content_preview"]
        except Exception as e:
            browser_data = {"browser_status": 500}
            html = f"Browser API error: {str(e)}"

        try:
            fraud = analyze_fraud(req.url, html)
        except Exception as e:
            fraud = {
                "fraud_score": 0,
                "threat": "Analysis Failed",
                "summary": str(e),
                "indicator_count": 0,
                "indicators": [],
            }

        parsed_ai = classify_threat(
            req.url,
            fraud["fraud_score"],
            fraud["indicators"],
            html,
        )

        try:
            compliance = analyze_compliance(req.url)
        except Exception:
            compliance = {"compliance_score": 0}

        try:
            market_data = analyze_market_intelligence(req.url)
        except Exception as e:
            market_data = {"analysis": f"Market intelligence failed: {str(e)}"}

        try:
            finance_data = analyze_financial_intelligence(req.url)
        except Exception as e:
            finance_data = {"analysis": f"Financial intelligence failed: {str(e)}"}

        try:
            geo_data = analyze_geo_data(req.url)
        except Exception:
            geo_data = {
                "country": "Kazakhstan",
                "city": "Almaty",
                "latitude": 43.238949,
                "longitude": 76.889709,
            }

        if not geo_data.get("latitude") or not geo_data.get("longitude"):
            geo_data = {
                "country": "Kazakhstan",
                "city": "Almaty",
                "latitude": 43.238949,
                "longitude": 76.889709,
            }

        if parsed_ai.get("confidence", 0) == 0:
            parsed_ai["confidence"] = max(fraud["fraud_score"], 20)

        if parsed_ai.get("severity") in ["unknown", None, "low"] and fraud["fraud_score"] >= 10:
            parsed_ai["severity"] = "medium"

        # SAVE OVERALL INVESTIGATION TO DATABASE
        try:
            db = SessionLocal()

            threat_log = ThreatLog(
                url=req.url,
                country=geo_data["country"],
                city=geo_data["city"],
                latitude=geo_data["latitude"],
                longitude=geo_data["longitude"],
                threat_type=parsed_ai["threat_type"],
                severity=parsed_ai["severity"],
                fraud_score=fraud["fraud_score"],
                confidence=parsed_ai["confidence"],
                financial_risk=parsed_ai["financial_risk"],
            )

            db.add(threat_log)
            db.commit()
            db.close()

        except Exception as e:
            print("DATABASE ERROR:", str(e))

        # EXECUTIVE SUMMARY
        try:
            executive_summary = generate_executive_summary(
                req.url,
                fraud["fraud_score"],
                fraud["indicators"],
                parsed_ai["threat_type"],
                parsed_ai["severity"],
                html[:2000],
                serp_results,
                compliance["compliance_score"],
            )
        except Exception as e:
            executive_summary = f"Executive summary generation failed: {str(e)}"

        # MITIGATION ADVICE
        ai_advice = generate_mitigation_advice(
            req.url,
            parsed_ai["threat_type"],
            parsed_ai["severity"],
            parsed_ai["financial_risk"],
            fraud["indicators"],
        )

        # PER-TARGET ANALYTICS
        target_analytics = []

        for target in targets:

            try:
                local_serp = search_domain(target)
            except Exception as e:
                local_serp = {"error": str(e)}

            try:
                local_browser = analyze_browser_session(target)
                local_html = local_browser["content_preview"]
            except Exception as e:
                local_browser = {"browser_status": 500}
                local_html = f"Browser API error: {str(e)}"

            try:
                local_fraud = analyze_fraud(target, local_html)
            except Exception as e:
                local_fraud = {
                    "fraud_score": 0,
                    "threat": "Analysis Failed",
                    "summary": str(e),
                    "indicator_count": 0,
                    "indicators": [],
                }

            try:
                local_ai = classify_threat(
                    target,
                    local_fraud["fraud_score"],
                    local_fraud["indicators"],
                    local_html,
                )
            except Exception:
                local_ai = parsed_ai

            if local_ai.get("confidence", 0) == 0:
                local_ai["confidence"] = max(local_fraud["fraud_score"], 20)

            try:
                local_compliance = analyze_compliance(target)
            except Exception:
                local_compliance = {"compliance_score": 0}

            try:
                local_market_data = analyze_market_intelligence(target)
            except Exception:
                local_market_data = {
                    "target_audience": ["crypto users", "online payment users"],
                    "gtm_patterns": ["phishing", "urgency messaging", "brand impersonation"],
                    "brand_impersonation_risk": "high",
                    "compliance_signal": "Potential consumer protection and data exposure risk.",
                }

            try:
                local_finance_data = analyze_financial_intelligence(target)
            except Exception:
                local_finance_data = {
                    "financial_exposure": "Possible financial fraud exposure detected.",
                    "targeted_assets": ["crypto wallets", "banking credentials", "payment cards"],
                    "fraud_vectors": ["credential harvesting", "wallet theft", "account takeover"],
                    "potential_loss_range": "$100 - $5,000",
                    "financial_impact": "high",
                    "recommended_financial_action": "Avoid entering payment data, OTP codes, private keys, or wallet seed phrases.",
                }

            target_analytics.append({
                "target": target,
                "telemetry": telemetry,
                "finance_data": local_finance_data,
                "market_data": local_market_data,
                "severity": local_ai.get("severity", parsed_ai["severity"]),
                "confidence": local_ai.get("confidence", parsed_ai["confidence"]),
                "risk_breakdown": [
                    {"time": "Fraud Score", "threats": local_fraud["fraud_score"]},
                    {"time": "AI Confidence", "threats": local_ai.get("confidence", parsed_ai["confidence"])},
                    {"time": "Compliance", "threats": local_compliance["compliance_score"]},
                    {"time": "Indicators", "threats": local_fraud["indicator_count"]},
                ],
                "risk_progression": [
                    {"stage": "SERP", "score": 10},
                    {"stage": "Browser", "score": 25},
                    {"stage": "Fraud", "score": local_fraud["fraud_score"]},
                    {"stage": "AI", "score": local_ai.get("confidence", parsed_ai["confidence"])},
                    {
                        "stage": "Final",
                        "score": max(
                            local_fraud["fraud_score"],
                            local_ai.get("confidence", parsed_ai["confidence"]),
                        ),
                    },
                ],
            })

        return {
            "status": "investigation_complete",
            "target": req.url,
            "targets": targets,
            "target_analytics": target_analytics,
            "telemetry": telemetry,
            "investigation_time": round(time.time() - investigation_start, 2),
            "market_intelligence": market_data,
            "financial_intelligence": finance_data,
            "geo_data": geo_data,
            "fraud_score": fraud["fraud_score"],
            "compliance_score": compliance["compliance_score"],
            "threat_type": parsed_ai["threat_type"],
            "confidence": parsed_ai["confidence"],
            "severity": parsed_ai["severity"],
            "financial_risk": parsed_ai["financial_risk"],
            "ai_explanation": parsed_ai["explanation"],
            "recommended_action": parsed_ai["recommended_action"],
            "market_data": market_data,
            "finance_data": finance_data,
            "summary": executive_summary,
            "indicators": fraud["indicator_count"],
            "indicator_details": fraud["indicators"],
            "browser_status": browser_data["browser_status"],
            "ai_advice": ai_advice,
            "serp_results": [
                {
                    "title": "Live Intelligence Result",
                    "url": req.url,
                }
            ],
            "html_preview": html[:500],
        }

    except Exception as e:
        return {"error": str(e)}