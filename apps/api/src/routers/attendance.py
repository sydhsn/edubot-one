from fastapi import APIRouter, HTTPException
from typing import List
from ..models.schemas import AttendanceRecord

router = APIRouter()

# Mock data - replace with database
attendance_db = []

@router.post("/record")
async def record_attendance(record: AttendanceRecord):
    attendance_db.append(record)
    return {"message": "Attendance recorded successfully", "record": record}

@router.get("/student/{student_id}")
async def get_student_attendance(student_id: str):
    records = [r for r in attendance_db if r.student_id == student_id]
    return {"student_id": student_id, "records": records}

@router.get("/class/{class_id}")
async def get_class_attendance(class_id: str, date: str = None):
    # Mock implementation
    return {
        "class_id": class_id,
        "date": date,
        "present": 25,
        "absent": 2,
        "late": 1
    }