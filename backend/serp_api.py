import requests
import os

API_KEY = os.getenv("BRIGHTDATA_API_KEY")
SERP_ZONE = os.getenv("SERP_ZONE")

def search_domain(query):

    url = "https://api.brightdata.com/request"

    payload = {
        "zone": SERP_ZONE,
        "url": f"https://www.google.com/search?q={query}",
        "format": "json"
    }

    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    response = requests.post(
        url,
        json=payload,
        headers=headers
    )

    return response.json()