"""
JWT-based Authentication Module
Provides secure authentication for Soil Twin API endpoints
Now with MongoDB Atlas integration
"""

from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import os
from dotenv import load_dotenv

# Database imports
from .crud.user_crud import get_user_by_username, verify_password

load_dotenv()

# Security configuration
SECRET_KEY = os.getenv("JWT_SECRET", "CHANGE_THIS_IN_PRODUCTION_VIA_ENV")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# OAuth2 scheme for token extraction
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")


def authenticate_user(username: str, password: str):
    """
    Authenticate user against MongoDB.
    Returns user document if valid, False otherwise.
    """
    user = get_user_by_username(username)
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False
    if user.get("disabled", False):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta = None):
    """
    Create JWT access token.
    
    Args:
        data: Payload data (typically {"sub": username})
        expires_delta: Optional custom expiration time
    
    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Dependency to extract and validate current user from JWT token.
    Queries MongoDB to get user details.
    
    Args:
        token: JWT token from Authorization header
    
    Returns:
        Username of authenticated user
    
    Raises:
        HTTPException: If token is invalid or expired
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        return username
    except JWTError:
        raise credentials_exception


async def get_current_active_user(current_user: str = Depends(get_current_user)):
    """
    Get current active user with full details from MongoDB.
    Extends get_current_user to return user object from DB.
    """
    user = get_user_by_username(current_user)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if user.get("disabled", False):
        raise HTTPException(status_code=400, detail="Inactive user")
    
    # Remove password hash from response
    user_data = user.copy()
    user_data.pop("hashed_password", None)
    # Convert ObjectId to string for JSON serialization
    if "_id" in user_data:
        user_data["id"] = str(user_data.pop("_id"))
    
    return user_data


def require_role(required_role: str):
    """
    Dependency factory for role-based access control.
    
    Usage:
        @router.get("/admin-only")
        def admin_route(user = Depends(require_role("admin"))):
            ...
    """
    async def role_checker(current_user: str = Depends(get_current_user)):
        user = get_user_by_username(current_user)
        if not user or user.get("role") != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Requires {required_role} role."
            )
        return current_user
    
    return role_checker
