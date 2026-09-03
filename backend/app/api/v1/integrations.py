from typing import Optional
from fastapi import APIRouter, Query
from app.integrations.igot_provider import IGOTProvider
from app.integrations.nssta_provider import NSSTAProvider
from app.integrations.tpac_provider import TPACProvider

router = APIRouter(prefix="/integrations", tags=["External Integrations (iGOT/NSSTA/TPAC)"])


@router.get("/igot/courses")
async def get_igot_courses(query: str = "", domain: Optional[str] = Query(None)):
    provider = IGOTProvider()
    courses = await provider.search_courses(query=query, domain=domain)
    return {"success": True, "data": courses}


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
