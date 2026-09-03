from typing import List, Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.ai.learning_assistant import StatIntelLearningAssistant

router = APIRouter(prefix="/assistant", tags=["AI Learning Assistant"])


class AssistantChatRequest(BaseModel):
    message: str


@router.post("/chat")
async def chat_with_assistant(
    req: AssistantChatRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    assistant = StatIntelLearningAssistant()
    user_ctx = {
        "full_name": current_user.full_name,
        "designation": current_user.designation,
        "department": current_user.department.name if current_user.department else "MoSPI",
        "overallCompetency": current_user.overall_competency,
    }
    answer = await assistant.chat(
        user_message=req.message,
        user_context=user_ctx,
    )
    return {
        "success": True,
        "data": {
            "reply": answer,
            "sender": "StatIntel Assistant",
            "timestamp": "Just now",
        },
    }


@router.get("/history")
async def get_chat_history(current_user: User = Depends(get_current_user)):
    return {
        "success": True,
        "data": [],
    }
