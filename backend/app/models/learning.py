import enum
from typing import List, Optional, Any
from sqlalchemy import String, Integer, Float, ForeignKey, JSON, Text, Boolean, Enum as SQLEnum, DateTime, func, UniqueConstraint, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, UUIDMixin, TimestampMixin


class SourceClassEnum(str, enum.Enum):
    OFFICIAL_GOVERNMENT = "OFFICIAL_GOVERNMENT"
    OFFICIAL_DOCUMENTATION = "OFFICIAL_DOCUMENTATION"
    UNIVERSITY = "UNIVERSITY"
    EDUCATIONAL_PLATFORM = "EDUCATIONAL_PLATFORM"
    YOUTUBE = "YOUTUBE"
    GENERATED = "GENERATED"
    OTHER = "OTHER"


class VerificationStatusEnum(str, enum.Enum):
    VERIFIED = "VERIFIED"
    UNVERIFIED = "UNVERIFIED"
    DISABLED = "DISABLED"


class CourseStatusEnum(str, enum.Enum):
    CURRENT = "CURRENT"
    HISTORICAL = "HISTORICAL"
    ARCHIVED = "ARCHIVED"


class TopicProgressStatusEnum(str, enum.Enum):
    NOT_STARTED = "NOT_STARTED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"


class LearningModule(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "learning_modules"

    course_id: Mapped[str] = mapped_column(String(36), ForeignKey("courses.id", ondelete="CASCADE"), index=True, nullable=False)
    module_number: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="")
    duration: Mapped[str] = mapped_column(String(100), default="2 hours")
    order_index: Mapped[int] = mapped_column(Integer, default=0)

    # Relationships
    course = relationship("Course", back_populates="learning_modules")
    topics: Mapped[List["LearningTopic"]] = relationship("LearningTopic", back_populates="module", cascade="all, delete-orphan", order_by="LearningTopic.order_index")
    assessment = relationship("ModuleAssessment", back_populates="module", uselist=False, cascade="all, delete-orphan")


class LearningTopic(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "learning_topics"

    module_id: Mapped[str] = mapped_column(String(36), ForeignKey("learning_modules.id", ondelete="CASCADE"), index=True, nullable=False)
    topic_number: Mapped[int] = mapped_column(Integer, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="")
    estimated_minutes: Mapped[int] = mapped_column(Integer, default=20)
    difficulty: Mapped[str] = mapped_column(String(50), default="Intermediate")
    competency_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True, index=True)
    skill_level: Mapped[str] = mapped_column(String(10), default="L3")
    prerequisites: Mapped[List[str]] = mapped_column(JSON, default=list)
    learning_objectives: Mapped[List[str]] = mapped_column(JSON, default=list)
    exercises: Mapped[List[Any]] = mapped_column(JSON, default=list)
    order_index: Mapped[int] = mapped_column(Integer, default=0)

    # Relationships
    module = relationship("LearningModule", back_populates="topics")
    resources: Mapped[List["LearningResource"]] = relationship("LearningResource", back_populates="topic", cascade="all, delete-orphan", order_by="LearningResource.order_index")
    progress_records = relationship("TopicProgress", back_populates="topic", cascade="all, delete-orphan")


