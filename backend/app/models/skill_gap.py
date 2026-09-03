from sqlalchemy import String, Integer, Float, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, UUIDMixin, TimestampMixin


class SkillGap(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "skill_gaps"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    competency_id: Mapped[str] = mapped_column(String(36), ForeignKey("competencies.id"), index=True, nullable=False)
    competency_name: Mapped[str] = mapped_column(String(255), nullable=False)
    domain: Mapped[str] = mapped_column(String(100), nullable=False)

    current_level: Mapped[str] = mapped_column(String(10), default="L1")
    required_level: Mapped[str] = mapped_column(String(10), default="L3")
    
    current_score: Mapped[float] = mapped_column(Float, default=0.0)
    required_score: Mapped[float] = mapped_column(Float, default=75.0)
    gap_levels: Mapped[int] = mapped_column(Integer, default=1)

    severity: Mapped[str] = mapped_column(String(50), default="Critical")  # Critical, High, Medium, Low
    role_relevance: Mapped[float] = mapped_column(Float, default=90.0)  # e.g., 95%
    priority_rank: Mapped[int] = mapped_column(Integer, default=1)
    estimated_time_to_bridge: Mapped[str] = mapped_column(String(100), default="12-16 hours")

    recommended_course_id: Mapped[str] = mapped_column(String(100), nullable=True)
    rationale: Mapped[str] = mapped_column(Text, nullable=False)
