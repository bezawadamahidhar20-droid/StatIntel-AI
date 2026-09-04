from typing import Optional, List
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.services.catalog_service import catalog_service
from app.services.resource_verification_service import resource_verifier

router = APIRouter(prefix="/catalog", tags=["MoSPI / NSSTA Course Catalog"])


@router.get("/nssta")
async def get_nssta_catalog(
    role: Optional[str] = Query(None, description="Filter by learner role or ISS designation"),
    domain: Optional[str] = Query(None, description="Filter by statistical/technical domain"),
    level: Optional[str] = Query(None, description="Filter by difficulty level"),
    provider: Optional[str] = Query(None, description="Filter by provider: NSSTA, iGOT Karmayogi, MoSPI"),
    search: Optional[str] = Query(None, description="Search query across course title and competencies"),
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieves the accredited NSSTA and MoSPI course catalog with role and domain filtering.
    """
    courses = await catalog_service.get_catalog_courses(
        db, role=role, domain=domain, level=level, provider=provider, search=search
    )
    return {
        "success": True,
        "total": len(courses),
        "data": [c.model_dump() for c in courses],
    }


@router.get("/nssta/roles/{role_name}")
async def get_courses_by_role(
    role_name: str,
    db: AsyncSession = Depends(get_db),
):
    """
    Retrieves tailored courses specifically mapped to an officer or student role.
    """
    courses = await catalog_service.get_catalog_courses(db, role=role_name)
    return {
        "success": True,
        "role": role_name,
        "total": len(courses),
        "data": [c.model_dump() for c in courses],
    }


@router.post("/verify-url")
async def verify_external_url(req: dict):
    """
    Performs safe validation and classification of a resource URL.
    """
    url = req.get("url")
    if not url:
        raise HTTPException(status_code=400, detail="Missing url parameter")
    result = await resource_verifier.verify_url_live(url)
    return {
        "success": True,
        "data": result,
    }
