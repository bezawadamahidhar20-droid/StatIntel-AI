from typing import List, Optional
from sqlalchemy import String, ForeignKey, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, UUIDMixin, TimestampMixin


class Certificate(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "certificates"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    credential_id: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    course_title: Mapped[str] = mapped_column(String(255), nullable=False)
    provider: Mapped[str] = mapped_column(String(100), nullable=False)
    issue_date: Mapped[str] = mapped_column(String(100), nullable=False)
    expiry_date: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    
    recipient_name: Mapped[str] = mapped_column(String(255), nullable=False)
    recipient_role: Mapped[str] = mapped_column(String(255), nullable=False)
    grade: Mapped[str] = mapped_column(String(50), default="Distinction")
    verification_url: Mapped[str] = mapped_column(String(500), nullable=False)

    competencies_acquired: Mapped[List[str]] = mapped_column(JSON, default=list)
