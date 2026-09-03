from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services.course_service import CourseService
from app.schemas.course import CourseProgressUpdateRequest

router = APIRouter(prefix="/learning", tags=["Learning Path & Progress"])


@router.get("/path")
async def get_learning_path(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    course_service = CourseService(db)
    path = await course_service.get_personalized_learning_path(current_user.id)
    return {
        "success": True,
        "data": path,
    }


@router.put("/progress")
async def update_learning_progress(
    course_id: str,
    req: CourseProgressUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    course_service = CourseService(db)
    course = await course_service.update_learning_progress(
        user_id=current_user.id,
        course_id=course_id,
        progress=req.progress,
    )
    return {
        "success": True,
        "data": course.model_dump(),
    }
