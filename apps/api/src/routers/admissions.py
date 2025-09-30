from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from datetime import datetime

router = APIRouter()

applications = {}

class Application(BaseModel):
    student_name: str = Field(..., example="John Doe")
    grade: int = Field(..., example=5)
    parent_email: str = Field(..., example="user@example.com")

@router.post("/")
async def create_admission(app: Application):
    """Create admission application"""
    app_id = f"APP{len(applications) + 1:06d}"
    
    applications[app_id] = {
        "student_name": app.student_name,
        "grade": app.grade,
        "parent_email": app.parent_email,
        "status": "pending",
        "enroll": True,
        "created_at": datetime.now().strftime("%Y-%m-%d")
    }
    
    return {
        "application_id": app_id,
        "status": "pending",
        "enroll": True,
        "message": "Admission application created"
    }

@router.get("/{app_id}")
async def check_admission(app_id: str):
    """Check admission status"""
    if app_id not in applications:
        raise HTTPException(status_code=404, detail="Application not found")
    
    app = applications[app_id]
    return {
        "application_id": app_id,
        "student_name": app["student_name"],
        "grade": app["grade"],
        "parent_email": app["parent_email"],
        "status": app["status"],
        "enroll": app["enroll"],
        "created_at": app["created_at"]
    }