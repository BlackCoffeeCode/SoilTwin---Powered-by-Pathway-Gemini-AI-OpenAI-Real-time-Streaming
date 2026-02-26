"""
Refresh Token model for MongoDB
"""

from pydantic import BaseModel
from datetime import datetime, timedelta
import secrets

class RefreshToken(BaseModel):
    """Refresh token for long-lived sessions"""
    user_id: str
    token: str  # Secure random token
    expires_at: datetime
    revoked: bool = False
    created_at: datetime = datetime.utcnow()

def generate_refresh_token() -> str:
    """Generate secure refresh token (32 bytes = 64 hex chars)"""
    return secrets.token_hex(32)

def get_refresh_token_expiry() -> datetime:
    """Get refresh token expiration time (30 days from now)"""
    return datetime.utcnow() + timedelta(days=30)
