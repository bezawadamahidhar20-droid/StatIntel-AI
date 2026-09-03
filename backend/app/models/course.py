from typing import List, Optional, Any
from sqlalchemy import String, Integer, Float, ForeignKey, JSON, Text, Boolean
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, UUIDMixin, TimestampMixin


class Course(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "courses"

    title: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    provider: Mapped[str] = mapped_column(String(100), index=True, nullable=False)  # iGOT Karmayogi, NSSTA TPAC, MoSPI Training Division
    domain: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    
    duration: Mapped[str] = mapped_column(String(100), default="6 hours")
    duration_hours: Mapped[float] = mapped_column(Float, default=6.0)
    difficulty: Mapped[str] = mapped_column(String(50), default="Intermediate")
    language: Mapped[str] = mapped_column(String(50), default="English")

    rating: Mapped[float] = mapped_column(Float, default=4.5)
    review_count: Mapped[int] = mapped_column(Integer, default=100)
    match_score: Mapped[float] = mapped_column(Float, default=90.0)  # e.g., 96%
    
    status: Mapped[str] = mapped_column(String(50), default="Recommended")  # Recommended, In Progress, Completed, Not Started
    progress: Mapped[float] = mapped_column(Float, default=0.0)

    description: Mapped[str] = mapped_column(Text, nullable=False)
    external_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    provider_course_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # JSON Fields matching frontend structures
    competencies_covered: Mapped[List[str]] = mapped_column(JSON, default=list)
    prerequisites: Mapped[List[str]] = mapped_column(JSON, default=list)
    outcomes: Mapped[List[str]] = mapped_column(JSON, default=list)
    modules: Mapped[List[Any]] = mapped_column(JSON, default=list)
    why_recommended: Mapped[Any] = mapped_column(JSON, default=dict)  # Structured explainable factors breakdown

    enrollments: Mapped[List["Enrollment"]] = relationship("Enrollment", back_populates="course")


class Enrollment(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "enrollments"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    user: Mapped["User"] = relationship("User", back_populates="enrollments")

    course_id: Mapped[str] = mapped_column(String(36), ForeignKey("courses.id"), index=True, nullable=False)
    course: Mapped["Course"] = relationship("Course", back_populates="enrollments")

    status: Mapped[str] = mapped_column(String(50), default="In Progress")  # In Progress, Completed
    progress: Mapped[float] = mapped_column(Float, default=0.0)  # 0 to 100
    completed_at: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)


class LearningPath(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "learning_paths"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    target_competency: Mapped[str] = mapped_column(String(255), nullable=False)
    target_level: Mapped[str] = mapped_column(String(10), default="L4")
    estimated_duration: Mapped[str] = mapped_column(String(100), default="24 hours")
    overall_progress: Mapped[float] = mapped_column(Float, default=0.0)
    steps: Mapped[List[Any]] = mapped_column(JSON, default=list)
