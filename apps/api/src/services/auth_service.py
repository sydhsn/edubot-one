"""
Simple authentication service for school management
"""
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from fastapi import HTTPException, status
import uuid
import secrets
from ..models.schemas import *
from ..core.auth import AuthUtils, JWTHandler
from .email_service import EmailService
from ..database import get_database

class AuthService:
    def __init__(self):
        self.email_service = EmailService()
        
    async def _ensure_default_admin(self):
        """Ensure default admin exists in database"""
        db = get_database()
        
        # Check if admin already exists
        admin_exists = await db.users.find_one({"email": "admin@school.com"})
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
            await db.users.insert_one(default_admin)
            print("Default admin user created")
        
    async def create_student(self, student_data: StudentCreate) -> Dict[str, Any]:
        """Register new student (admission)"""
        db = get_database()
        
        # Check if email already exists
        existing_user = await db.users.find_one({"email": student_data.email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Generate admission number
        admission_number = await self._generate_admission_number()
        
        # Create student document
        student_doc = {
            "_id": str(uuid.uuid4()),
            "email": student_data.email,
            "full_name": student_data.full_name,
            "mobile": student_data.mobile,
            "password_hash": AuthUtils.get_password_hash(student_data.password),
            "class_name": student_data.class_name,
            "address": student_data.address,
            "role": "student",
            "admission_number": admission_number,
            "created_at": datetime.utcnow(),
            "is_active": True,
            "reset_token": None,
            "reset_token_expires": None
        }
        
        # Save to MongoDB
        await db.users.insert_one(student_doc)
        
        # Return student data (without password)
        result = student_doc.copy()
        result.pop("password_hash")
        result["id"] = result.pop("_id")
        return result
    
    async def create_teacher(self, teacher_data: TeacherCreate, admin_id: str) -> Dict[str, Any]:
        """Create teacher (admin only)"""
        db = get_database()
        
        # Verify admin
        admin = await db.users.find_one({"_id": admin_id, "role": "admin"})
        if not admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admins can create teacher accounts"
            )
        
        # Check if email already exists
        existing_user = await db.users.find_one({"email": teacher_data.email})
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )
        
        # Generate employee ID
        employee_id = await self._generate_employee_id("TCH")
        
        # Create teacher document
        teacher_doc = {
            "_id": str(uuid.uuid4()),
            "email": teacher_data.email,
            "full_name": teacher_data.full_name,
            "mobile": teacher_data.mobile,
            "password_hash": AuthUtils.get_password_hash(teacher_data.password),
            "subject": teacher_data.subject,
            "role": "teacher",
            "employee_id": employee_id,
            "created_at": datetime.utcnow(),
            "is_active": True,
            "reset_token": None,
            "reset_token_expires": None
        }
        
        # Save to MongoDB
        await db.users.insert_one(teacher_doc)
        
        # Return teacher data (without password)
        result = teacher_doc.copy()
        result.pop("password_hash")
        result["id"] = result.pop("_id")
        return result
    
    async def login(self, login_data: LoginRequest) -> LoginResponse:
        """Login user"""
        db = get_database()
        
        # Ensure default admin exists
        await self._ensure_default_admin()
        
        # Find user by email
        user = await db.users.find_one({"email": login_data.email})
        if not user or not AuthUtils.verify_password(login_data.password, user["password_hash"]):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        
        if not user["is_active"]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Account is deactivated"
            )
        
        # Update last login in database
        await db.users.update_one(
            {"_id": user["_id"]}, 
            {"$set": {"last_login": datetime.utcnow()}}
        )
        
        # Create JWT token
        token_data = {
            "sub": user["_id"],
            "email": user["email"],
            "role": user["role"],
            "full_name": user["full_name"]
        }
        access_token = JWTHandler.create_access_token(token_data)
        
        # Prepare user info
        user_info = {
            "id": user["_id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "mobile": user["mobile"],
            "role": user["role"]
        }
        
        # Add role-specific info
        if user["role"] == "student":
            user_info.update({
                "class_name": user.get("class_name"),
                "admission_number": user.get("admission_number")
            })
        elif user["role"] == "teacher":
            user_info.update({
                "subject": user.get("subject"),
                "employee_id": user.get("employee_id")
            })
        elif user["role"] == "admin":
            user_info.update({
                "employee_id": user.get("employee_id")
            })
        
        return LoginResponse(
            access_token=access_token,
            user_role=user["role"],
            user_info=user_info
        )
    
    async def forgot_password(self, email: str) -> bool:
        """Initiate password reset"""
        db = get_database()
        
        user = await db.users.find_one({"email": email})
        if not user:
            return True  # Don't reveal if email exists
        
        # Generate reset token
        reset_token = secrets.token_urlsafe(32)
        reset_expires = datetime.utcnow() + timedelta(hours=1)
        
        # Update user with reset token in database
        await db.users.update_one(
            {"_id": user["_id"]},
            {"$set": {
                "reset_token": reset_token,
                "reset_token_expires": reset_expires
            }}
        )
        
        # Send email with reset token
        try:
            await self.email_service.send_password_reset_email(
                email, user["name"], reset_token
            )
            print(f"Password reset email sent successfully to {email}")
        except Exception as e:
            print(f"Failed to send password reset email to {email}: {str(e)}")
            # Continue anyway - we still generated the token
        
        return True
    
    async def reset_password(self, reset_data: ResetPasswordRequest) -> bool:
        """Reset password using token"""
        user = next((u for u in self.users 
                    if u.get("reset_token") == reset_data.reset_token 
                    and u.get("reset_token_expires") 
                    and u["reset_token_expires"] > datetime.utcnow()), None)
        
        if not user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid or expired reset token"
            )
        
        # Update password and clear reset token
        user["password_hash"] = AuthUtils.get_password_hash(reset_data.new_password)
        user["reset_token"] = None
        user["reset_token_expires"] = None
        
        return True
    
    async def get_dashboard_data(self, user_id: str) -> Dict[str, Any]:
        """Get dashboard data for user"""
        db = get_database()
        
        # Ensure default admin exists
        await self._ensure_default_admin()
        
        user = await db.users.find_one({"_id": user_id})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Prepare user info
        user_info = {
            "id": user["_id"],
            "email": user["email"],
            "full_name": user["full_name"],
            "mobile": user["mobile"],
            "role": user["role"]
        }
        
        # Get role-specific stats
        stats = {}
        if user["role"] == "admin":
            stats = {
                "total_students": await db.users.count_documents({"role": "student"}),
                "total_teachers": await db.users.count_documents({"role": "teacher"}),
                "total_admins": await db.users.count_documents({"role": "admin"})
            }
            user_info["employee_id"] = user.get("employee_id")
        elif user["role"] == "teacher":
            stats = {
                "students_count": await db.users.count_documents({"role": "student"}),
                "subject": user.get("subject")
            }
            user_info.update({
                "subject": user.get("subject"),
                "employee_id": user.get("employee_id")
            })
        elif user["role"] == "student":
            user_info.update({
                "class_name": user.get("class_name"),
                "admission_number": user.get("admission_number")
            })
        
        return {
            "message": f"Welcome to your {user['role']} dashboard!",
            "user_role": user["role"],
            "user_info": user_info,
            "stats": stats
        }
    
    async def _generate_admission_number(self) -> str:
        """Generate unique admission number"""
        db = get_database()
        
        year = datetime.now().year
        count = await db.users.count_documents({"role": "student"}) + 1
        return f"ADM{year}{count:04d}"
    
    async def _generate_employee_id(self, prefix: str) -> str:
        """Generate unique employee ID"""
        db = get_database()
        
        year = datetime.now().year
        count = await db.users.count_documents({"role": {"$in": ["teacher", "admin"]}}) + 1
        return f"{prefix}{year}{count:04d}"
    
    async def setup_default_users(self) -> Dict[str, Any]:
        """Setup default users for testing (admin, teacher, student)"""
        created_users = []
        
        # Check if teacher already exists
        teacher_exists = any(u["email"] == "teacher@school.com" for u in self.users)
        if not teacher_exists:
            teacher_doc = {
                "_id": str(uuid.uuid4()),
                "email": "teacher@school.com",
                "full_name": "Default Teacher",
                "mobile": "+1234567891",
                "password_hash": AuthUtils.get_password_hash("teacher123"),
                "subject": "Mathematics",
                "role": "teacher",
                "employee_id": "TCH20250001",
                "created_at": datetime.utcnow(),
                "is_active": True,
                "reset_token": None,
                "reset_token_expires": None
            }
            self.users.append(teacher_doc)
            created_users.append("teacher@school.com")
        
        # Check if student already exists
        student_exists = any(u["email"] == "student@school.com" for u in self.users)
        if not student_exists:
            student_doc = {
                "_id": str(uuid.uuid4()),
                "email": "student@school.com",
                "full_name": "Default Student",
                "mobile": "+1234567892",
                "password_hash": AuthUtils.get_password_hash("student123"),
                "class_name": "Grade 10",
                "address": "123 School Street",
                "role": "student",
                "admission_number": "ADM20250001",
                "created_at": datetime.utcnow(),
                "is_active": True,
                "reset_token": None,
                "reset_token_expires": None
            }
            self.users.append(student_doc)
            created_users.append("student@school.com")
        
        # Admin already exists from constructor
        admin_exists = any(u["email"] == "admin@school.com" for u in self.users)
        
        return {
            "message": "Default users setup complete!",
            "created_users": created_users,
            "existing_users": {
                "admin": "admin@school.com" if admin_exists else None,
                "teacher": "teacher@school.com" if teacher_exists else None,
                "student": "student@school.com" if student_exists else None
            },
            "default_credentials": {
                "admin": {"email": "admin@school.com", "password": "admin123"},
                "teacher": {"email": "teacher@school.com", "password": "teacher123"},
                "student": {"email": "student@school.com", "password": "student123"}
            }
        }

    async def get_all_users(self) -> list:
        """Get all users (admin only)"""
        db = get_database()
        
        # Ensure default admin exists
        await self._ensure_default_admin()
        
        # Get all users from MongoDB
        users = await db.users.find({}).to_list(length=None)
        
        # Return sanitized user data (without password hashes)
        sanitized_users = []
        for user in users:
            sanitized_user = {
                "id": user["_id"],
                "email": user["email"],
                "full_name": user["full_name"],
                "role": user["role"],
                "is_active": user["is_active"],
                "created_at": user["created_at"].isoformat() if isinstance(user["created_at"], datetime) else user["created_at"]
            }
            # Add role-specific fields
            if user["role"] == "teacher":
                sanitized_user["employee_id"] = user.get("employee_id")
                sanitized_user["subject"] = user.get("subject")
            elif user["role"] == "student":
                sanitized_user["admission_number"] = user.get("admission_number")
                sanitized_user["class_name"] = user.get("class_name")
            elif user["role"] == "admin":
                sanitized_user["employee_id"] = user.get("employee_id")
            
            sanitized_users.append(sanitized_user)
        
        return sanitized_users

    async def get_users_by_role(self, role: str) -> list:
        """Get users by role (admin only)"""
        db = get_database()
        
        # Ensure default admin exists
        await self._ensure_default_admin()
        
        # Filter users by role from MongoDB
        role_users = await db.users.find({"role": role}).to_list(length=None)
        
        # Return sanitized user data
        sanitized_users = []
        for user in role_users:
            sanitized_user = {
                "id": user["_id"],
                "email": user["email"],
                "full_name": user["full_name"],
                "role": user["role"],
                "is_active": user["is_active"],
                "created_at": user["created_at"].isoformat() if isinstance(user["created_at"], datetime) else user["created_at"]
            }
            # Add role-specific fields
            if role == "teacher":
                sanitized_user["employee_id"] = user.get("employee_id")
                sanitized_user["subject"] = user.get("subject")
            elif role == "student":
                sanitized_user["admission_number"] = user.get("admission_number")
                sanitized_user["class_name"] = user.get("class_name")
            elif role == "admin":
                sanitized_user["employee_id"] = user.get("employee_id")
            
            sanitized_users.append(sanitized_user)
        
        return sanitized_users
    
    async def get_user_by_id(self, user_id: str) -> dict:
        """Get user by ID"""
        db = get_database()
        
        # Ensure default admin exists
        await self._ensure_default_admin()
        
        user = await db.users.find_one({"_id": user_id})
        return user
    
    async def change_password(self, user_id: str, old_password: str, new_password: str) -> bool:
        """Change user password"""
        user = next((u for u in self.users if u.get("_id") == user_id), None)
        if not user:
            return False
        
        # Verify old password
        if not self.verify_password(old_password, user["password"]):
            return False
        
        # Update password
        user["password"] = self.hash_password(new_password)
        return True