from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services.recommendation_service import RecommendationService

router = APIRouter(prefix="/recommendations", tags=["Explainable Recommendation Engine"])


@router.get("")
async def get_recommendations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    rec_service = RecommendationService(db)
    courses = await rec_service.get_user_recommendations(current_user.id)
    return {
        "success": True,
        "data": [c.model_dump() for c in courses],
    }


@router.post("/generate")
async def generate_recommendations(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    rec_service = RecommendationService(db)
    courses = await rec_service.get_user_recommendations(current_user.id)
    return {
        "success": True,
        "data": {
            "message": "Explainable recommendations refreshed successfully",
            "recommendations": [c.model_dump() for c in courses],
        },
    }
