from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services.competency_service import CompetencyService

router = APIRouter(prefix="/competencies", tags=["Competencies & Digital Twin"])


@router.get("")
async def get_all_competencies(db: AsyncSession = Depends(get_db)):
    comp_service = CompetencyService(db)
    comps = await comp_service.get_all_competencies()
    return {
        "success": True,
        "data": [
            {
                "id": c.id,
                "name": c.name,
                "domain": c.domain.value if hasattr(c.domain, "value") else str(c.domain),
                "description": c.description,
                "defaultRequiredLevel": c.default_required_level.value if hasattr(c.default_required_level, "value") else str(c.default_required_level),
                "defaultRequiredScore": c.default_required_score,
            }
            for c in comps
        ],
    }


@router.get("/{id}")
async def get_competency_by_id(id: str, db: AsyncSession = Depends(get_db)):
    comp_service = CompetencyService(db)
    comp = await comp_service.get_competency_by_id(id)
    if not comp:
        raise HTTPException(status_code=404, detail="Competency not found")
    return {
        "success": True,
        "data": {
            "id": comp.id,
            "name": comp.name,
            "domain": comp.domain.value if hasattr(comp.domain, "value") else str(comp.domain),
            "description": comp.description,
            "defaultRequiredLevel": comp.default_required_level.value if hasattr(comp.default_required_level, "value") else str(comp.default_required_level),
            "defaultRequiredScore": comp.default_required_score,
        },
    }
