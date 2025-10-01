"""
Setup script to create default admin user
Run this once to set up the school management system
"""
import asyncio
import uuid
from datetime import datetime
from database import get_database
from core.auth import AuthUtils

async def create_default_admin():
    """Create default admin user if it doesn't exist"""
    db = get_database()
    
    # Check if admin already exists
    existing_admin = await db.users.find_one({"role": "admin"})
    if existing_admin:
        print("Admin user already exists!")
        return
    
    # Create default admin
    admin_doc = {
        "_id": str(uuid.uuid4()),
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
    
    await db.users.insert_one(admin_doc)
    print("Default admin user created!")
    print("Email: admin@school.com")
    print("Password: admin123")
    print("Please change the password after first login!")

if __name__ == "__main__":
    asyncio.run(create_default_admin())