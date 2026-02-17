"""
CRUD operations for Password Reset Tokens
"""

from ..database import password_reset_tokens_collection
from ..models.password_reset import generate_reset_token, get_token_expiry
from datetime import datetime
from bson import ObjectId

def create_reset_token(user_id: str) -> dict:
    """Create a new password reset token for a user"""
    # Delete any existing tokens for this user
    password_reset_tokens_collection.delete_many({"user_id": user_id})
    
    # Generate new token
    token = generate_reset_token()
    expires_at = get_token_expiry()
    
    token_doc = {
        "user_id": user_id,
        "token": token,
        "expires_at": expires_at,
        "used": False,
        "created_at": datetime.utcnow()
    }
    
    result = password_reset_tokens_collection.insert_one(token_doc)
    token_doc["_id"] = str(result.inserted_id)
    
    return {"token": token, "expires_at": expires_at}

def verify_reset_token(user_id: str, token: str) -> bool:
    """Verify if a reset token is valid and not expired"""
    token_doc = password_reset_tokens_collection.find_one({
        "user_id": user_id,
        "token": token,
        "used": False,
        "expires_at": {"$gt": datetime.utcnow()}
    })
    
    return token_doc is not None

def mark_token_used(user_id: str, token: str) -> None:
    """Mark a reset token as used"""
    password_reset_tokens_collection.update_one(
        {"user_id": user_id, "token": token},
        {"$set": {"used": True}}
    )

def delete_user_tokens(user_id: str) -> int:
    """Delete all reset tokens for a user"""
    result = password_reset_tokens_collection.delete_many({"user_id": user_id})
    return result.deleted_count
