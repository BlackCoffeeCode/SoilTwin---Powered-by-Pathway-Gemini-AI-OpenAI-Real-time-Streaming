"""
CRUD operations for Refresh Tokens
"""

from ..database import refresh_tokens_collection
from ..models.refresh_token import generate_refresh_token, get_refresh_token_expiry
from datetime import datetime
from bson import ObjectId

def create_refresh_token(user_id: str) -> dict:
    """Create a new refresh token for a user"""
    token = generate_refresh_token()
    expires_at = get_refresh_token_expiry()
    
    token_doc = {
        "user_id": user_id,
        "token": token,
        "expires_at": expires_at,
        "revoked": False,
        "created_at": datetime.utcnow()
    }
    
    result = refresh_tokens_collection.insert_one(token_doc)
    token_doc["_id"] = str(result.inserted_id)
    
    return {"token": token, "expires_at": expires_at}

def verify_refresh_token(token: str) -> dict | None:
    """Verify if a refresh token is valid and not expired/revoked"""
    token_doc = refresh_tokens_collection.find_one({
        "token": token,
        "revoked": False,
        "expires_at": {"$gt": datetime.utcnow()}
    })
    
    if token_doc:
        token_doc["_id"] = str(token_doc["_id"])
    
    return token_doc

def revoke_refresh_token(token: str) -> bool:
    """Revoke a refresh token"""
    result = refresh_tokens_collection.update_one(
        {"token": token},
        {"$set": {"revoked": True}}
    )
    return result.modified_count > 0

def revoke_all_user_tokens(user_id: str) -> int:
    """Revoke all refresh tokens for a user (logout all devices)"""
    result = refresh_tokens_collection.update_many(
        {"user_id": user_id},
        {"$set": {"revoked": True}}
    )
    return result.modified_count

def cleanup_expired_tokens() -> int:
    """Delete all expired and revoked tokens"""
    result = refresh_tokens_collection.delete_many({
        "$or": [
            {"revoked": True},
            {"expires_at": {"$lt": datetime.utcnow()}}
        ]
    })
    return result.deleted_count
