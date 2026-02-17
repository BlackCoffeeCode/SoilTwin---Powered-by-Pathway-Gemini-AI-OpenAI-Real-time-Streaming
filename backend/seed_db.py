"""
Seed MongoDB Atlas with initial users
"""

import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from database import test_connection, init_db
from crud.user_crud import create_user, get_user_by_username

def seed_users():
    """Seed initial admin and farmer users to MongoDB Atlas"""
    
    # Test connection first
    print("🔌 Testing MongoDB Atlas connection...")
    if not test_connection():
        print("❌ Failed to connect to MongoDB Atlas. Check your connection string.")
        return
    
    # Initialize indexes
    init_db()
    
    try:
        # Check if admin already exists
        if not get_user_by_username("admin"):
            create_user(
                username="admin",
                email="admin@soiltwin.com",
                fullname="System Administrator",
                password="admin123",
                role="admin"
            )
            print("✅ Created admin user in MongoDB Atlas")
        else:
            print("ℹ️  Admin user already exists")
        
        # Check if farmer already exists
        if not get_user_by_username("farmer"):
            create_user(
                username="farmer",
                email="farmer@soiltwin.com",
                fullname="Demo Farmer",
                password="farmer123",
                role="farmer"
            )
            print("✅ Created farmer user in MongoDB Atlas")
        else:
            print("ℹ️  Farmer user already exists")
        
        print("\n🌱 MongoDB Atlas seeded successfully!")
        print("Login credentials:")
        print("  Admin:  username='admin',  password='admin123'")
        print("  Farmer: username='farmer', password='farmer123'")
        print(f"\n💾 Database: {os.getenv('MONGODB_DB_NAME', 'soiltwin')}")
        print("☁️  Hosted on: MongoDB Atlas")
        
    except Exception as e:
        print(f"❌ Error seeding MongoDB Atlas: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    seed_users()
