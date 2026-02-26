"""
Password Reset Token model for MongoDB
"""

from pydantic import BaseModel
from datetime import datetime, timedelta
import random
import string

class PasswordResetToken(BaseModel):
    """Password reset token"""
    user_id: str
    token: str  # 6-digit code
    expires_at: datetime
    used: bool = False
    created_at: datetime = datetime.utcnow()

def generate_reset_token() -> str:
    """Generate 6-digit reset token"""
    return ''.join(random.choices(string.digits, k=6))

def get_token_expiry() -> datetime:
    """Get token expiration time (15 minutes from now)"""
    return datetime.utcnow() + timedelta(minutes=15)
