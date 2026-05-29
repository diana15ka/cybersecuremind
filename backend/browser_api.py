import requests
import os

API_KEY = os.getenv("BRIGHTDATA_API_KEY")

def analyze_browser_session(target_url):

    url = "https://api.brightdata.com/request"

    payload = {
        "zone": os.getenv("BROWSER_ZONE"),
        "url": target_url,
        "format": "raw"
    }

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(
            url,
            json=payload,
            headers=headers,
            timeout=90
        )

        return {
            "browser_status": response.status_code,
            "content_preview": response.text[:2000]
        }

    except Exception as e:
        return {
            "browser_status": "error",
            "content_preview": str(e)
        }