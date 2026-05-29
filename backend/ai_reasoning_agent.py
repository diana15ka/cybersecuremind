import os
import json
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("AIML_API_KEY"),
    base_url="https://api.aimlapi.com/v1"
)

MODEL = "gpt-4o-mini"


def classify_threat(url, fraud_score, indicators, html):
    prompt = f"""
Return ONLY valid JSON. No markdown.

{{
  "threat_type": "",
  "confidence": 95,
  "severity": "",
  "financial_risk": "",
  "explanation": "",
  "recommended_action": ""
}}

Confidence must be an integer from 0 to 100.

Analyze:
URL: {url}
Fraud Score: {fraud_score}
Indicators: {indicators}
HTML Preview: {html[:800]}
"""

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2
        )

        raw = response.choices[0].message.content.strip()
        raw = raw.replace("```json", "").replace("```", "").strip()
        parsed = json.loads(raw)

        if parsed.get("confidence", 0) <= 1:
            parsed["confidence"] = int(parsed["confidence"] * 100)

        return parsed

    except Exception as e:
        return {
            "threat_type": "suspicious" if fraud_score >= 10 else "benign",
            "confidence": max(fraud_score, 20),
            "severity": "medium" if fraud_score >= 10 else "low",
            "financial_risk": "medium",
            "explanation": f"AI/ML API fallback used. Local fraud indicators: {indicators[:3]}",
            "recommended_action": "Avoid entering credentials, payment data, OTP codes, or wallet seed phrases."
        }


def generate_mitigation_advice(url, threat_type, severity, financial_risk, indicators):
    prompt = f"""
You are a cyber-financial safety assistant.

Give max 4 sentences of practical mitigation advice.

URL: {url}
Threat Type: {threat_type}
Severity: {severity}
Financial Risk: {financial_risk}
Indicators: {indicators}
"""

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )
        return response.choices[0].message.content.strip()

    except Exception:
        return "Do not enter passwords, card data, OTP codes, or crypto wallet seed phrases. Verify the domain through official channels and report the suspicious page."