def analyze_compliance(url):

    score = 35

    suspicious = [
        "wallet",
        "crypto",
        "investment",
        "bank"
    ]

    for word in suspicious:
        if word in url.lower():
            score += 15

    return {
        "compliance_score": score
    }