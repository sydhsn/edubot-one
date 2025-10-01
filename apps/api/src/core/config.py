"""
Simple configuration for school management system
"""
import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Database - MongoDB Atlas from .env
    database_url: str = os.getenv("DATABASE_URL", "mongodb://localhost:27017")
    database_name: str = os.getenv("DATABASE_NAME", "edubot")
    
    # JWT Settings from .env
    secret_key: str = os.getenv("SECRET_KEY", "6561eed6c499aa094fa71f879b10935a")
    algorithm: str = os.getenv("ALGORITHM", "HS256")
    access_token_expire_minutes: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
    
    # For compatibility with existing code
    @property
    def jwt_secret_key(self) -> str:
        return self.secret_key
    
    @property
    def jwt_algorithm(self) -> str:
        return self.algorithm
    
    # CORS
    allowed_origins: str = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000,http://localhost:3001")
    
    class Config:
        env_file = ".env"
        extra = "ignore"  # Ignore extra fields from .env file

settings = Settings()