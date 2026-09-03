from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services.assessment_service import AssessmentService
from app.schemas.assessment import AssessmentSubmitRequest

router = APIRouter(prefix="/assessments", tags=["Assessment Engine"])


@router.get("")
async def get_all_assessments(db: AsyncSession = Depends(get_db)):
    asmt_service = AssessmentService(db)
    asmts = await asmt_service.get_all_assessments()
    return {
        "success": True,
        "data": [a.model_dump() for a in asmts],
    }


@router.get("/{id}")
async def get_assessment_by_id(id: str, db: AsyncSession = Depends(get_db)):
    asmt_service = AssessmentService(db)
    asmt = await asmt_service.get_assessment_by_id(id)
    if not asmt:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return {
        "success": True,
        "data": asmt.model_dump(),
    }


@router.post("/{id}/submit")
async def submit_assessment_attempt(
    id: str,
    req: AssessmentSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    asmt_service = AssessmentService(db)
    result = await asmt_service.submit_attempt(
        user_id=current_user.id,
        asmt_id=id,
        req=req,
    )
    return {
        "success": True,
        "data": result.model_dump(),
    }
