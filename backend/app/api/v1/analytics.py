from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services.workforce_service import WorkforceService

router = APIRouter(prefix="/analytics", tags=["Admin Analytics"])


@router.get("/overview")
async def get_analytics_overview(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    wf_service = WorkforceService(db)
    overview = await wf_service.get_workforce_overview()
    return {
        "success": True,
        "data": {
            "totalLearners": overview.totalLearners,
            "activeLearners": overview.activeLearners,
            "overallReadiness": overview.overallReadiness,
            "criticalGapsCount": overview.criticalGapsCount,
            "totalCourses": 12,
            "totalAssessmentsCompleted": 184,
        },
    }


@router.get("/competencies")
async def get_analytics_competencies(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return {
        "success": True,
        "data": {
            "statistical": {"averageScore": 81.2, "targetMetPercent": 78},
            "technical": {"averageScore": 58.4, "targetMetPercent": 42},
            "digitalGovernance": {"averageScore": 67.0, "targetMetPercent": 60},
            "behavioural": {"averageScore": 84.0, "targetMetPercent": 88},
        },
    }


@router.get("/training")
async def get_analytics_training(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    return {
        "success": True,
        "data": {
            "totalEnrollments": 420,
            "completions": 312,
            "completionRate": 74.3,
            "averageLearningHours": 38.5,
        },
    }
