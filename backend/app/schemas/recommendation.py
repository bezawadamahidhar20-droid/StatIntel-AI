from typing import List, Optional
from pydantic import BaseModel
from app.schemas.course import CourseResponse


class RecommendationResponse(BaseModel):
    id: str
    courseId: str
    matchScore: float
    priority: str  # Critical, High, Medium, Low
    course: CourseResponse
