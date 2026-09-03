from enum import Enum
from typing import List, Optional, Any
from sqlalchemy import String, Integer, Float, ForeignKey, JSON, Boolean, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, UUIDMixin, TimestampMixin


class QuestionTypeEnum(str, Enum):
    MCQ = "MCQ"
    MULTI_SELECT = "MULTI_SELECT"
    TRUE_FALSE = "TRUE_FALSE"
    SCENARIO = "SCENARIO"
    PRACTICAL = "PRACTICAL"
    SHORT_ANSWER = "SHORT_ANSWER"


class DifficultyEnum(str, Enum):
    EASY = "EASY"
    MEDIUM = "MEDIUM"
    HARD = "HARD"
    EXPERT = "EXPERT"
    ADAPTIVE = "ADAPTIVE"


class Assessment(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "assessments"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    domain: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    target_competency: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    source_doc_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    
    total_questions: Mapped[int] = mapped_column(Integer, default=5)
    duration_minutes: Mapped[int] = mapped_column(Integer, default=15)
    difficulty: Mapped[str] = mapped_column(String(50), default="Medium")
    created_by: Mapped[str] = mapped_column(String(100), default="System")

    questions: Mapped[List["Question"]] = relationship("Question", back_populates="assessment", cascade="all, delete-orphan")
    attempts: Mapped[List["AssessmentAttempt"]] = relationship("AssessmentAttempt", back_populates="assessment", cascade="all, delete-orphan")


class Question(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "questions"

    assessment_id: Mapped[str] = mapped_column(String(36), ForeignKey("assessments.id"), index=True, nullable=False)
    assessment: Mapped["Assessment"] = relationship("Assessment", back_populates="questions")

    question_text: Mapped[str] = mapped_column(Text, nullable=False)
    options: Mapped[List[str]] = mapped_column(JSON, nullable=False)  # List of string options
    correct_index: Mapped[int] = mapped_column(Integer, nullable=False)
    explanation: Mapped[str] = mapped_column(Text, nullable=False)
    difficulty: Mapped[str] = mapped_column(String(50), default="Medium")
    competency: Mapped[str] = mapped_column(String(255), nullable=False)
    source_reference: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)  # Grounded RAG citation reference
    approved: Mapped[bool] = mapped_column(Boolean, default=True)


class AssessmentAttempt(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "assessment_attempts"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    user: Mapped["User"] = relationship("User", back_populates="assessment_attempts")

    assessment_id: Mapped[str] = mapped_column(String(36), ForeignKey("assessments.id"), index=True, nullable=False)
    assessment: Mapped["Assessment"] = relationship("Assessment", back_populates="attempts")

    score: Mapped[int] = mapped_column(Integer, default=0)
    total_questions: Mapped[int] = mapped_column(Integer, default=0)
    accuracy: Mapped[float] = mapped_column(Float, default=0.0)  # Percentage 0 - 100
    time_spent_seconds: Mapped[int] = mapped_column(Integer, default=0)

    competency_before: Mapped[float] = mapped_column(Float, default=0.0)
    competency_after: Mapped[float] = mapped_column(Float, default=0.0)
    competency_gain: Mapped[float] = mapped_column(Float, default=0.0)

    user_answers: Mapped[List[Any]] = mapped_column(JSON, default=list)
