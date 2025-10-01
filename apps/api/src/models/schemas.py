"""
Simple school management system models
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    TEACHER = "teacher"
    STUDENT = "student"

# Base User Models
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    mobile: str
    role: UserRole

# Student Models
class StudentCreate(BaseModel):
    email: EmailStr
    full_name: str
    mobile: str
    password: str
    class_name: str  # e.g., "10th Grade", "12th Science"
    address: Optional[str] = None
    
class Student(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    mobile: str
    class_name: str
    address: Optional[str] = None
    role: UserRole = UserRole.STUDENT
    admission_number: Optional[str] = None
    created_at: datetime
    is_active: bool = True

# Teacher Models
class TeacherCreate(BaseModel):
    email: EmailStr
    full_name: str
    mobile: str
    password: str
    subject: str  # e.g., "Mathematics", "Physics"
    
class Teacher(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    mobile: str
    subject: str
    role: UserRole = UserRole.TEACHER
    employee_id: Optional[str] = None
    created_at: datetime
    is_active: bool = True

# Admin Models
class Admin(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    mobile: str
    role: UserRole = UserRole.ADMIN
    employee_id: Optional[str] = None
    created_at: datetime
    is_active: bool = True

# Authentication Models
class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_role: UserRole
    user_info: dict

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    reset_token: str
    new_password: str

# Dashboard Models
class DashboardResponse(BaseModel):
    message: str
    user_role: str
    user_info: dict
    stats: Optional[dict] = None