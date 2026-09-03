from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.course import Course, Enrollment, LearningPath
from app.repositories.course_repository import CourseRepository
from app.repositories.user_repository import UserRepository
from app.services.recommendation_service import RecommendationService
from app.schemas.course import CourseResponse, CourseProgressUpdateRequest


class CourseService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.course_repo = CourseRepository(db)
        self.user_repo = UserRepository(db)
        self.rec_service = RecommendationService(db)

    async def get_all_courses(self, provider: Optional[str] = None, domain: Optional[str] = None) -> List[CourseResponse]:
        courses = await self.course_repo.get_all(provider=provider, domain=domain)
        return [self.rec_service._map_course(c, c.match_score, "") for c in courses]

    async def get_course_by_id(self, course_id: str) -> Optional[CourseResponse]:
        course = await self.course_repo.get_by_id(course_id)
        if not course:
            return None
        return self.rec_service._map_course(course, course.match_score, "")

    async def enroll_course(self, user_id: str, course_id: str) -> CourseResponse:
        course = await self.course_repo.get_by_id(course_id)
        if not course:
            raise Exception("Course not found")

        enrollment = await self.course_repo.get_user_enrollment(user_id, course_id)
        if not enrollment:
            enrollment = Enrollment(
                user_id=user_id,
                course_id=course_id,
                status="In Progress",
                progress=10.0,
            )
            await self.course_repo.save_enrollment(enrollment)

        course.status = "In Progress"
        course.progress = max(course.progress, 10.0)
        self.db.add(course)
        await self.db.commit()

        return self.rec_service._map_course(course, course.match_score, user_id)

    async def update_learning_progress(self, user_id: str, course_id: str, progress: float) -> CourseResponse:
        course = await self.course_repo.get_by_id(course_id)
        if not course:
            raise Exception("Course not found")

        enrollment = await self.course_repo.get_user_enrollment(user_id, course_id)
        if enrollment:
            enrollment.progress = progress
            if progress >= 100.0:
                enrollment.status = "Completed"
            self.db.add(enrollment)

        course.progress = progress
        if progress >= 100.0:
            course.status = "Completed"
        else:
            course.status = "In Progress"

        self.db.add(course)

        # Update User learning hours
        user = await self.user_repo.get_by_id(user_id)
        if user and progress >= 100.0:
            user.learning_hours += course.duration_hours
            self.db.add(user)

        await self.db.commit()

        return self.rec_service._map_course(course, course.match_score, user_id)

    async def get_personalized_learning_path(self, user_id: str):
        courses = await self.get_all_courses()
        steps = []
        for idx, c in enumerate(courses[:4]):
            steps.append({
                "stepNumber": idx + 1,
                "courseId": c.id,
                "courseTitle": c.title,
                "provider": c.provider,
                "domain": c.domain,
                "duration": c.duration,
                "difficulty": c.difficulty,
                "matchScore": c.matchScore,
                "competenciesImproved": c.competenciesCovered,
                "expectedImprovement": c.whyRecommended.expectedImprovement if c.whyRecommended else "+15%",
                "status": "In Progress" if idx == 0 else "Up Next" if idx == 1 else "Locked",
            })

        return {
            "targetCompetency": "Python for Statistical Analytics & Sampling Methodology",
            "targetLevel": "L4 (Advanced)",
            "estimatedDuration": "28 hours total",
            "overallProgress": 35.0,
            "steps": steps,
        }
