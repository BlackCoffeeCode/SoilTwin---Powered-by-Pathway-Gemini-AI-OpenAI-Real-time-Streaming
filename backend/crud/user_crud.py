"""
CRUD operations for User model with MongoDB
"""

from ..database import users_collection
from typing import Optional
from datetime import datetime
import bcrypt

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    
    # Check password
    try:
        # Explicit encoding to handle potential string/byte mismatches
        pp_bytes = plain_password.encode('utf-8')
        hp_bytes = hashed_password.encode('utf-8')
        
        is_match = bcrypt.checkpw(pp_bytes, hp_bytes)
        return is_match
    except Exception as e:
        return False

def create_user(username: str, email: str, fullname: str, 
                password: str, role: str = "farmer") -> dict:
    """Create a new user in MongoDB"""
    user_doc = {
        "username": username,
        "email": email,
        "fullname": fullname,
        "hashed_password": hash_password(password),
        "role": role,
        "disabled": False,
        "created_at": datetime.utcnow(),
        "updated_at": None
    }
    
    result = users_collection.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    return user_doc

def get_user_by_username(username: str) -> Optional[dict]:
    """Get user by username from MongoDB"""
    return users_collection.find_one({"username": username})

def get_user_by_email(email: str) -> Optional[dict]:
    """Get user by email from MongoDB"""
    return users_collection.find_one({"email": email})

def get_user_by_id(user_id: str) -> Optional[dict]:
    """Get user by ID from MongoDB"""
    from bson import ObjectId
    return users_collection.find_one({"_id": ObjectId(user_id)})

def update_user(username: str, **kwargs) -> Optional[dict]:
    """Update user fields in MongoDB"""
    kwargs["updated_at"] = datetime.utcnow()
    
    result = users_collection.update_one(
        {"username": username},
        {"$set": kwargs}
    )
    
    if result.modified_count > 0:
        return get_user_by_username(username)
    return None

def delete_user(username: str) -> bool:
    """Delete a user from MongoDB"""
    result = users_collection.delete_one({"username": username})
    return result.deleted_count > 0

def get_all_users(skip: int = 0, limit: int = 100):
    """Get all users from MongoDB"""
    return list(users_collection.find().skip(skip).limit(limit))

def update_user_password(user_id: str, new_password: str) -> bool:
    """Update user password by user ID"""
    from bson import ObjectId
    hashed_password = hash_password(new_password)
    
    result = users_collection.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {
            "hashed_password": hashed_password,
            "updated_at": datetime.utcnow()
        }}
    )
    
    return result.modified_count > 0
