from typing import List, Dict, Any, Optional
from app.integrations.base import TrainingProvider
from app.core.config import settings


class TPACProvider(TrainingProvider):
    def __init__(self):
        self.api_url = settings.TPAC_API_URL
        self.api_key = settings.TPAC_API_KEY

    async def search_courses(self, query: str = "", domain: Optional[str] = None) -> List[Dict[str, Any]]:
        return [
            {
                "id": "tpac-001",
                "providerCourseId": "TPAC-EVIDENCE-LEADERSHIP",
                "title": "TPAC: Technical Leadership & Policy Communication for Official Statisticians",
                "provider": "NSSTA TPAC",
                "domain": domain or "Behavioural & Managerial",
                "duration": "10 hours",
                "rating": 4.7,
                "externalUrl": "https://tpac.gov.in/courses/TPAC-EVIDENCE-LEADERSHIP",
                "competencies": ["Evidence-Based Policy Communication"],
            }
        ]

    async def get_course(self, course_id: str) -> Optional[Dict[str, Any]]:
        courses = await self.search_courses()
        for c in courses:
            if c["id"] == course_id or c["providerCourseId"] == course_id:
                return c
        return None

    async def get_enrollment_status(self, user_id: str, course_id: str) -> Dict[str, Any]:
        return {"user_id": user_id, "course_id": course_id, "enrolled": True}

    async def get_completion_status(self, user_id: str, course_id: str) -> Dict[str, Any]:
        return {"user_id": user_id, "course_id": course_id, "completed": False, "progress_percentage": 0.0}
