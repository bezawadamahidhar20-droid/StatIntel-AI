from typing import List, Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.skill_gap import SkillGap


class SkillGapRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_skill_gaps(self, user_id: str) -> List[SkillGap]:
        stmt = select(SkillGap).where(SkillGap.user_id == user_id).order_by(SkillGap.priority_rank)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def save_skill_gap(self, sg: SkillGap) -> SkillGap:
        self.db.add(sg)
        await self.db.flush()
        return sg

    async def delete_user_skill_gaps(self, user_id: str):
        stmt = select(SkillGap).where(SkillGap.user_id == user_id)
        result = await self.db.execute(stmt)
        for row in result.scalars().all():
            await self.db.delete(row)
        await self.db.flush()
