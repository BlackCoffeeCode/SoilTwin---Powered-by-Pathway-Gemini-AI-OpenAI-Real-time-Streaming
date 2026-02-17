"""
Seed MongoDB Atlas with initial users
"""

import sys
import os

# Add the parent directory (project root) to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend.database import test_connection, init_db
from backend.crud.user_crud import create_user, get_user_by_username

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

        # Check if farmer2 already exists
        if not get_user_by_username("farmer2"):
            create_user(
                username="farmer2",
                email="farmer2@soiltwin.com",
                fullname="Suresh Singh (Farmer 2)",
                password="farmer123",
                role="farmer"
            )
            print("✅ Created farmer2 user in MongoDB Atlas")
        else:
            print("ℹ️  Farmer2 user already exists")
        
        print("\n🌱 MongoDB Atlas seeded successfully!")
        print("Login credentials:")
        print("  Admin:   username='admin',   password='admin123'")
        print("  Farmer:  username='farmer',  password='farmer123'")
        print("  Farmer2: username='farmer2', password='farmer123'")
        print(f"\n💾 Database: {os.getenv('MONGODB_DB_NAME', 'soiltwin')}")
        print("☁️  Hosted on: MongoDB Atlas")
        
    except Exception as e:
        print(f"❌ Error seeding MongoDB Atlas: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    seed_users()
