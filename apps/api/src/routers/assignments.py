from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from datetime import datetime
from ..models.schemas import (
    Assignment, AssignmentCreate, AssignmentSubmission, 
    SubmissionCreate, GradeSubmission, AssignmentStatus
)
from ..services.auth_service import AuthService
from ..routers.auth import get_current_user

router = APIRouter()
auth_service = AuthService()

# In-memory storage (replace with database)
assignments = {}
submissions = {}

@router.post("/", response_model=Assignment)
async def create_assignment(
    assignment_data: AssignmentCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create assignment (teachers only)"""
    if current_user["role"] != "teacher":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers can create assignments"
        )
    
    # Validate course exists and teacher owns it
    from .courses import courses
    if assignment_data.course_id not in courses:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    course = courses[assignment_data.course_id]
    if course["teacher_id"] != current_user["_id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only create assignments for your courses"
        )
    
    assignment_id = f"ASG{len(assignments) + 1:06d}"
    
    assignment = {
        "assignment_id": assignment_id,
        "title": assignment_data.title,
        "description": assignment_data.description,
        "course_id": assignment_data.course_id,
        "course_name": course["course_name"],
        "teacher_id": current_user["_id"],
        "teacher_name": current_user["name"],
        "class_name": assignment_data.class_name,
        "due_date": assignment_data.due_date,
        "max_points": assignment_data.max_points,
        "status": AssignmentStatus.PUBLISHED,
        "created_at": datetime.now(),
        "updated_at": datetime.now()
    }
    
    assignments[assignment_id] = assignment
    return Assignment(**assignment)

@router.get("/", response_model=List[Assignment])
async def list_assignments(
    class_name: Optional[str] = None,
    course_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """List assignments with role-based filtering"""
    assignment_list = list(assignments.values())
    
    # Students can only see assignments for their class
    if current_user["role"] == "student":
        student_class = current_user.get("class_name")
        if student_class:
            assignment_list = [a for a in assignment_list if a["class_name"] == student_class]
    
    # Teachers can only see their assignments
    elif current_user["role"] == "teacher":
        assignment_list = [a for a in assignment_list if a["teacher_id"] == current_user["_id"]]
    
    # Apply additional filters
    if class_name:
        assignment_list = [a for a in assignment_list if a["class_name"] == class_name]
    
    if course_id:
        assignment_list = [a for a in assignment_list if a["course_id"] == course_id]
    
    return [Assignment(**assignment) for assignment in assignment_list]

@router.get("/{assignment_id}", response_model=Assignment)
async def get_assignment(
    assignment_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get assignment details"""
    if assignment_id not in assignments:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )
    
    assignment = assignments[assignment_id]
    
    # Check access permissions
    if current_user["role"] == "student":
        student_class = current_user.get("class_name")
        if assignment["class_name"] != student_class:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only view assignments for your class"
            )
    elif current_user["role"] == "teacher":
        if assignment["teacher_id"] != current_user["_id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only view your own assignments"
            )
    
    return Assignment(**assignment)

@router.post("/{assignment_id}/submit", response_model=AssignmentSubmission)
async def submit_assignment(
    assignment_id: str,
    submission_data: SubmissionCreate,
    current_user: dict = Depends(get_current_user)
):
    """Submit assignment (students only)"""
    if current_user["role"] != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can submit assignments"
        )
    
    if assignment_id not in assignments:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )
    
    assignment = assignments[assignment_id]
    
    # Check if student is in the right class
    student_class = current_user.get("class_name")
    if assignment["class_name"] != student_class:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only submit assignments for your class"
        )
    
    # Check if already submitted
    existing_submission = None
    for sub in submissions.values():
        if sub["assignment_id"] == assignment_id and sub["student_id"] == current_user["_id"]:
            existing_submission = sub
            break
    
    if existing_submission:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Assignment already submitted. Contact teacher to resubmit."
        )
    
    submission_id = f"SUB{len(submissions) + 1:06d}"
    now = datetime.now()
    
    # Check if late submission
    submission_status = "submitted"
    if now > assignment["due_date"]:
        submission_status = "late"
    
    submission = {
        "submission_id": submission_id,
        "assignment_id": assignment_id,
        "student_id": current_user["_id"],
        "student_name": current_user["name"],
        "content": submission_data.content,
        "submitted_at": now,
        "grade": None,
        "feedback": None,
        "status": submission_status
    }
    
    submissions[submission_id] = submission
    return AssignmentSubmission(**submission)

@router.get("/{assignment_id}/submissions", response_model=List[AssignmentSubmission])
async def get_assignment_submissions(
    assignment_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get all submissions for an assignment (teachers and admins only)"""
    if current_user["role"] not in ["teacher", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers and admins can view submissions"
        )
    
    if assignment_id not in assignments:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )
    
    assignment = assignments[assignment_id]
    
    # Teachers can only see submissions for their assignments
    if current_user["role"] == "teacher" and assignment["teacher_id"] != current_user["_id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only view submissions for your assignments"
        )
    
    # Get all submissions for this assignment
    assignment_submissions = [
        sub for sub in submissions.values() 
        if sub["assignment_id"] == assignment_id
    ]
    
    return [AssignmentSubmission(**sub) for sub in assignment_submissions]

@router.put("/submissions/{submission_id}/grade", response_model=AssignmentSubmission)
async def grade_submission(
    submission_id: str,
    grade_data: GradeSubmission,
    current_user: dict = Depends(get_current_user)
):
    """Grade student submission (teachers only)"""
    if current_user["role"] != "teacher":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers can grade submissions"
        )
    
    if submission_id not in submissions:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Submission not found"
        )
    
    submission = submissions[submission_id]
    assignment = assignments[submission["assignment_id"]]
    
    # Check if teacher owns the assignment
    if assignment["teacher_id"] != current_user["_id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only grade submissions for your assignments"
        )
    
    # Validate grade is within max points
    if grade_data.grade > assignment["max_points"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Grade cannot exceed {assignment['max_points']} points"
        )
    
    # Update submission
    submission.update({
        "grade": grade_data.grade,
        "feedback": grade_data.feedback,
        "status": "graded"
    })
    
    return AssignmentSubmission(**submission)

@router.get("/my-submissions", response_model=List[AssignmentSubmission])
async def get_my_submissions(
    current_user: dict = Depends(get_current_user)
):
    """Get current student's submissions"""
    if current_user["role"] != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only students can view their submissions"
        )
    
    # Get all submissions for this student
    student_submissions = [
        sub for sub in submissions.values() 
        if sub["student_id"] == current_user["_id"]
    ]
    
    return [AssignmentSubmission(**sub) for sub in student_submissions]

@router.delete("/{assignment_id}")
async def delete_assignment(
    assignment_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete assignment (teachers and admins only)"""
    if assignment_id not in assignments:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assignment not found"
        )
    
    assignment = assignments[assignment_id]
    
    # Teachers can only delete their own assignments
    if current_user["role"] == "teacher" and assignment["teacher_id"] != current_user["_id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own assignments"
        )
    elif current_user["role"] not in ["teacher", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only teachers and admins can delete assignments"
        )
    
    # Delete assignment and related submissions
    del assignments[assignment_id]
    
    # Delete related submissions
    submissions_to_delete = [
        sub_id for sub_id, sub in submissions.items() 
        if sub["assignment_id"] == assignment_id
    ]
    for sub_id in submissions_to_delete:
        del submissions[sub_id]
    
    return {"message": "Assignment deleted successfully"}