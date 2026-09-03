from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services.competency_service import CompetencyService

router = APIRouter(prefix="/users", tags=["Users & Digital Twin"])


@router.get("/me/competency-twin")
async def get_my_competency_twin(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    comp_service = CompetencyService(db)
    twin_data = await comp_service.get_user_digital_twin(current_user.id)
    return {
        "success": True,
        "data": twin_data.model_dump(),
    }


@router.get("/me/competencies")
async def get_my_competencies(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    comp_service = CompetencyService(db)
    twin_data = await comp_service.get_user_digital_twin(current_user.id)
    return {
        "success": True,
        "data": twin_data.competencies,
    }
