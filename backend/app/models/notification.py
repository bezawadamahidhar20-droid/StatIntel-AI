from typing import Optional
from sqlalchemy import String, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, UUIDMixin, TimestampMixin


class Notification(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "notifications"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    message: Mapped[str] = mapped_column(String(1000), nullable=False)
    time_str: Mapped[str] = mapped_column(String(100), default="Just now")
    type: Mapped[str] = mapped_column(String(50), default="recommendation")  # recommendation, assessment, achievement, alert
    read: Mapped[bool] = mapped_column(Boolean, default=False)
    link_view: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
