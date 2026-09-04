from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import require_permission, get_current_user
from app.models.user import User
from app.services.workforce_service import WorkforceService

router = APIRouter(prefix="/workforce", tags=["Workforce Intelligence"])


@router.get("/overview")
async def get_workforce_overview(
    current_user: User = Depends(require_permission("workforce:read")),
    db: AsyncSession = Depends(get_db),
):
    wf_service = WorkforceService(db)
    overview = await wf_service.get_workforce_overview()
    return {
        "success": True,
        "data": overview.model_dump(),
    }


@router.get("/heatmap")
async def get_workforce_heatmap(
    current_user: User = Depends(require_permission("workforce:read")),
    db: AsyncSession = Depends(get_db),
):
    wf_service = WorkforceService(db)
    heatmap = await wf_service.get_department_heatmap()
    return {
        "success": True,
        "data": [h.model_dump() for h in heatmap],
    }


@router.get("/skill-demand")
async def get_predictive_skill_demand(
    current_user: User = Depends(require_permission("workforce:read")),
    db: AsyncSession = Depends(get_db),
):
    wf_service = WorkforceService(db)
    predictive = await wf_service.get_predictive_skill_demand()
    return {
        "success": True,
        "data": [p.model_dump() for p in predictive],
    }


@router.get("/readiness")
async def get_workforce_readiness(
    current_user: User = Depends(require_permission("workforce:read")),
    db: AsyncSession = Depends(get_db),
):
    wf_service = WorkforceService(db)
    overview = await wf_service.get_workforce_overview()
    return {
        "success": True,
        "data": {
            "overallReadiness": overview.overallReadiness,
            "totalLearners": overview.totalLearners,
            "activeLearners": overview.activeLearners,
        },
    }


@router.get("/placement-readiness")
async def get_placement_readiness(
    target_role: str = "Senior Statistical Officer",
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.services.placement_readiness_service import PlacementReadinessService
    data = PlacementReadinessService.calculate_placement_readiness(
        db=db,
        user=current_user,
        target_role=target_role
    )
    return {
        "success": True,
        "data": data,
    }
