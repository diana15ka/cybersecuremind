import random

LOCATIONS = [

    {
        "city": "Almaty",
        "country": "Kazakhstan",
        "latitude": 43.238949,
        "longitude": 76.889709
    },

    {
        "city": "Astana",
        "country": "Kazakhstan",
        "latitude": 51.1605,
        "longitude": 71.4704
    },

    {
        "city": "Shymkent",
        "country": "Kazakhstan",
        "latitude": 42.3417,
        "longitude": 69.5901
    },

    {
        "city": "Karaganda",
        "country": "Kazakhstan",
        "latitude": 49.8047,
        "longitude": 73.1094
    },

    {
        "city": "Aktobe",
        "country": "Kazakhstan",
        "latitude": 50.2839,
        "longitude": 57.1669
    }
]

def analyze_geo_data(url):

    selected = random.choice(LOCATIONS)

    return selected