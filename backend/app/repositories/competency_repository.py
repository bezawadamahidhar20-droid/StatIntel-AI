from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.competency import Competency, UserCompetency


class CompetencyRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_competencies(self) -> List[Competency]:
        stmt = select(Competency)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_by_id(self, comp_id: str) -> Optional[Competency]:
        stmt = select(Competency).where(Competency.id == comp_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_user_competencies(self, user_id: str) -> List[UserCompetency]:
        stmt = select(UserCompetency).where(UserCompetency.user_id == user_id)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_user_competency(self, user_id: str, comp_id: str) -> Optional[UserCompetency]:
        stmt = select(UserCompetency).where(
            UserCompetency.user_id == user_id,
            UserCompetency.competency_id == comp_id,
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def save_user_competency(self, uc: UserCompetency) -> UserCompetency:
        self.db.add(uc)
        await self.db.flush()
        return uc
