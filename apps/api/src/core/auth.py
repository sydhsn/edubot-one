"""
Authentication utilities for school management
"""
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
import hashlib
import os
from .config import settings

class AuthUtils:
    """Password hashing utilities"""
    
    @staticmethod
    def get_password_hash(password: str) -> str:
        """Hash password using pbkdf2_sha256"""
        salt = os.urandom(32)
        pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
        return salt.hex() + pwdhash.hex()
    
    @staticmethod
    def verify_password(password: str, hashed: str) -> bool:
        """Verify password against hash"""
        try:
            salt = bytes.fromhex(hashed[:64])
            stored_hash = bytes.fromhex(hashed[64:])
            pwdhash = hashlib.pbkdf2_hmac('sha256', password.encode('utf-8'), salt, 100000)
            return pwdhash == stored_hash
        except (ValueError, IndexError):
            return False

class JWTHandler:
    """JWT token handling utilities"""
    
    @staticmethod
    def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
        """Create JWT access token"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=settings.access_token_expire_minutes)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)
        return encoded_jwt
    
    @staticmethod
    def verify_token(token: str) -> Optional[Dict[str, Any]]:
        """Verify and decode JWT token"""
        try:
            payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
            return payload
        except JWTError:
            return None
    
    @staticmethod
    def get_current_user_id(token: str) -> Optional[str]:
        """Extract user ID from token"""
        payload = JWTHandler.verify_token(token)
        if payload:
            return payload.get("sub")
        return None