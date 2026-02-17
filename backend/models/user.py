"""
User model for MongoDB
Simple Pydantic model without ObjectId complexity
"""

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserInDB(BaseModel):
    """User model stored in MongoDB"""
    username: str
    email: EmailStr
    fullname: str
    hashed_password: str
    role: str = "farmer"
    disabled: bool = False
    created_at: datetime = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
