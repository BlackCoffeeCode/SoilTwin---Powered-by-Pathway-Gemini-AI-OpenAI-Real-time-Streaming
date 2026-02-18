"""
MongoDB Database Configuration
Cloud-hosted MongoDB Atlas connection with SSL support
"""

from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import os
from dotenv import load_dotenv
import certifi

load_dotenv()

# MongoDB connection (with SSL certificate bundle)
MONGODB_URL = os.getenv("MONGODB_URL")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "soiltwin")

# Mock DB implementation for offline/restricted environments
class MockCollection:
    def __init__(self, name, data=None):
        self.name = name
        self.data = data or []

    def find_one(self, query):
        for item in self.data:
            match = True
            for k, v in query.items():
                if item.get(k) != v:
                    match = False
                    break
            if match: return item
        return None

    def insert_one(self, document):
        self.data.append(document)
        return type("InsertResult", (), {"inserted_id": "mock_id"})()
    
    def update_one(self, query, update):
        # Basic mock update
        item = self.find_one(query)
        if item and "$set" in update:
            item.update(update["$set"])
        return type("UpdateResult", (), {"modified_count": 1 if item else 0})()

    def create_index(self, keys, **kwargs):
        pass # No-op for mock

class MockDatabase:
    def __init__(self):
        # Pre-seed users for multi-user demo
        # Password for both is 'password' (hashed)
        self.users = MockCollection("users", [{
            "_id": "mock_farmer_id",
            "username": "farmer",
            "email": "farmer@soiltwin.com",
            # "password"
            "hashed_password": "$2b$12$9zoFmDLrlyVNybIKwlAH7.yEZe5XzeJKHWBkSnmwgS3txOv5BK72K",
            "full_name": "Ramesh Kumar (Farmer 1)",
            "disabled": False,
            "role": "farmer"
        }, {
            "_id": "mock_farmer2_id",
            "username": "farmer2",
            "email": "farmer2@soiltwin.com",
            # "password"
            "hashed_password": "$2b$12$9zoFmDLrlyVNybIKwlAH7.yEZe5XzeJKHWBkSnmwgS3txOv5BK72K",
            "full_name": "Suresh Singh (Farmer 2)",
            "disabled": False,
            "role": "farmer"
        }])
        self.password_reset_tokens = MockCollection("password_reset_tokens")
        self.refresh_tokens = MockCollection("refresh_tokens")
    
    def __getitem__(self, name):
        return getattr(self, name, MockCollection(name))

# Try connecting to real DB, fallback to Mock
try:
    client = MongoClient(
        MONGODB_URL, 
        tlsCAFile=certifi.where(),
        tlsAllowInvalidCertificates=True,
        serverSelectionTimeoutMS=5000,
        connectTimeoutMS=5000,
        socketTimeoutMS=5000
    )
    client.admin.command('ping')
    print("✅ MongoDB Atlas connection successful!")
    db = client[MONGODB_DB_NAME]
    
    # raise Exception("Forcing MockDB for testing")
    
    users_collection = db["users"]
    password_reset_tokens_collection = db["password_reset_tokens"]
    refresh_tokens_collection = db["refresh_tokens"]

except Exception as e:
    print(f"⚠️ MongoDB Connection Failed: {e}")
    print("⚠️ Switching to IN-MEMORY MOCK DATABASE (Offline Mode)")
    db = MockDatabase()
    users_collection = db.users
    password_reset_tokens_collection = db.password_reset_tokens
    refresh_tokens_collection = db.refresh_tokens

def get_db():
    return db

def test_connection():
    if isinstance(db, MockDatabase):
        print("⚠️ Using Mock Database")
        return True
    try:
        client.admin.command('ping')
        return True
    except:
        return False

def init_db():
    if isinstance(db, MockDatabase):
        print("✅ Mock Database initialized")
        return
        
    users_collection.create_index("username", unique=True)
    users_collection.create_index("email", unique=True)
    password_reset_tokens_collection.create_index("expires_at", expireAfterSeconds=0)
    password_reset_tokens_collection.create_index([("user_id", 1), ("token", 1)])
    refresh_tokens_collection.create_index("expires_at", expireAfterSeconds=0)
    refresh_tokens_collection.create_index("token", unique=True)
    refresh_tokens_collection.create_index("user_id")
    print("✅ Database indexes created")
