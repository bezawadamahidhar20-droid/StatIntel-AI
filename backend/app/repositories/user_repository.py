from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User, Department


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: str) -> Optional[User]:
        stmt = select(User).options(selectinload(User.department)).where(User.id == user_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> Optional[User]:
        stmt = select(User).options(selectinload(User.department)).where(User.email == email)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_by_employee_id(self, employee_id: str) -> Optional[User]:
        stmt = select(User).options(selectinload(User.department)).where(User.employee_id == employee_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def create(self, user: User) -> User:
        self.db.add(user)
        await self.db.flush()
        return user

    async def get_all(self, skip: int = 0, limit: int = 100) -> List[User]:
        stmt = select(User).options(selectinload(User.department)).offset(skip).limit(limit)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_departments(self) -> List[Department]:
        stmt = select(Department)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())
