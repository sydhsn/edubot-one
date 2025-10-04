from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from datetime import datetime
from ..models.schemas import Timetable, TimetableCreate, TimeSlot
from ..services.auth_service import AuthService
from ..routers.auth import get_current_user

router = APIRouter()
auth_service = AuthService()

# In-memory storage for timetables (replace with database)
timetables = {}

@router.post("/", response_model=Timetable)
async def create_timetable(
    timetable_data: TimetableCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create class timetable (admin only)"""
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create timetables"
        )
    
    # Validate that all courses and teachers exist
    from .courses import courses
    for slot in timetable_data.week_schedule:
        if slot.course_id not in courses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Course {slot.course_id} not found"
            )
        
        course = courses[slot.course_id]
        teacher = next((u for u in auth_service.users if u["_id"] == slot.teacher_id), None)
        if not teacher:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Teacher {slot.teacher_id} not found"
            )
    
    timetable_id = f"TT{len(timetables) + 1:06d}"
    
    timetable = {
        "timetable_id": timetable_id,
        "class_name": timetable_data.class_name,
        "week_schedule": [slot.dict() for slot in timetable_data.week_schedule],
        "created_by": current_user["_id"],
        "created_at": datetime.now(),
        "is_active": True
    }
    
    timetables[timetable_id] = timetable
    return Timetable(**timetable)

@router.get("/", response_model=List[Timetable])
async def list_timetables(
    class_name: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """List timetables"""
    timetable_list = list(timetables.values())
    
    # Students can only see their class timetable
    if current_user["role"] == "student":
        student_class = current_user.get("class_name")
        if student_class:
            timetable_list = [t for t in timetable_list if t["class_name"] == student_class]
    
    # Teachers can see timetables for classes they teach
    elif current_user["role"] == "teacher":
        teacher_id = current_user["_id"]
        filtered_timetables = []
        for tt in timetable_list:
            # Check if teacher has any slots in this timetable
            has_slots = any(slot["teacher_id"] == teacher_id for slot in tt["week_schedule"])
            if has_slots:
                filtered_timetables.append(tt)
        timetable_list = filtered_timetables
    
    # Filter by class if provided
    if class_name:
        timetable_list = [t for t in timetable_list if t["class_name"] == class_name]
    
    return [Timetable(**tt) for tt in timetable_list]

@router.get("/{timetable_id}", response_model=Timetable)
async def get_timetable(
    timetable_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Get timetable details"""
    if timetable_id not in timetables:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Timetable not found"
        )
    
    timetable = timetables[timetable_id]
    
    # Check access permissions
    if current_user["role"] == "student":
        student_class = current_user.get("class_name")
        if timetable["class_name"] != student_class:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only view your class timetable"
            )
    elif current_user["role"] == "teacher":
        teacher_id = current_user["_id"]
        has_slots = any(slot["teacher_id"] == teacher_id for slot in timetable["week_schedule"])
        if not has_slots:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only view timetables where you teach"
            )
    
    return Timetable(**timetable)

@router.get("/class/{class_name}", response_model=Timetable)
async def get_class_timetable(
    class_name: str,
    current_user: dict = Depends(get_current_user)
):
    """Get timetable for a specific class"""
    # Find active timetable for the class
    class_timetable = None
    for tt in timetables.values():
        if tt["class_name"] == class_name and tt["is_active"]:
            class_timetable = tt
            break
    
    if not class_timetable:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No active timetable found for class {class_name}"
        )
    
    # Check access permissions
    if current_user["role"] == "student":
        student_class = current_user.get("class_name")
        if class_name != student_class:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only view your class timetable"
            )
    elif current_user["role"] == "teacher":
        teacher_id = current_user["_id"]
        has_slots = any(slot["teacher_id"] == teacher_id for slot in class_timetable["week_schedule"])
        if not has_slots:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only view timetables where you teach"
            )
    
    return Timetable(**class_timetable)

@router.put("/{timetable_id}", response_model=Timetable)
async def update_timetable(
    timetable_id: str,
    timetable_data: TimetableCreate,
    current_user: dict = Depends(get_current_user)
):
    """Update timetable (admin only)"""
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can update timetables"
        )
    
    if timetable_id not in timetables:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Timetable not found"
        )
    
    # Validate that all courses and teachers exist
    from .courses import courses
    for slot in timetable_data.week_schedule:
        if slot.course_id not in courses:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Course {slot.course_id} not found"
            )
        
        teacher = next((u for u in auth_service.users if u["_id"] == slot.teacher_id), None)
        if not teacher:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Teacher {slot.teacher_id} not found"
            )
    
    timetable = timetables[timetable_id]
    timetable.update({
        "class_name": timetable_data.class_name,
        "week_schedule": [slot.dict() for slot in timetable_data.week_schedule]
    })
    
    return Timetable(**timetable)

@router.delete("/{timetable_id}")
async def delete_timetable(
    timetable_id: str,
    current_user: dict = Depends(get_current_user)
):
    """Delete timetable (admin only)"""
    if current_user["role"] != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can delete timetables"
        )
    
    if timetable_id not in timetables:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Timetable not found"
        )
    
    del timetables[timetable_id]
    return {"message": "Timetable deleted successfully"}