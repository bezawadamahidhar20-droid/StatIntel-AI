from typing import Optional

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


@router.post("/topics/{topic_id}/complete")
async def complete_topic(
    topic_id: str,
    req: Optional[dict] = None,
    current_user: Optional[User] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.services.learning_service import learning_service
    user_id = current_user.id if current_user else "usr-10492"
    time_spent = req.get("time_spent_seconds", 300) if req else 300
    res = await learning_service.mark_topic_complete(db, topic_id, user_id, time_spent)
    return {
        "success": True,
        "data": res.model_dump(),
    }


@router.post("/resources/{resource_id}/progress")
async def track_resource_progress(
    resource_id: str,
    req: Optional[dict] = None,
    current_user: Optional[User] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.services.learning_service import learning_service
    user_id = current_user.id if current_user else "usr-10492"
    is_done = req.get("is_completed", True) if req else True
    await learning_service.update_resource_progress(db, resource_id, user_id, is_done)
    return {
        "success": True,
        "data": {"resource_id": resource_id, "is_completed": is_done},
    }


@router.post("/topics/{topic_id}/generate-notes")
async def generate_topic_notes(
    topic_id: str,
    db: AsyncSession = Depends(get_db),
):
    from app.services.learning_service import learning_service
    notes = await learning_service.generate_study_notes(db, topic_id)
    return {
        "success": True,
        "data": notes.model_dump(),
    }


@router.post("/modules/{module_id}/assessment")
async def submit_module_assessment(
    module_id: str,
    req: dict,
    current_user: Optional[User] = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.services.learning_service import learning_service
    user_id = current_user.id if current_user else "usr-10492"
    answers = req.get("user_answers", [1, 0, 2, 3, 1])
    time_spent = req.get("time_spent_seconds", 180)
    result = await learning_service.submit_module_assessment(db, module_id, user_id, answers, time_spent)
    return {
        "success": True,
        "data": result.model_dump(),
    }

