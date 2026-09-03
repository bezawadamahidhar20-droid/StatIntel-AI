from typing import List, Dict, Any, Optional
import httpx
from app.integrations.base import TrainingProvider
from app.core.config import settings
from app.core.logging import logger


class IGOTProvider(TrainingProvider):
    def __init__(self):
        self.api_url = settings.IGOT_API_URL
        self.api_key = settings.IGOT_API_KEY

    async def search_courses(self, query: str = "", domain: Optional[str] = None) -> List[Dict[str, Any]]:
        # Structured iGOT Karmayogi catalog integration mock
        return [
            {
                "id": "igot-001",
                "providerCourseId": "IGOT-MOSPI-PY-01",
                "title": "iGOT Karmayogi: Python Foundations for Official Statistics",
                "provider": "iGOT Karmayogi",
                "domain": domain or "Technical",
                "duration": "12 hours",
                "rating": 4.8,
                "externalUrl": "https://igot-karmayogi.gov.in/course/IGOT-MOSPI-PY-01",
                "competencies": ["Python for Statistical & Microdata Analytics"],
            },
            {
                "id": "igot-002",
                "providerCourseId": "IGOT-DPDP-2023",
                "title": "iGOT Karmayogi: Data Privacy & Governance under DPDP Act 2023",
                "provider": "iGOT Karmayogi",
                "domain": "Digital Governance",
                "duration": "8 hours",
                "rating": 4.9,
                "externalUrl": "https://igot-karmayogi.gov.in/course/IGOT-DPDP-2023",
                "competencies": ["DPDP Act 2023 & Data Privacy"],
            },
        ]

    async def get_course(self, course_id: str) -> Optional[Dict[str, Any]]:
        courses = await self.search_courses()
        for c in courses:
            if c["id"] == course_id or c["providerCourseId"] == course_id:
                return c
        return None

    async def get_enrollment_status(self, user_id: str, course_id: str) -> Dict[str, Any]:
        return {
            "user_id": user_id,
            "course_id": course_id,
            "enrolled": True,
            "enrolled_at": "2026-06-01",
        }

    async def get_completion_status(self, user_id: str, course_id: str) -> Dict[str, Any]:
        return {
            "user_id": user_id,
            "course_id": course_id,
            "completed": False,
            "progress_percentage": 45.0,
        }
