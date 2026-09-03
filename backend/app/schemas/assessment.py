from typing import List, Optional, Any
from pydantic import BaseModel, ConfigDict, Field



class QuestionSchema(BaseModel):
    id: str
    question: str
    options: List[str]
    correctIndex: int
    explanation: str
    difficulty: str
    competency: str
    sourceReference: Optional[str] = None
    approved: bool = True


class AssessmentResponse(BaseModel):
    id: str
    title: str
    description: str
    domain: str
    targetCompetency: str
    sourceDocName: Optional[str] = None
    totalQuestions: int
    durationMinutes: int
    questions: List[QuestionSchema]
    difficulty: str
    createdBy: str


class AssessmentSubmitRequest(BaseModel):
    answers: List[int]  # Selected indices for each question
    timeSpentSeconds: int = Field(default=0, ge=0)



class QuizResultResponse(BaseModel):
    assessmentId: str
    assessmentTitle: str
    targetCompetency: str
    score: int
    total: int
    accuracy: float
    timeSpentSeconds: int
    competencyBefore: float
    competencyAfter: float
    competencyGain: float
    answers: List[Any]
    timestamp: str
