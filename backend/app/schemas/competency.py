from typing import List, Optional, Any
from pydantic import BaseModel, ConfigDict
from app.models.competency import CompetencyDomainEnum, CompetencyLevelEnum


class EvidenceSourceSchema(BaseModel):
    type: str  # Assessment, Training, Experience, Certification
    title: str
    date: str
    score: Optional[str] = None


class HistoricalScoreSchema(BaseModel):
    date: str
    score: float


class CompetencyResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    name: str
    domain: str
    currentLevel: str = "L1"
    requiredLevel: str = "L3"
    currentScore: float = 0.0
    requiredScore: float = 75.0
    gap: float = 0.0
    confidence: float = 90.0
    status: str = "Critical Gap"
    description: str
    evidenceSources: List[EvidenceSourceSchema] = []
    trend: str = "stable"
    lastAssessed: str = "Not assessed"
    historicalScores: List[HistoricalScoreSchema] = []
    recommendedCourseIds: List[str] = []


class CompetencyTwinSummaryResponse(BaseModel):
    overallCompetency: float
    roleReadiness: float
    criticalGapsCount: int
    learningHours: float
    assessmentAverage: float
    competencies: List[CompetencyResponse]
