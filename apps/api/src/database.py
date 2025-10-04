"""
MongoDB Atlas connection for school management system
"""
from motor.motor_asyncio import AsyncIOMotorClient
from .core.config import settings
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class Database:
    client: Optional[AsyncIOMotorClient] = None
    database = None

# Global database instance
db = Database()

async def connect_to_mongo():
    """Create MongoDB Atlas connection"""
    try:
        db.client = AsyncIOMotorClient(settings.database_url)
        db.database = db.client[settings.database_name]
        
        # Test the connection
        await db.client.admin.command('ping')
        logger.info(f"✅ Connected to MongoDB Atlas: {settings.database_name}")
        
        # Ensure default admin user exists
        await _ensure_default_admin()
        
    except Exception as e:
        logger.error(f"❌ Failed to connect to MongoDB Atlas: {e}")
        raise

async def close_mongo_connection():
    """Close MongoDB Atlas connection"""
    if db.client:
        db.client.close()
        logger.info("📤 Disconnected from MongoDB Atlas")

def get_database():
    """Get database instance - must be called after connect_to_mongo()"""
    if db.database is None:
        raise RuntimeError("Database not connected. Call connect_to_mongo() first.")
    return db.database

async def _ensure_default_admin():
    """Ensure default admin user exists in database"""
    from datetime import datetime
    from .core.auth import AuthUtils
    
    try:
        # Check if admin already exists
        admin_exists = await db.database.users.find_one({"email": "admin@school.com"})
        if not admin_exists:
            # Create default admin
            default_admin = {
                "_id": "admin-001",
                "email": "admin@school.com",
                "full_name": "System Administrator",
                "mobile": "+1234567890",
                "password_hash": AuthUtils.get_password_hash("admin123"),
                "role": "admin",
                "employee_id": "ADM20250001",
                "created_at": datetime.utcnow(),
                "is_active": True,
                "reset_token": None,
                "reset_token_expires": None
            }
            await db.database.users.insert_one(default_admin)
            logger.info("👤 Default admin user created: admin@school.com / admin123")
        
        # Create indexes for better performance
        await _create_indexes()
        
    except Exception as e:
        logger.error(f"Failed to ensure default admin: {e}")

async def _create_indexes():
    """Create database indexes for performance"""
    try:
        # Users collection indexes
        await db.database.users.create_index("email", unique=True)
        await db.database.users.create_index("employee_id")
        await db.database.users.create_index("admission_number")
        
        # Admissions collection indexes
        await db.database.admissions.create_index("admission_id", unique=True)
        await db.database.admissions.create_index("email")
        await db.database.admissions.create_index("registered_by")
        
        logger.info("📊 Database indexes created successfully")
        
    except Exception as e:
        logger.error(f"Failed to create indexes: {e}")