import requests
import os

AIML_API_KEY = os.getenv("AIML_API_KEY")

def ai_support_chat(user_message):

    prompt = f"""
    You are a cyber wellbeing AI assistant.

    Help users experiencing:

    - scam anxiety
    - cyber harassment
    - financial stress
    - phishing fear
    - identity theft concerns

    Be calm, supportive, intelligent,
    and cybersecurity-aware.

    USER:
    {user_message}
    """

    response = requests.post(

        "https://api.aimlapi.com/v1/chat/completions",

        headers={
            "Authorization": f"Bearer {AIML_API_KEY}",
            "Content-Type": "application/json"
        },

        json={

            "model": "gpt-4o",

            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        }
    )

    data = response.json()

    return data["choices"][0]["message"]["content"]