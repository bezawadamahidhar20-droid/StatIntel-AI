from enum import Enum
from typing import List, Optional, Any
from sqlalchemy import String, Integer, Float, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, UUIDMixin, TimestampMixin


class CompetencyDomainEnum(str, Enum):
    STATISTICAL = "Statistical"
    TECHNICAL = "Technical"
    DIGITAL_GOVERNANCE = "Digital Governance"
    BEHAVIOURAL = "Behavioural & Managerial"


class CompetencyLevelEnum(str, Enum):
    L1 = "L1"
    L2 = "L2"
    L3 = "L3"
    L4 = "L4"
    L5 = "L5"


class Competency(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "competencies"

    name: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    domain: Mapped[CompetencyDomainEnum] = mapped_column(String(100), index=True, nullable=False)
    description: Mapped[str] = mapped_column(String(2000), nullable=False)
    default_required_level: Mapped[CompetencyLevelEnum] = mapped_column(String(10), default=CompetencyLevelEnum.L3)
    default_required_score: Mapped[float] = mapped_column(Float, default=75.0)

    # Relationships
    user_competencies: Mapped[List["UserCompetency"]] = relationship("UserCompetency", back_populates="competency", cascade="all, delete-orphan")


class UserCompetency(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "user_competencies"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    user: Mapped["User"] = relationship("User", back_populates="user_competencies")

    competency_id: Mapped[str] = mapped_column(String(36), ForeignKey("competencies.id"), index=True, nullable=False)
    competency: Mapped["Competency"] = relationship("Competency", back_populates="user_competencies")

    current_level: Mapped[CompetencyLevelEnum] = mapped_column(String(10), default=CompetencyLevelEnum.L1)
    required_level: Mapped[CompetencyLevelEnum] = mapped_column(String(10), default=CompetencyLevelEnum.L3)
    
    current_score: Mapped[float] = mapped_column(Float, default=0.0)  # 0 to 100
    required_score: Mapped[float] = mapped_column(Float, default=75.0)  # 0 to 100
    gap: Mapped[float] = mapped_column(Float, default=-75.0)  # current - required

    confidence: Mapped[float] = mapped_column(Float, default=90.0)  # e.g., 94%
    status: Mapped[str] = mapped_column(String(50), default="Critical Gap")  # Critical Gap, Moderate Gap, Target Met, Exceeds
    trend: Mapped[str] = mapped_column(String(50), default="stable")  # increasing, stable, needs_refresh

    last_assessed: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # JSON fields for evidence log and historical scores graph matching frontend expectations
    evidence_sources: Mapped[List[Any]] = mapped_column(JSON, default=list)
    historical_scores: Mapped[List[Any]] = mapped_column(JSON, default=list)
    recommended_course_ids: Mapped[List[str]] = mapped_column(JSON, default=list)