class LearningResource(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "learning_resources"

    topic_id: Mapped[str] = mapped_column(String(36), ForeignKey("learning_topics.id", ondelete="CASCADE"), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="")
    url: Mapped[str] = mapped_column(String(1000), nullable=False)
    resource_type: Mapped[str] = mapped_column(String(50), nullable=False)  # OFFICIAL_DOCUMENT, WEB_TUTORIAL, YOUTUBE_VIDEO, DOCUMENTATION, PRACTICE, PDF_NOTES
    provider: Mapped[str] = mapped_column(String(100), nullable=False)  # W3Schools, YouTube, Python Docs, Pandas Docs, MoSPI, NSSTA
    source_domain: Mapped[str] = mapped_column(String(255), nullable=False)
    source_class: Mapped[SourceClassEnum] = mapped_column(SQLEnum(SourceClassEnum), default=SourceClassEnum.OTHER, nullable=False)
    language: Mapped[str] = mapped_column(String(50), default="English")
    difficulty: Mapped[str] = mapped_column(String(50), default="Intermediate")
    estimated_minutes: Mapped[int] = mapped_column(Integer, default=15)
    is_free: Mapped[bool] = mapped_column(Boolean, default=True)
    is_official: Mapped[bool] = mapped_column(Boolean, default=False)
    download_url: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    thumbnail_url: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    published_date: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    last_verified: Mapped[str] = mapped_column(String(100), default="04 Sep 2026")
    verification_status: Mapped[VerificationStatusEnum] = mapped_column(SQLEnum(VerificationStatusEnum), default=VerificationStatusEnum.VERIFIED, nullable=False)
    quality_score: Mapped[int] = mapped_column(Integer, default=85)
    order_index: Mapped[int] = mapped_column(Integer, default=0)

    # Relationships
    topic = relationship("LearningTopic", back_populates="resources")
    progress_records = relationship("ResourceProgress", back_populates="resource", cascade="all, delete-orphan")


class TopicProgress(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "topic_progress"
    __table_args__ = (
        UniqueConstraint("user_id", "topic_id", name="uq_user_topic_progress"),
        Index("idx_user_topic_progress", "user_id", "topic_id"),
    )

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    topic_id: Mapped[str] = mapped_column(String(36), ForeignKey("learning_topics.id", ondelete="CASCADE"), nullable=False, index=True)
    status: Mapped[TopicProgressStatusEnum] = mapped_column(SQLEnum(TopicProgressStatusEnum), default=TopicProgressStatusEnum.NOT_STARTED, nullable=False)
    completed_at: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    time_spent_seconds: Mapped[int] = mapped_column(Integer, default=0)

    # Relationships
    user = relationship("User")
    topic = relationship("LearningTopic", back_populates="progress_records")


class ResourceProgress(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "resource_progress"
    __table_args__ = (
        UniqueConstraint("user_id", "resource_id", name="uq_user_resource_progress"),
        Index("idx_user_resource_progress", "user_id", "resource_id"),
    )

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    resource_id: Mapped[str] = mapped_column(String(36), ForeignKey("learning_resources.id", ondelete="CASCADE"), nullable=False, index=True)
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)
    last_accessed_at: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # Relationships
    user = relationship("User")
    resource = relationship("LearningResource", back_populates="progress_records")


class ModuleAssessment(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "module_assessments"
    __table_args__ = (
        UniqueConstraint("user_id", "module_id", name="uq_user_module_assessment"),
    )

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    module_id: Mapped[str] = mapped_column(String(36), ForeignKey("learning_modules.id", ondelete="CASCADE"), nullable=False, index=True)
    score: Mapped[int] = mapped_column(Integer, default=0)
    total: Mapped[int] = mapped_column(Integer, default=5)
    accuracy: Mapped[float] = mapped_column(Float, default=0.0)
    attempts_count: Mapped[int] = mapped_column(Integer, default=1)
    answers: Mapped[List[Any]] = mapped_column(JSON, default=list)
    completed_at: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # Relationships
    user = relationship("User")
    module = relationship("LearningModule", back_populates="assessment")


class CatalogCourse(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "catalog_courses"

    course_code: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    provider: Mapped[str] = mapped_column(String(100), index=True, nullable=False)  # NSSTA, iGOT Karmayogi, MoSPI Training Division
    provider_type: Mapped[str] = mapped_column(String(50), default="Apex National Academy")
    role: Mapped[str] = mapped_column(String(100), index=True, default="Indian Statistical Service (ISS)")
    roles_supported: Mapped[List[str]] = mapped_column(JSON, default=list)
    department: Mapped[str] = mapped_column(String(100), default="National Statistical Systems Training Academy (NSSTA)")
    domain: Mapped[str] = mapped_column(String(100), index=True, default="Statistical")
    competencies_covered: Mapped[List[str]] = mapped_column(JSON, default=list)
    duration: Mapped[str] = mapped_column(String(100), default="12 hours")
    duration_hours: Mapped[float] = mapped_column(Float, default=12.0)
    delivery_mode: Mapped[str] = mapped_column(String(50), default="Blended / e-Learning")
    eligibility: Mapped[str] = mapped_column(String(255), default="ISS / SSS Officers, Statistical Scholars & Analysts")
    level: Mapped[str] = mapped_column(String(50), default="Intermediate")
    source_class: Mapped[SourceClassEnum] = mapped_column(SQLEnum(SourceClassEnum), default=SourceClassEnum.OFFICIAL_GOVERNMENT)
    official_url: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    source_url: Mapped[str] = mapped_column(String(1000), nullable=False)
    last_verified: Mapped[str] = mapped_column(String(100), default="04 Sep 2026")
    status: Mapped[CourseStatusEnum] = mapped_column(SQLEnum(CourseStatusEnum), default=CourseStatusEnum.CURRENT)
    verification_status: Mapped[VerificationStatusEnum] = mapped_column(SQLEnum(VerificationStatusEnum), default=VerificationStatusEnum.VERIFIED)
    modules_count: Mapped[int] = mapped_column(Integer, default=4)
    topics_count: Mapped[int] = mapped_column(Integer, default=16)
    is_mandatory_for_role: Mapped[bool] = mapped_column(Boolean, default=False)
