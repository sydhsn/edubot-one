"""
Simple school management system models
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
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

# Attendance Models
class AttendanceStatus(str, Enum):
    PRESENT = "present"
    ABSENT = "absent"
    LATE = "late"

class AttendanceRecord(BaseModel):
    student_id: str
    class_id: str
    date: datetime
    status: AttendanceStatus
    teacher_id: str
    remarks: Optional[str] = None

class AttendanceCreate(BaseModel):
    student_id: str
    class_id: str
    status: AttendanceStatus
    remarks: Optional[str] = None

class AttendanceUpdate(BaseModel):
    status: AttendanceStatus
    remarks: Optional[str] = None

class AttendanceReport(BaseModel):
    student_id: str
    student_name: str
    total_days: int
    present_days: int
    absent_days: int
    late_days: int
    attendance_percentage: float

class ClassAttendanceReport(BaseModel):
    class_id: str
    date: datetime
    total_students: int
    present_count: int
    absent_count: int
    late_count: int
    attendance_records: List[AttendanceRecord]

# AI Models
class AIQuestionRequest(BaseModel):
    subject: str
    topic: str
    difficulty: str  # "easy", "medium", "hard"
    question_type: str  # "mcq", "short_answer", "essay"
    num_questions: int = 5

class AIQuestion(BaseModel):
    question: str
    type: str
    options: Optional[List[str]] = None  # For MCQ
    correct_answer: Optional[str] = None
    explanation: Optional[str] = None

class AIQuestionResponse(BaseModel):
    questions: List[AIQuestion]
    subject: str
    topic: str
    difficulty: str

class AIChatRequest(BaseModel):
    message: str
    context: Optional[str] = None

class AIChatResponse(BaseModel):
    response: str
    context: Optional[str] = None

class PosterRequest(BaseModel):
    title: str
    description: str
    theme: Optional[str] = "educational"
    size: Optional[str] = "A4"  # "A4", "banner", "social"

class PosterResponse(BaseModel):
    image_url: str
    title: str
    description: str
    theme: str

# Course Management Models
class Course(BaseModel):
    course_id: str
    course_name: str
    course_code: str
    description: Optional[str] = None
    teacher_id: str
    teacher_name: str
    class_name: str
    credits: int = 1
    created_at: datetime
    is_active: bool = True

class CourseCreate(BaseModel):
    course_name: str = Field(..., example="Mathematics")
    course_code: str = Field(..., example="MATH101")
    description: Optional[str] = Field(None, example="Basic Mathematics for Grade 10")
    teacher_id: str
    class_name: str = Field(..., example="10th Grade A")
    credits: int = Field(1, example=1)

# Timetable Models
class TimeSlot(BaseModel):
    day: str = Field(..., example="Monday")  # Monday, Tuesday, etc.
    start_time: str = Field(..., example="09:00")  # HH:MM format
    end_time: str = Field(..., example="10:00")
    course_id: str
    course_name: str
    teacher_id: str
    teacher_name: str
    classroom: Optional[str] = Field(None, example="Room 101")

class Timetable(BaseModel):
    timetable_id: str
    class_name: str
    week_schedule: List[TimeSlot]
    created_by: str
    created_at: datetime
    is_active: bool = True

class TimetableCreate(BaseModel):
    class_name: str = Field(..., example="10th Grade A")
    week_schedule: List[TimeSlot]

# Assignment Models
class AssignmentStatus(str, Enum):
    DRAFT = "draft"
    PUBLISHED = "published"
    COMPLETED = "completed"
    OVERDUE = "overdue"

class Assignment(BaseModel):
    assignment_id: str
    title: str
    description: str
    course_id: str
    course_name: str
    teacher_id: str
    teacher_name: str
    class_name: str
    due_date: datetime
    max_points: int
    status: AssignmentStatus
    created_at: datetime
    updated_at: datetime

class AssignmentCreate(BaseModel):
    title: str = Field(..., example="Math Assignment 1")
    description: str = Field(..., example="Solve problems 1-10 from chapter 5")
    course_id: str
    class_name: str = Field(..., example="10th Grade A")
    due_date: datetime
    max_points: int = Field(100, example=100)

class AssignmentSubmission(BaseModel):
    submission_id: str
    assignment_id: str
    student_id: str
    student_name: str
    content: str
    submitted_at: datetime
    grade: Optional[int] = None
    feedback: Optional[str] = None
    status: str = "submitted"  # submitted, graded, late

class SubmissionCreate(BaseModel):
    assignment_id: str
    content: str = Field(..., example="My assignment solution...")

class GradeSubmission(BaseModel):
    grade: int = Field(..., ge=0, le=100, example=85)
    feedback: Optional[str] = Field(None, example="Good work! Pay attention to step 3.")

# Report Models
class StudentReport(BaseModel):
    student_id: str
    student_name: str
    class_name: str
    courses: List[dict]  # Course performance data
    assignments: dict  # Assignment statistics
    attendance: dict  # Attendance statistics
    overall_grade: Optional[float] = None
    generated_at: datetime