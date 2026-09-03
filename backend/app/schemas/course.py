from typing import List, Optional, Any
from pydantic import BaseModel, ConfigDict


class CourseModuleSchema(BaseModel):
    id: str
    title: str
    duration: str
    completed: bool = False


class RecommendationFactorSchema(BaseModel):
    label: str
    percentage: float


class WhyRecommendedSchema(BaseModel):
    summary: str
    gapAddressed: str
    expectedImprovement: str
    factors: List[RecommendationFactorSchema] = []


class CourseResponse(BaseModel):
    id: str
    title: str
    provider: str
    domain: str
    duration: str
    durationHours: float
    difficulty: str
    language: str
    rating: float
    reviewCount: int
    matchScore: float
    status: str
    progress: float = 0.0
    description: str
    externalUrl: Optional[str] = None
    competenciesCovered: List[str] = []
    prerequisites: List[str] = []
    outcomes: List[str] = []
    modules: List[CourseModuleSchema] = []
    whyRecommended: Optional[WhyRecommendedSchema] = None


class CourseProgressUpdateRequest(BaseModel):
    progress: float  # 0 to 100
