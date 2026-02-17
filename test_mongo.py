
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import certifi

load_dotenv()

def test_mongo():
    url = os.getenv("MONGODB_URL")
    print(f"Testing connection to: {url.split('@')[1]}")
    try:
        # Replicating database.py config
        client = MongoClient(
            url, 
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=30000,
            connectTimeoutMS=30000,
            socketTimeoutMS=30000
        )
        print("Attempting ping...")
        client.admin.command('ping')
        print("✅ MongoDB Connection Successful!")
    except Exception as e:
        print(f"❌ MongoDB Connection Failed: {e}")

if __name__ == "__main__":
    test_mongo()
