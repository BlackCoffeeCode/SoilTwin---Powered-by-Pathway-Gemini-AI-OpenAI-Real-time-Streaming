#!/usr/bin/env python3
"""
Automated Weather Updater for SoilTwin
Fetches live weather data periodically and updates the stream
"""

import time
import schedule
from pathway_pipeline.weather_api import stream_weather_to_jsonl
import os

def update_weather():
    """Fetch and log current weather"""
    print(f"\n⏰ [{time.strftime('%H:%M:%S')}] Fetching live weather...")
    
    # Get location from profile or use default
    location = "Karnal,IN"
    if os.path.exists("./data/profile.json"):
        import json
        with open("./data/profile.json", "r") as f:
            profile = json.load(f)
            location = profile.get("location", "Karnal,IN")
    
    # Stream to file
    stream_weather_to_jsonl(location)
    print(f"✅ Weather update complete\n")

if __name__ == "__main__":
    print("🌦️  Starting SoilTwin Weather Service...")
    print("="*50)
    
    # Run immediately on start
    update_weather()
    
    # Schedule updates every hour
    schedule.every(1).hours.do(update_weather)
    
    print(f"📅 Scheduled: Updates every hour")
    print(f"💡 API Key Status: {'Valid' if os.getenv('WEATHER_API_KEY') else 'Missing'}")
    print(f"   If API returns 401, key needs activation (~2 hours)")
    print("="*50)
    print("\nPress Ctrl+C to stop...\n")
    
    # Keep running
    while True:
        schedule.run_pending()
        time.sleep(60)  # Check every minute
