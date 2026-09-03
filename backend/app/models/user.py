from enum import Enum
from typing import List, Optional
from sqlalchemy import String, Integer, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, UUIDMixin, TimestampMixin


class UserRole(str, Enum):
    LEARNER = "LEARNER"
    TRAINER = "TRAINER"
    DEPARTMENT_ADMIN = "DEPARTMENT_ADMIN"
    ADMIN = "ADMIN"
    SUPER_ADMIN = "SUPER_ADMIN"


class Department(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "departments"

    name: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)

    users: Mapped[List["User"]] = relationship("User", back_populates="department")


class User(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "users"

    employee_id: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False)
    designation: Mapped[str] = mapped_column(String(255), nullable=False)
    cadre: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    avatar: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    
    role: Mapped[UserRole] = mapped_column(String(50), default=UserRole.LEARNER, nullable=False)
    
    department_id: Mapped[Optional[str]] = mapped_column(String(36), ForeignKey("departments.id"), nullable=True)
    department: Mapped[Optional["Department"]] = relationship("Department", back_populates="users", lazy="selectin")

    qualification: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    years_of_experience: Mapped[int] = mapped_column(Integer, default=0)
    location: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Dynamic twin aggregated KPIs matching frontend contract
    overall_competency: Mapped[float] = mapped_column(Float, default=0.0)
    role_readiness: Mapped[float] = mapped_column(Float, default=0.0)
    critical_gaps_count: Mapped[int] = mapped_column(Integer, default=0)
    learning_hours: Mapped[float] = mapped_column(Float, default=0.0)
    assessment_average: Mapped[float] = mapped_column(Float, default=0.0)

    last_login_at: Mapped[Optional[DateTime]] = mapped_column(DateTime(timezone=True), nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True)

    # Relationships
    user_competencies: Mapped[List["UserCompetency"]] = relationship("UserCompetency", back_populates="user", cascade="all, delete-orphan")
    enrollments: Mapped[List["Enrollment"]] = relationship("Enrollment", back_populates="user", cascade="all, delete-orphan")
    assessment_attempts: Mapped[List["AssessmentAttempt"]] = relationship("AssessmentAttempt", back_populates="user", cascade="all, delete-orphan")
