import pytest
from app.core.database import AsyncSessionLocal
from app.repositories.user_repository import UserRepository
from app.repositories.competency_repository import CompetencyRepository
from app.repositories.course_repository import CourseRepository


@pytest.mark.asyncio
async def test_user_repository():
    async with AsyncSessionLocal() as session:
        user_repo = UserRepository(session)
        user = await user_repo.get_by_email("rajesh.sharma@mospi.gov.in")
        assert user is not None
        assert user.employee_id == "MOSPI-ISS-2019-042"
        assert user.role == "LEARNER"


@pytest.mark.asyncio
async def test_competency_repository():
    async with AsyncSessionLocal() as session:
        comp_repo = CompetencyRepository(session)
        comps = await comp_repo.get_all_competencies()
        assert len(comps) >= 4


@pytest.mark.asyncio
async def test_course_repository():
    async with AsyncSessionLocal() as session:
        course_repo = CourseRepository(session)
        courses = await course_repo.get_all()
        assert len(courses) >= 2
