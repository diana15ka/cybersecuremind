import os
from openai import OpenAI

client = OpenAI(
    api_key=os.getenv("AIML_API_KEY"),
    base_url="https://api.aimlapi.com/v1"
)

MODEL = "gpt-4o-mini"


def generate_executive_summary(url,
    fraud_score,
    indicators,
    threat_type,
    severity,
    html_preview,
    serp_results,
    compliance_score):
    prompt = f"""
You are an enterprise cyber-financial intelligence analyst.

Generate a concise executive incident summary.

URL:
{url}

Threat Type:
{threat_type}

Severity:
{severity}

Fraud Score:
{fraud_score}

Compliance Score:
{compliance_score}

Detected Indicators:
{indicators}

Browser Intelligence:
{html_preview}

SERP Intelligence:
{serp_results}

Produce:

1. Executive Summary
2. Threat Assessment
3. Financial Risk Assessment
4. Compliance Impact
5. Recommended Actions
Maximum 250 words.

Base conclusions ONLY on provided evidence.
"""

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3
        )
        return response.choices[0].message.content.strip()

    except Exception:
        return (
            f"The investigated target shows {threat_type} risk with {severity} severity. "
            "Local indicators suggest possible social engineering, phishing, or financial fraud behavior."
        )