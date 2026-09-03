from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services.skill_gap_service import SkillGapService

router = APIRouter(prefix="/skill-gaps", tags=["Skill Gap Engine"])


@router.get("")
async def get_skill_gaps(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    gap_service = SkillGapService(db)
    gaps = await gap_service.get_user_skill_gaps(current_user.id)
    return {
        "success": True,
        "data": [g.model_dump() for g in gaps],
    }


@router.get("/summary")
async def get_skill_gaps_summary(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    gap_service = SkillGapService(db)
    summary = await gap_service.get_user_skill_gaps_summary(current_user.id)
    return {
        "success": True,
        "data": summary.model_dump(),
    }


@router.post("/recalculate")
async def recalculate_skill_gaps(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    gap_service = SkillGapService(db)
    await gap_service.recalculate_user_skill_gaps(current_user.id)
    gaps = await gap_service.get_user_skill_gaps(current_user.id)
    return {
        "success": True,
        "data": {
            "message": "Skill gaps recalculated successfully",
            "count": len(gaps),
            "gaps": [g.model_dump() for g in gaps],
        },
    }
