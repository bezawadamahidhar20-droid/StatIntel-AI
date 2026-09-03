from typing import List, Dict, Any, Optional
from app.integrations.base import TrainingProvider
from app.core.config import settings


class NSSTAProvider(TrainingProvider):
    def __init__(self):
        self.api_url = settings.NSSTA_API_URL
        self.api_key = settings.NSSTA_API_KEY

    async def search_courses(self, query: str = "", domain: Optional[str] = None) -> List[Dict[str, Any]]:
        return [
            {
                "id": "nssta-001",
                "providerCourseId": "NSSTA-SAMPLING-L4",
                "title": "NSSTA Apex Academy: Advanced Multistage Stratified Sampling",
                "provider": "NSSTA TPAC",
                "domain": domain or "Statistical",
                "duration": "16 hours",
                "rating": 4.9,
                "externalUrl": "https://nssta.gov.in/courses/NSSTA-SAMPLING-L4",
                "competencies": ["Survey Design & Sampling Methodology"],
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
        return {"user_id": user_id, "course_id": course_id, "completed": True, "grade": "Distinction"}
