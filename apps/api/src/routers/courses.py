from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from datetime import datetime
from ..models.schemas import Course, CourseCreate
from ..services.auth_service import AuthService
from ..routers.auth import get_current_user

router = APIRouter()
auth_service = AuthService()

# In-memory storage for courses (replace with database)
courses = {}

@router.post("/", response_model=Course)
async def create_course(
    course_data: CourseCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new course (admin and teachers only)"""
    if current_user["role"] not in ["admin", "teacher"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins and teachers can create courses"
        )
    
    # If teacher, they can only assign themselves
    if current_user["role"] == "teacher" and course_data.teacher_id != current_user["_id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Teachers can only create courses for themselves"
        )
    
    # Get teacher info
    teacher = next((u for u in auth_service.users if u["_id"] == course_data.teacher_id), None)
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher not found"
        )
    
    course_id = f"CRS{len(courses) + 1:06d}"
    
    course = {
        "course_id": course_id,
        "course_name": course_data.course_name,
        "course_code": course_data.course_code,
        "description": course_data.description,
        "teacher_id": course_data.teacher_id,
        "teacher_name": teacher["name"],
        "class_name": course_data.class_name,
        "credits": course_data.credits,
        "created_at": datetime.now(),
        "is_active": True
    }
    
    courses[course_id] = course
    return Course(**course)

@router.get("/", response_model=List[Course])
async def list_courses(
    class_name: Optional[str] = None,
    teacher_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """List courses with optional filters"""
    course_list = list(courses.values())
    
    # Filter by class if provided
    if class_name:
        course_list = [c for c in course_list if c["class_name"] == class_name]
    
    # Filter by teacher if provided
    if teacher_id:
        course_list = [c for c in course_list if c["teacher_id"] == teacher_id]
    
    # Students can only see courses for their class
    if current_user["role"] == "student":
        student_class = current_user.get("class_name")
        if student_class:
            course_list = [c for c in course_list if c["class_name"] == student_class]
    
    # Teachers can only see their own courses
    if current_user["role"] == "teacher":
        course_list = [c for c in course_list if c["teacher_id"] == current_user["_id"]]
    
    return [Course(**course) for course in course_list]

@router.get("/{course_id}", response_model=Course)
async def get_course(
    course_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get course details"""
    if course_id not in courses:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    course = courses[course_id]
    
    # Check access permissions
    if current_user["role"] == "student":
        student_class = current_user.get("class_name")
        if course["class_name"] != student_class:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only view courses for your class"
            )
    elif current_user["role"] == "teacher":
        if course["teacher_id"] != current_user["_id"]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only view your own courses"
            )
    
    return Course(**course)

@router.put("/{course_id}", response_model=Course)
async def update_course(
    course_id: str,
    course_data: CourseCreate,
    current_user: dict = Depends(get_current_user)
):
    """Update course (admin and course teacher only)"""
    if course_id not in courses:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    course = courses[course_id]
    
    # Check permissions
    if current_user["role"] == "teacher" and course["teacher_id"] != current_user["_id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only update your own courses"
        )
    elif current_user["role"] not in ["admin", "teacher"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins and teachers can update courses"
        )
    
    # Get teacher info
    teacher = next((u for u in auth_service.users if u["_id"] == course_data.teacher_id), None)
    if not teacher:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Teacher not found"
        )
    
    # Update course
    course.update({
        "course_name": course_data.course_name,
        "course_code": course_data.course_code,
        "description": course_data.description,
        "teacher_id": course_data.teacher_id,
        "teacher_name": teacher["name"],
        "class_name": course_data.class_name,
        "credits": course_data.credits
    })
    
    return Course(**course)

@router.delete("/{course_id}")
async def delete_course(
    course_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete course (admin only)"""
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete courses"
        )
    
    if course_id not in courses:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    del courses[course_id]
    return {"message": "Course deleted successfully"}