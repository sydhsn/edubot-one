from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from datetime import datetime
from ..models.schemas import StudentReport
from ..services.auth_service import AuthService
from ..routers.auth import get_current_user

router = APIRouter()
auth_service = AuthService()

@router.get("/student/{student_id}", response_model=StudentReport)
async def get_student_report(
    student_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get comprehensive student report"""
    # Students can only view their own report
    if current_user["role"] == "student" and current_user["_id"] != student_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Students can only view their own reports"
        )
    
    # Teachers can only view reports for students in their classes
    if current_user["role"] == "teacher":
        student = next((u for u in auth_service.users if u["_id"] == student_id), None)
        if not student:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Student not found"
            )
        
        # Check if teacher teaches this student's class
        from .courses import courses
        teacher_classes = set()
        for course in courses.values():
            if course["teacher_id"] == current_user["_id"]:
                teacher_classes.add(course["class_name"])
        
        if student.get("class_name") not in teacher_classes:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only view reports for students in your classes"
            )
    
    # Get student info
    student = next((u for u in auth_service.users if u["_id"] == student_id), None)
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Student not found"
        )
    
    # Generate report data
    report_data = _generate_student_report(student_id, student)
    
    return StudentReport(**report_data)

@router.get("/my-report", response_model=StudentReport)
async def get_my_report(
    current_user: dict = Depends(get_current_user)
):
    """Get current student's report"""
    if current_user["role"] != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can view their own reports"
        )
    
    report_data = _generate_student_report(current_user["_id"], current_user)
    return StudentReport(**report_data)

@router.get("/class/{class_name}", response_model=List[StudentReport])
async def get_class_reports(
    class_name: str,
    current_user: dict = Depends(get_current_user)
):
    """Get reports for all students in a class (teachers and admins only)"""
    if current_user["role"] not in ["teacher", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers and admins can view class reports"
        )
    
    # Teachers can only view reports for classes they teach
    if current_user["role"] == "teacher":
        from .courses import courses
        teacher_classes = set()
        for course in courses.values():
            if course["teacher_id"] == current_user["_id"]:
                teacher_classes.add(course["class_name"])
        
        if class_name not in teacher_classes:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only view reports for classes you teach"
            )
    
    # Get all students in the class
    class_students = [
        user for user in auth_service.users 
        if user.get("role") == "student" and user.get("class_name") == class_name
    ]
    
    # Generate reports for all students
    reports = []
    for student in class_students:
        report_data = _generate_student_report(student["_id"], student)
        reports.append(StudentReport(**report_data))
    
    return reports

def _generate_student_report(student_id: str, student: dict) -> dict:
    """Generate comprehensive report for a student"""
    from .courses import courses
    from .assignments import assignments, submissions
    from .attendance import attendance_db
    
    # Get student's courses
    student_class = student.get("class_name", "")
    student_courses = [
        {
            "course_id": course["course_id"],
            "course_name": course["course_name"],
            "course_code": course["course_code"],
            "teacher_name": course["teacher_name"],
            "credits": course["credits"]
        }
        for course in courses.values()
        if course["class_name"] == student_class
    ]
    
    # Get assignment statistics
    student_assignments = [
        assignment for assignment in assignments.values()
        if assignment["class_name"] == student_class
    ]
    
    student_submissions = [
        sub for sub in submissions.values()
        if sub["student_id"] == student_id
    ]
    
    total_assignments = len(student_assignments)
    submitted_assignments = len(student_submissions)
    graded_submissions = len([sub for sub in student_submissions if sub["grade"] is not None])
    
    # Calculate average grade
    graded_scores = [sub["grade"] for sub in student_submissions if sub["grade"] is not None]
    average_grade = sum(graded_scores) / len(graded_scores) if graded_scores else None
    
    assignment_stats = {
        "total_assignments": total_assignments,
        "submitted": submitted_assignments,
        "graded": graded_submissions,
        "pending": submitted_assignments - graded_submissions,
        "average_grade": average_grade,
        "submissions": [
            {
                "assignment_title": next(
                    (a["title"] for a in assignments.values() if a["assignment_id"] == sub["assignment_id"]), 
                    "Unknown"
                ),
                "course_name": next(
                    (a["course_name"] for a in assignments.values() if a["assignment_id"] == sub["assignment_id"]), 
                    "Unknown"
                ),
                "submitted_at": sub["submitted_at"],
                "grade": sub["grade"],
                "max_points": next(
                    (a["max_points"] for a in assignments.values() if a["assignment_id"] == sub["assignment_id"]), 
                    100
                ),
                "status": sub["status"]
            }
            for sub in student_submissions
        ]
    }
    
    # Get attendance statistics
    student_attendance = [
        record for record in attendance_db
        if record["student_id"] == student_id
    ]
    
    total_days = len(student_attendance)
    present_days = len([r for r in student_attendance if r["status"] == "present"])
    absent_days = len([r for r in student_attendance if r["status"] == "absent"])
    late_days = len([r for r in student_attendance if r["status"] == "late"])
    
    attendance_percentage = (present_days / total_days * 100) if total_days > 0 else 0
    
    attendance_stats = {
        "total_days": total_days,
        "present_days": present_days,
        "absent_days": absent_days,
        "late_days": late_days,
        "attendance_percentage": round(attendance_percentage, 2)
    }
    
    return {
        "student_id": student_id,
        "student_name": student["name"],
        "class_name": student_class,
        "courses": student_courses,
        "assignments": assignment_stats,
        "attendance": attendance_stats,
        "overall_grade": average_grade,
        "generated_at": datetime.now()
    }