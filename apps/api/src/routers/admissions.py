from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional
from ..models.schemas import StudentCreate, TeacherCreate, Student, Teacher
from ..services.auth_service import AuthService
from ..routers.auth import get_current_user, get_admin_user

router = APIRouter()
auth_service = AuthService()

# In-memory storage for completed admissions (replace with database)
completed_admissions = {}

class DirectAdmission(BaseModel):
    """Direct admission form for admin to register students immediately"""
    student_name: str = Field(..., example="John Doe")
    email: str = Field(..., example="john.doe@school.edu")
    password: str = Field(..., example="student123")
    parent_name: str = Field(..., example="Jane Doe")
    parent_email: str = Field(..., example="jane.doe@example.com")
    parent_phone: str = Field(..., example="+1234567890")
    class_name: str = Field(..., example="10th Grade A")
    previous_school: Optional[str] = Field(None, example="ABC High School")
    address: str = Field(..., example="123 Main St, City, State")
    date_of_birth: str = Field(..., example="2006-01-15")
    admission_number: Optional[str] = Field(None, example="ADM2024001")

@router.post("/register-student", response_model=dict)
async def register_student_directly(
    admission: DirectAdmission,
    admin_user: dict = Depends(get_admin_user)
):
    """Direct student registration by admin (no status workflow)"""
    try:
        # Generate admission ID
        admission_id = f"ADM{len(completed_admissions) + 1:06d}"
        
        # Create student data
        student_data = StudentCreate(
            email=admission.email,
            full_name=admission.student_name,
            mobile=admission.parent_phone,
            password=admission.password,
            class_name=admission.class_name,
            address=admission.address
        )
        
        # Create student account directly
        student = await auth_service.create_student(student_data)
        
        # Store completed admission record
        admission_record = {
            "admission_id": admission_id,
            "student_id": student["_id"],
            "student_name": admission.student_name,
            "email": admission.email,
            "parent_name": admission.parent_name,
            "parent_email": admission.parent_email,
            "parent_phone": admission.parent_phone,
            "class_name": admission.class_name,
            "previous_school": admission.previous_school,
            "address": admission.address,
            "date_of_birth": admission.date_of_birth,
            "admission_number": student.get("admission_number") or admission.admission_number,
            "registered_by": admin_user["_id"],
            "registered_at": datetime.now(),
            "status": "completed"
        }
        
        completed_admissions[admission_id] = admission_record
        
        return {
            "message": "Student registered successfully",
            "admission_id": admission_id,
            "student_id": student["_id"],
            "admission_number": admission_record["admission_number"],
            "email": admission.email,
            "class": admission.class_name,
            "status": "completed"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Student registration failed: {str(e)}"
        )

@router.get("/", response_model=List[dict])
async def list_completed_admissions(
    current_user: dict = Depends(get_current_user)
):
    """List all completed admissions (admin/teacher only)"""
    if current_user["role"] not in ["admin", "teacher"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins and teachers can view admission records"
        )
    
    return list(completed_admissions.values())

@router.get("/{admission_id}", response_model=dict)
async def get_admission_record(
    admission_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get specific admission record"""
    if current_user["role"] not in ["admin", "teacher"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins and teachers can view admission records"
        )
    
    if admission_id not in completed_admissions:
        raise HTTPException(status_code=404, detail="Admission record not found")
    
    return completed_admissions[admission_id]

@router.post("/create-teacher", response_model=dict)
async def create_teacher_account(
    teacher_data: TeacherCreate,
    admin_user: dict = Depends(get_admin_user)
):
    """Create teacher account (admin only)"""
    try:
        teacher = await auth_service.create_teacher(teacher_data, admin_user["_id"])
        return {
            "message": "Teacher account created successfully",
            "teacher": teacher
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Teacher creation failed: {str(e)}"
        )

@router.delete("/{admission_id}", response_model=dict)
async def delete_admission_record(
    admission_id: str,
    admin_user: dict = Depends(get_admin_user)
):
    """Delete admission record (admin only)"""
    if admission_id not in completed_admissions:
        raise HTTPException(status_code=404, detail="Admission record not found")
    
    del completed_admissions[admission_id]
    return {"message": "Admission record deleted successfully"}