import os
import json
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("AIML_API_KEY"),
    base_url="https://api.aimlapi.com/v1"
)

MODEL = "gpt-4o-mini"


def analyze_financial_intelligence(url):
    prompt = f"""
Potential loss range must be estimated based on the URL context.
For crypto-wallet scams, use a higher range.
For simple phishing, use a lower range.
Do not always return the same number.
Analyze this suspicious URL as financial fraud intelligence:

URL: {url}

Return this JSON:

{{
  "financial_exposure": "",
  "targeted_assets": [],
  "fraud_vectors": [],
  "potential_loss_range": "",
  "financial_impact": "",
  "recommended_financial_action": ""
}}
Return ONLY valid JSON. No markdown.
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
            "financial_exposure": "Possible financial fraud exposure detected.",
            "targeted_assets": ["crypto wallets", "banking credentials", "payment cards"],
            "fraud_vectors": ["credential harvesting", "wallet theft", "account takeover"],
            "potential_loss_range": "$100 - $5,000",
            "financial_impact": "high",
            "recommended_financial_action": "Do not enter payment details, passwords, OTP codes, private keys, or wallet seed phrases."
        }