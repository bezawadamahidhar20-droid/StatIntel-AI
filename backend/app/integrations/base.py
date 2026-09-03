from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional


class TrainingProvider(ABC):
    @abstractmethod
    async def search_courses(self, query: str = "", domain: Optional[str] = None) -> List[Dict[str, Any]]:
        pass

    @abstractmethod
    async def get_course(self, course_id: str) -> Optional[Dict[str, Any]]:
        pass

    @abstractmethod
    async def get_enrollment_status(self, user_id: str, course_id: str) -> Dict[str, Any]:
        pass

    @abstractmethod
    async def get_completion_status(self, user_id: str, course_id: str) -> Dict[str, Any]:
        pass
