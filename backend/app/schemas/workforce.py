from typing import List, Optional
from pydantic import BaseModel


class DepartmentCompetencyScoreSchema(BaseModel):
    competency: str
    score: float
    gapSeverity: str  # Normal, Moderate, Critical
    staffAffected: int


class DepartmentHeatmapRowSchema(BaseModel):
    department: str
    totalStaff: int
    readinessScore: float
    scores: List[DepartmentCompetencyScoreSchema]


class PredictiveSkillItemSchema(BaseModel):
    skill: str
    currentDemand: float
    projectedGrowth: float  # e.g., 42 for +42%
    urgency: str  # High, Medium, Emerging
    drivers: str
    targetOfficers: int


class WorkforceOverviewSchema(BaseModel):
    totalLearners: int
    activeLearners: int
    overallReadiness: float
    criticalGapsCount: int
    heatmap: List[DepartmentHeatmapRowSchema]
    predictiveSkills: List[PredictiveSkillItemSchema]
