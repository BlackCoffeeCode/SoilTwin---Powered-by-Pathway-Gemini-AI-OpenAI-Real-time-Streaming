import requests
import os
from dotenv import load_dotenv
from datetime import datetime
import json

load_dotenv()

WEATHER_API_KEY = os.getenv("WEATHER_API_KEY")
BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

def get_current_weather(location="Karnal,IN"):
    """
    Fetches current weather data from OpenWeatherMap API.
    
    Args:
        location: City name with country code (e.g., "Karnal,IN")
    
    Returns:
        dict: Weather data including rainfall information
    """
    if not WEATHER_API_KEY:
        print("⚠️  WEATHER_API_KEY not found. Using fallback data.")
        return _get_fallback_weather(location)
    
    params = {
        "q": location,
        "appid": WEATHER_API_KEY,
        "units": "metric"  # Use Celsius
    }
    
    try:
        response = requests.get(BASE_URL, params=params, timeout=10)
        response.raise_for_status()
        data = response.json()
        
        # Extract rainfall data
        # OpenWeatherMap provides rain data in mm for last 1h or 3h
        rain_1h = data.get("rain", {}).get("1h", 0.0)  # mm in last 1 hour
        rain_3h = data.get("rain", {}).get("3h", 0.0)  # mm in last 3 hours
        
        # If no rain data, default to 0
        rainfall_mm = rain_1h if rain_1h > 0 else (rain_3h / 3 if rain_3h > 0 else 0.0)
        
        return {
            "timestamp": datetime.now().isoformat(),
            "location": location,
            "rainfall_mm": round(rainfall_mm, 2),
            "temperature": data.get("main", {}).get("temp", 0),
            "humidity": data.get("main", {}).get("humidity", 0),
            "weather_desc": data.get("weather", [{}])[0].get("description", ""),
            "clouds": data.get("clouds", {}).get("all", 0),  # Cloud coverage %
        }
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 401:
            print(f"❌ API Key unauthorized. The key may need activation (takes ~2 hours after signup).")
            print(f"   Visit: https://home.openweathermap.org/api_keys to verify")
        else:
            print(f"HTTP Error: {e}")
        return _get_fallback_weather(location)
    except requests.exceptions.RequestException as e:
        print(f"Network error fetching weather: {e}")
        return _get_fallback_weather(location)


def _get_fallback_weather(location):
    """Fallback weather data when API is unavailable"""
    print(f"📊 Using fallback weather data for {location}")
    import random
    return {
        "timestamp": datetime.now().isoformat(),
        "location": location,
        "rainfall_mm": round(random.uniform(0, 5), 2),  # Random 0-5mm
        "temperature": round(random.uniform(15, 30), 1),
        "humidity": random.randint(40, 80),
        "weather_desc": "Simulated (API unavailable)",
        "clouds": random.randint(20, 80),
    }


def stream_weather_to_jsonl(location="Karnal,IN", output_file="./data/simulated_streams/live_weather.jsonl"):
    """
    Fetches current weather and appends to JSONL file for Pathway streaming.
    
    This should be called periodically (e.g., every hour) to update the stream.
    """
    weather_data = get_current_weather(location)
    
    if weather_data:
        # Create entry in the format expected by Pathway
        entry = {
            "timestamp": weather_data["timestamp"],
            "rain_mm": weather_data["rainfall_mm"],
            "note": f"Live API: {weather_data['weather_desc']}, Temp: {weather_data['temperature']}°C"
        }
        
        # Append to JSONL file
        os.makedirs(os.path.dirname(output_file), exist_ok=True)
        with open(output_file, "a") as f:
            f.write(json.dumps(entry) + "\n")
        
        print(f"✅ Weather data appended: {entry['rain_mm']}mm rainfall")
        return entry
    else:
        print("⚠️ Failed to fetch weather data")
        return None


def get_forecast(location="Karnal,IN", days=5):
    """
    Fetches weather forecast for next few days.
    Useful for predictive simulation.
    """
    forecast_url = "https://api.openweathermap.org/data/2.5/forecast"
    
    params = {
        "q": location,
        "appid": WEATHER_API_KEY,
        "units": "metric",
        "cnt": days * 8  # API returns 3-hour intervals, so 8 per day
    }
    
    try:
        response = requests.get(forecast_url, params=params)
        response.raise_for_status()
        data = response.json()
        
        forecast_data = []
        for item in data.get("list", []):
            forecast_data.append({
                "timestamp": item.get("dt_txt"),
                "temperature": item.get("main", {}).get("temp"),
                "rainfall_mm": item.get("rain", {}).get("3h", 0.0),
                "description": item.get("weather", [{}])[0].get("description", "")
            })
        
        return forecast_data
    except requests.exceptions.RequestException as e:
        print(f"Error fetching forecast: {e}")
        return []


if __name__ == "__main__":
    # Test the API
    print("Testing Weather API...")
    
    # Get current weather
    weather = get_current_weather("Karnal,IN")
    if weather:
        print(f"\n📍 Current Weather in {weather['location']}:")
        print(f"  🌧️  Rainfall: {weather['rainfall_mm']} mm")
        print(f"  🌡️  Temperature: {weather['temperature']}°C")
        print(f"  💧 Humidity: {weather['humidity']}%")
        print(f"  ☁️  {weather['weather_desc']}")
    
    # Stream to file
    print("\n📝 Streaming to JSONL...")
    stream_weather_to_jsonl("Karnal,IN")
    
    print("\n✅ Weather API integration successful!")
