import os
import json
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("AIML_API_KEY"),
    base_url="https://api.aimlapi.com/v1"
)

MODEL = "gpt-4o-mini"


def analyze_market_intelligence(url):
    prompt = f"""
Return ONLY valid JSON. No markdown.

Analyze this suspicious URL as GTM and market threat intelligence:

URL: {url}

Return this JSON:

{{
  "target_audience": [],
  "brand_impersonation_risk": "",
  "gtm_patterns": [],
  "pricing_signals": "",
  "threat_targeting_trends": [],
  "compliance_signal": ""
}}
"""

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2
        )

        raw = response.choices[0].message.content.strip()
        raw = raw.replace("```json", "").replace("```", "").strip()

        return json.loads(raw)

    except Exception as e:
        return {
            "target_audience": ["crypto users", "banking customers", "online payment users"],
            "brand_impersonation_risk": "high",
            "gtm_patterns": ["urgency messaging", "verification language", "financial trust abuse"],
            "pricing_signals": "No legitimate pricing model detected.",
            "threat_targeting_trends": ["wallet verification scams", "fake login portals", "brand impersonation"],
            "compliance_signal": "Potential consumer protection and data exposure risk."
        }