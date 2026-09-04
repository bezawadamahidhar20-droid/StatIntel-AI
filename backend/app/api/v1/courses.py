from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services.course_service import CourseService

router = APIRouter(prefix="/courses", tags=["Course Management"])


@router.get("")
async def get_courses(
    provider: Optional[str] = Query(None),
    domain: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    course_service = CourseService(db)
    courses = await course_service.get_all_courses(provider=provider, domain=domain)
    return {
        "success": True,
        "data": [c.model_dump() for c in courses],
    }


@router.get("/{id}")
async def get_course_by_id(id: str, db: AsyncSession = Depends(get_db)):
    course_service = CourseService(db)
    course = await course_service.get_course_by_id(id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
    return {
        "success": True,
        "data": course.model_dump(),
    }


@router.get("/{id}/curriculum")
async def get_course_curriculum(
    id: str,
    current_user: Optional[User] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.services.learning_service import learning_service
    user_id = current_user.id if current_user else "usr-10492"
    curriculum = await learning_service.get_course_curriculum(db, id, user_id)
    if not curriculum:
        raise HTTPException(status_code=404, detail="Course curriculum not found")
    return {
        "success": True,
        "data": curriculum.model_dump(),
    }


@router.post("/{id}/enroll")
async def enroll_course(
    id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    course_service = CourseService(db)
    course = await course_service.enroll_course(current_user.id, id)
    return {
        "success": True,
        "data": course.model_dump(),
    }

