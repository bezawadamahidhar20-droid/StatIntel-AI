from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.assessment import Assessment, Question, AssessmentAttempt


class AssessmentRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> List[Assessment]:
        stmt = select(Assessment).options(selectinload(Assessment.questions))
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_by_id(self, asmt_id: str) -> Optional[Assessment]:
        stmt = select(Assessment).options(selectinload(Assessment.questions)).where(Assessment.id == asmt_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def create_assessment(self, assessment: Assessment) -> Assessment:
        self.db.add(assessment)
        await self.db.flush()
        return assessment

    async def record_attempt(self, attempt: AssessmentAttempt) -> AssessmentAttempt:
        self.db.add(attempt)
        await self.db.flush()
        return attempt

    async def get_user_attempts(self, user_id: str) -> List[AssessmentAttempt]:
        stmt = select(AssessmentAttempt).where(AssessmentAttempt.user_id == user_id)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())
