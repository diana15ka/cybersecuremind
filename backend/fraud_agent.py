from bs4 import BeautifulSoup

SUSPICIOUS_WORDS = [
    "verify",
    "urgent",
    "wallet",
    "banking",
    "payment",
    "crypto",
    "password",
    "secure",
    "login",
    "telegram",
    "otp",
    "card"
]

def analyze_fraud(url, html):

    soup = BeautifulSoup(html, "html.parser")

    text = soup.get_text().lower()
    url_lower = url.lower()

    score = 0

    indicators = []

    # WORD ANALYSIS
    for word in SUSPICIOUS_WORDS:

        if word in text or word in url_lower:
            score += 10

            indicators.append(
                f"Suspicious keyword detected: {word}"
            )

    # LOGIN PAGE
    if "login" in url.lower():

        score += 20

        indicators.append(
            "Login page detected in URL"
        )

    # PASSWORD INPUT
    password_fields = soup.find_all("input", {"type": "password"})

    if password_fields:

        score += 20

        indicators.append(
            "Password input fields detected"
        )

    # FORMS
    forms = soup.find_all("form")

    if len(forms) > 0:

        score += 10

        indicators.append(
            "HTML forms detected"
        )

    # TELEGRAM LINKS
    if "telegram" in html.lower():

        score += 10

        indicators.append(
            "Telegram references detected"
        )

    # MANY EXTERNAL SCRIPTS
    scripts = soup.find_all("script")

    if len(scripts) > 15:

        score += 10

        indicators.append(
            "Large number of external scripts"
        )

    # THREAT LEVEL
    if score >= 80:
        threat = "High Risk Phishing"

    elif score >= 40:
        threat = "Suspicious"

    else:
        threat = "Low Risk"

    summary = (
        "AI agents detected suspicious infrastructure, "
        "possible phishing behavior and credential harvesting indicators."
    )

    return {
        "fraud_score": score,
        "threat": threat,
        "summary": summary,
        "indicators": indicators,
        "indicator_count": len(indicators)
    }