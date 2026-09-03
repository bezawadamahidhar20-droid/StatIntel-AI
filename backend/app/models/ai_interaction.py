from typing import Optional, Any
from sqlalchemy import String, Integer, Float, ForeignKey, JSON, Text
from sqlalchemy.orm import Mapped, mapped_column
from app.models.base import Base, UUIDMixin, TimestampMixin


class AIInteraction(Base, UUIDMixin, TimestampMixin):
    __tablename__ = "ai_interactions"

    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True, nullable=False)
    interaction_type: Mapped[str] = mapped_column(String(50), index=True, nullable=False)  # CHAT, QUIZ_GEN, RECOMMENDATION, ASSESSMENT_EVAL
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    response: Mapped[str] = mapped_column(Text, nullable=False)
    
    provider: Mapped[str] = mapped_column(String(50), default="GeminiProvider")
    model: Mapped[str] = mapped_column(String(50), default="gemini-2.5-flash")
    latency_ms: Mapped[float] = mapped_column(Float, default=0.0)
    token_usage: Mapped[int] = mapped_column(Integer, default=0)
    meta_data: Mapped[Any] = mapped_column(JSON, default=dict)
