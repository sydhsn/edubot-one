from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    TEACHER = "teacher"
    PARENT = "parent"
    STUDENT = "student"

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: UserRole
    school_id: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    created_at: datetime
    is_active: bool = True
    
    class Config:
        from_attributes = True

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: User

class AttendanceStatus(str, Enum):
    PRESENT = "present"
    ABSENT = "absent"
    LATE = "late"

class AttendanceRecord(BaseModel):
    student_id: str
    date: str  # YYYY-MM-DD
    status: AttendanceStatus
    recorded_by: str
    notes: Optional[str] = None

class AdmissionApplication(BaseModel):
    student_name: str
    grade: str
    parent_email: EmailStr
    parent_phone: str

class AIQuestionRequest(BaseModel):
    subject: str
    topic: str
    difficulty: str = "medium"
    number_of_questions: int = 10

class AIQuestionResponse(BaseModel):
    questions: List[str]
    answers: List[str]

class ReportCard(BaseModel):
    student_id: str
    term: str
    grades: dict
    attendance: dict
    teacher_comments: str