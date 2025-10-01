"""
Simple MongoDB connection for school management system
"""
from motor.motor_asyncio import AsyncIOMotorClient
from .core.config import settings
from typing import Optional

class Database:
    client: Optional[AsyncIOMotorClient] = None
    database = None

# Global database instance
db = Database()

async def connect_to_mongo():
    """Create database connection"""
    db.client = AsyncIOMotorClient(settings.database_url)
    db.database = db.client[settings.database_name]
    print(f"Connected to MongoDB: {settings.database_name}")

async def close_mongo_connection():
    """Close database connection"""
    if db.client:
        db.client.close()
        print("Disconnected from MongoDB")

def get_database():
    """Get database instance - for use within async context"""
    if db.client is None:
        db.client = AsyncIOMotorClient(settings.database_url)
        db.database = db.client[settings.database_name]
    
    return db.database