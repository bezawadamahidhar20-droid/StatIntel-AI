from typing import Any, Dict, List, Optional
from app.core.config import settings
from app.core.logging import logger
from app.integrations.base import TrainingProvider
from app.integrations.igot_client import IGOTClient, IGOTUnavailable, IGOTAuthError
from app.integrations.igot_mapper import map_course
from app.integrations.igot_fixtures import FIXTURE_COURSES


class IGOTProvider(TrainingProvider):
    """iGOT Karmayogi (Sunbird ED) adapter.
    live -> portal.igotkarmayogi.gov.in with Karmayogi Bharat issued token
    sandbox -> dev.karmayogibharat.net
    mock -> offline fixtures, deep links still point to the real portal
    """

    SEARCH = "/api/content/v1/search"
    READ = "/api/content/v1/read/{cid}"
    ENROL = "/api/course/v1/enrol"
    ENROL_LIST = "/api/course/v1/user/enrollment/list/{uid}"
    BATCH_LIST = "/api/course/v1/batch/list"

    def __init__(self) -> None:
        self.client = IGOTClient()

    # ── discovery ────────────────────────────────────────────────
    async def search_courses(
        self, query: str = "", domain: Optional[str] = None, limit: int = 20
    ) -> List[Dict[str, Any]]:
        filters: Dict[str, Any] = {"primaryCategory": ["Course"], "status": ["Live"]}
        if domain and domain != "All":
            filters["keywords"] = [domain]
        if settings.IGOT_CHANNEL_ID:
            filters["channel"] = [settings.IGOT_CHANNEL_ID]

        payload = {
            "request": {
                "filters": filters,
                "query": query or "",
                "fields": [
                    "identifier",
                    "name",
                    "description",
                    "duration",
                    "competencies_v5",
                    "posterImage",
                    "appIcon",
                    "creator",
                    "source",
                    "avgRating",
                    "primaryCategory",
                    "difficultyLevel",
                ],
                "limit": limit,
                "offset": 0,
                "sort_by": {"lastPublishedOn": "desc"},
            }
        }

        try:
            data = await self.client.request("POST", self.SEARCH, payload)
            nodes = (data.get("result") or {}).get("content") or []
            return [map_course(n) for n in nodes]
        except (IGOTUnavailable, IGOTAuthError) as e:
            logger.warning(f"iGOT search fallback ({settings.IGOT_MODE}): {e}")
            return self._fixtures(query, domain)

    async def get_course(self, course_id: str) -> Optional[Dict[str, Any]]:
        cid = course_id.replace("igot-", "")
        try:
            data = await self.client.request("GET", self.READ.format(cid=cid))
            node = (data.get("result") or {}).get("content")
            return map_course(node) if node else None
        except (IGOTUnavailable, IGOTAuthError):
            return next(
                (
                    c
                    for c in self._fixtures()
                    if course_id in (c["id"], c["external_course_id"])
                ),
                None,
            )

    # ── enrolment & progress ─────────────────────────────────────
    async def enrol(
        self, user_id: str, course_id: str, batch_id: Optional[str] = None
    ) -> Dict[str, Any]:
        cid = course_id.replace("igot-", "")
        batch_id = batch_id or await self._first_open_batch(cid)
        payload = {"request": {"courseId": cid, "userId": user_id, "batchId": batch_id}}
        try:
            res = await self.client.request("POST", self.ENROL, payload, cache=False)
            return {"enrolled": res.get("responseCode") == "OK", "raw": res}
        except (IGOTUnavailable, IGOTAuthError) as e:
            # graceful degradation: provide the real learner portal link
            return {
                "enrolled": False,
                "reason": str(e),
                "mode": settings.IGOT_MODE,
                "redirectUrl": f"https://portal.igotkarmayogi.gov.in/app/toc/{cid}/overview",
            }

    async def get_enrollment_status(self, user_id: str, course_id: str) -> Dict[str, Any]:
        for e in await self.list_enrolments(user_id):
            if e.get("courseId") in (course_id, course_id.replace("igot-", "")):
                return {
                    "user_id": user_id,
                    "course_id": course_id,
                    "enrolled": True,
                    "enrolled_at": e.get("enrolledDate"),
                }
        return {"user_id": user_id, "course_id": course_id, "enrolled": False}

    async def get_completion_status(self, user_id: str, course_id: str) -> Dict[str, Any]:
        for e in await self.list_enrolments(user_id):
            if e.get("courseId") in (course_id, course_id.replace("igot-", "")):
                return {
                    "user_id": user_id,
                    "course_id": course_id,
                    "completed": e.get("status") == 2,
                    "progress_percentage": float(e.get("completionPercentage") or 0),
                }
        return {
            "user_id": user_id,
            "course_id": course_id,
            "completed": False,
            "progress_percentage": 0.0,
        }

    async def list_enrolments(self, user_id: str) -> List[Dict[str, Any]]:
        try:
            data = await self.client.request(
                "GET", self.ENROL_LIST.format(uid=user_id), cache=False
            )
            return (data.get("result") or {}).get("courses") or []
        except (IGOTUnavailable, IGOTAuthError):
            return []

    # ── helpers ──────────────────────────────────────────────────
    async def _first_open_batch(self, cid: str) -> Optional[str]:
        payload = {"request": {"filters": {"courseId": cid, "status": "1"}}}
        try:
            data = await self.client.request("POST", self.BATCH_LIST, payload)
            batches = ((data.get("result") or {}).get("response") or {}).get("content") or []
            return batches[0]["batchId"] if batches else None
        except Exception:
            return None

    def _fixtures(self, query: str = "", domain: Optional[str] = None) -> List[Dict[str, Any]]:
        out = [map_course(n) for n in FIXTURE_COURSES]
        if query:
            q = query.lower()
            out = [
                c
                for c in out
                if q in c["title"].lower() or q in (c.get("description") or "").lower()
            ]
        if domain and domain != "All":
            out = [
                c
                for c in out
                if domain.lower() in " ".join(c.get("competencies_covered", [])).lower()
            ]
        return out
