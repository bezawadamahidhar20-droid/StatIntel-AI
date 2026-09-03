from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.course import Course, Enrollment, LearningPath


class CourseRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self, provider: Optional[str] = None, domain: Optional[str] = None) -> List[Course]:
        stmt = select(Course).where(Course.is_active == True)
        if provider:
            stmt = stmt.where(Course.provider == provider)
        if domain:
            stmt = stmt.where(Course.domain == domain)
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_by_id(self, course_id: str) -> Optional[Course]:
        stmt = select(Course).where(Course.id == course_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def create_course(self, course: Course) -> Course:
        self.db.add(course)
        await self.db.flush()
        return course

    async def get_user_enrollment(self, user_id: str, course_id: str) -> Optional[Enrollment]:
        stmt = select(Enrollment).where(
            Enrollment.user_id == user_id,
            Enrollment.course_id == course_id,
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def save_enrollment(self, enrollment: Enrollment) -> Enrollment:
        self.db.add(enrollment)
        await self.db.flush()
        return enrollment

    async def get_user_learning_path(self, user_id: str) -> Optional[LearningPath]:
        stmt = select(LearningPath).where(LearningPath.user_id == user_id)
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def save_learning_path(self, lp: LearningPath) -> LearningPath:
        self.db.add(lp)
        await self.db.flush()
        return lp
