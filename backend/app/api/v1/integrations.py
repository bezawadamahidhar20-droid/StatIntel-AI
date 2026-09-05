from typing import Optional
from fastapi import APIRouter, Query, HTTPException, Depends
from app.core.config import settings
from app.integrations.igot_client import IGOTClient
from app.integrations.igot_provider import IGOTProvider
from app.integrations.nssta_provider import NSSTAProvider
from app.integrations.tpac_provider import TPACProvider
from app.schemas.course import IGOTEnrolRequest
from app.api.v1.auth import get_current_user

router = APIRouter(prefix="/integrations", tags=["External Integrations (iGOT/NSSTA/TPAC)"])


@router.get("/igot/courses")
async def get_igot_courses(
    query: str = "", domain: Optional[str] = Query(None), limit: int = 20
):
    provider = IGOTProvider()
    courses = await provider.search_courses(query=query, domain=domain, limit=limit)
    return {"success": True, "mode": settings.IGOT_MODE, "data": courses}


@router.get("/igot/courses/{course_id}")
async def get_igot_course(course_id: str):
    provider = IGOTProvider()
    course = await provider.get_course(course_id)
    if not course:
        raise HTTPException(status_code=404, detail="Course not found on iGOT Karmayogi")
    return {"success": True, "data": course}


@router.post("/igot/enroll")
async def igot_enroll(body: IGOTEnrolRequest, user=Depends(get_current_user)):
    provider = IGOTProvider()
    user_id = getattr(user, "igot_user_id", None) or str(getattr(user, "id", "user-001"))
    result = await provider.enrol(user_id, body.course_id, body.batch_id)
    return {"success": True, "data": result}


@router.get("/igot/my-learning")
async def igot_my_learning(user=Depends(get_current_user)):
    provider = IGOTProvider()
    user_id = getattr(user, "igot_user_id", None) or str(getattr(user, "id", "user-001"))
    enrolments = await provider.list_enrolments(user_id)
    return {"success": True, "data": enrolments}


@router.get("/igot/health")
async def igot_health():
    client = IGOTClient()
    return {
        "status": "healthy",
        "mode": settings.IGOT_MODE,
        "base_url": client.base,
        "credentialed": bool(settings.IGOT_API_KEY),
        "sandbox_url": settings.IGOT_SANDBOX_URL,
    }


@router.get("/nssta/courses")
async def get_nssta_courses(query: str = "", domain: Optional[str] = Query(None)):
    provider = NSSTAProvider()
    courses = await provider.search_courses(query=query, domain=domain)
    return {"success": True, "data": courses}


@router.get("/tpac/courses")
async def get_tpac_courses(query: str = "", domain: Optional[str] = Query(None)):
    provider = TPACProvider()
    courses = await provider.search_courses(query=query, domain=domain)
    return {"success": True, "data": courses}
