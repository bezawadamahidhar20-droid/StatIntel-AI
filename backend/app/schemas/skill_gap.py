from typing import List, Optional
from pydantic import BaseModel, ConfigDict


class SkillGapResponse(BaseModel):
    id: str
    competencyId: str
    competencyName: str
    domain: str
    currentLevel: str
    requiredLevel: str
    currentScore: float
    requiredScore: float
    gapLevels: int
    severity: str
    roleRelevance: float
    priorityRank: int
    estimatedTimeToBridge: str
    recommendedCourseId: Optional[str] = None
    rationale: str


class SkillGapSummaryResponse(BaseModel):
    totalGapsCount: int
    criticalGapsCount: int
    mediumGapsCount: int
    lowGapsCount: int
    topPriorityCompetency: Optional[str] = None
    gaps: List[SkillGapResponse]
