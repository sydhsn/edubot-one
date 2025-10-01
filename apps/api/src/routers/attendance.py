from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from datetime import datetime, date
from ..models.schemas import (
    AttendanceRecord, AttendanceCreate, AttendanceUpdate, 
    AttendanceReport, ClassAttendanceReport, AttendanceStatus
)
from ..services.auth_service import AuthService
from ..routers.auth import get_current_user

router = APIRouter()
auth_service = AuthService()

# Mock data - replace with database
attendance_db = []

@router.post("/record", response_model=AttendanceRecord)
async def record_attendance(
    attendance_data: AttendanceCreate, 
    current_user: dict = Depends(get_current_user)
):
    """Record attendance for a student (teachers and admins only)"""
    if current_user["role"] not in ["teacher", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers and admins can record attendance"
        )
    
    # Check if attendance already exists for this student, class, and date
    today = datetime.now().date()
    existing = next((r for r in attendance_db 
                    if r["student_id"] == attendance_data.student_id 
                    and r["class_id"] == attendance_data.class_id 
                    and r["date"].date() == today), None)
    
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Attendance already recorded for this student today"
        )
    
    # Create attendance record
    record = {
        "student_id": attendance_data.student_id,
        "class_id": attendance_data.class_id,
        "date": datetime.now(),
        "status": attendance_data.status,
        "teacher_id": current_user["_id"],
        "remarks": attendance_data.remarks
    }
    
    attendance_db.append(record)
    return record

@router.get("/student/{student_id}", response_model=List[AttendanceRecord])
async def get_student_attendance(
    student_id: str,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get attendance records for a specific student"""
    # Students can only view their own attendance
    if current_user["role"] == "student" and current_user["_id"] != student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Students can only view their own attendance"
        )
    
    records = [r for r in attendance_db if r["student_id"] == student_id]
    
    # Filter by date range if provided
    if start_date:
        records = [r for r in records if r["date"].date() >= start_date]
    if end_date:
        records = [r for r in records if r["date"].date() <= end_date]
    
    return records

@router.get("/student/{student_id}/report", response_model=AttendanceReport)
async def get_student_attendance_report(
    student_id: str,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get attendance report for a specific student"""
    if current_user["role"] == "student" and current_user["_id"] != student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Students can only view their own attendance"
        )
    
    records = [r for r in attendance_db if r["student_id"] == student_id]
    
    # Filter by date range if provided
    if start_date:
        records = [r for r in records if r["date"].date() >= start_date]
    if end_date:
        records = [r for r in records if r["date"].date() <= end_date]
    
    # Calculate statistics
    total_days = len(records)
    present_days = len([r for r in records if r["status"] == AttendanceStatus.PRESENT])
    absent_days = len([r for r in records if r["status"] == AttendanceStatus.ABSENT])
    late_days = len([r for r in records if r["status"] == AttendanceStatus.LATE])
    
    attendance_percentage = (present_days / total_days * 100) if total_days > 0 else 0
    
    # Get student name (mock - replace with actual user lookup)
    student_name = f"Student {student_id}"
    
    return {
        "student_id": student_id,
        "student_name": student_name,
        "total_days": total_days,
        "present_days": present_days,
        "absent_days": absent_days,
        "late_days": late_days,
        "attendance_percentage": round(attendance_percentage, 2)
    }

@router.get("/class/{class_id}", response_model=ClassAttendanceReport)
async def get_class_attendance(
    class_id: str,
    attendance_date: Optional[date] = None,
    current_user: dict = Depends(get_current_user)
):
    """Get attendance for a specific class on a specific date"""
    if current_user["role"] not in ["teacher", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers and admins can view class attendance"
        )
    
    target_date = attendance_date or date.today()
    
    # Get records for the class on the specified date
    records = [r for r in attendance_db 
              if r["class_id"] == class_id and r["date"].date() == target_date]
    
    # Calculate statistics
    total_students = len(records)
    present_count = len([r for r in records if r["status"] == AttendanceStatus.PRESENT])
    absent_count = len([r for r in records if r["status"] == AttendanceStatus.ABSENT])
    late_count = len([r for r in records if r["status"] == AttendanceStatus.LATE])
    
    return {
        "class_id": class_id,
        "date": datetime.combine(target_date, datetime.min.time()),
        "total_students": total_students,
        "present_count": present_count,
        "absent_count": absent_count,
        "late_count": late_count,
        "attendance_records": records
    }

@router.put("/record/{student_id}/{class_id}", response_model=AttendanceRecord)
async def update_attendance(
    student_id: str,
    class_id: str,
    attendance_update: AttendanceUpdate,
    attendance_date: Optional[date] = None,
    current_user: dict = Depends(get_current_user)
):
    """Update attendance record for a student"""
    if current_user["role"] not in ["teacher", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers and admins can update attendance"
        )
    
    target_date = attendance_date or date.today()
    
    # Find the attendance record
    record = next((r for r in attendance_db 
                  if r["student_id"] == student_id 
                  and r["class_id"] == class_id 
                  and r["date"].date() == target_date), None)
    
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Attendance record not found"
        )
    
    # Update the record
    record["status"] = attendance_update.status
    if attendance_update.remarks is not None:
        record["remarks"] = attendance_update.remarks
    
    return record

@router.delete("/record/{student_id}/{class_id}")
async def delete_attendance(
    student_id: str,
    class_id: str,
    attendance_date: Optional[date] = None,
    current_user: dict = Depends(get_current_user)
):
    """Delete attendance record for a student"""
    if current_user["role"] not in ["teacher", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers and admins can delete attendance"
        )
    
    target_date = attendance_date or date.today()
    
    # Find and remove the attendance record
    for i, record in enumerate(attendance_db):
        if (record["student_id"] == student_id 
            and record["class_id"] == class_id 
            and record["date"].date() == target_date):
            del attendance_db[i]
            return {"message": "Attendance record deleted successfully"}
    
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail="Attendance record not found"
    )