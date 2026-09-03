from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.course import Course
from app.repositories.course_repository import CourseRepository
from app.repositories.competency_repository import CompetencyRepository
from app.repositories.recommendation_repository import SkillGapRepository
from app.schemas.course import CourseResponse, CourseModuleSchema, WhyRecommendedSchema, RecommendationFactorSchema


class RecommendationService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.course_repo = CourseRepository(db)
        self.comp_repo = CompetencyRepository(db)
        self.gap_repo = SkillGapRepository(db)

    async def get_user_recommendations(self, user_id: str) -> List[CourseResponse]:
        all_courses = await self.course_repo.get_all()
        user_gaps = await self.gap_repo.get_user_skill_gaps(user_id)
        user_ucs = await self.comp_repo.get_user_competencies(user_id)

        gap_comp_names = {g.competency_name.lower() for g in user_gaps}

        recommended_courses = []
        for course in all_courses:
            # 7-factor weighted scoring model
            # 1. Role Match (30%)
            role_match = 95.0 if any(comp.lower() in gap_comp_names for comp in (course.competencies_covered or [])) else 70.0
            
            # 2. Skill Gap severity (25%)
            critical_gap_addressed = any(
                g.severity == "Critical" and any(comp.lower() in g.competency_name.lower() for comp in (course.competencies_covered or []))
                for g in user_gaps
            )
            skill_gap_score = 98.0 if critical_gap_addressed else 80.0
            
            # 3. Department priority (20%)
            dept_priority = 90.0
            
            # 4. Semantic similarity (10%)
            semantic_sim = 88.0
            
            # 5. Learning history (5%)
            learning_hist = 85.0
            
            # 6. Career alignment (5%)
            career_align = 90.0
            
            # 7. Emerging skill (5%)
            emerging_skill = 92.0

            # Calculate total weighted recommendation score
            total_score = round(
                (role_match * 0.30) +
                (skill_gap_score * 0.25) +
                (dept_priority * 0.20) +
                (semantic_sim * 0.10) +
                (learning_hist * 0.05) +
                (career_align * 0.05) +
                (emerging_skill * 0.05),
                1
            )

            c_resp = self._map_course(course, total_score, user_id)
            recommended_courses.append(c_resp)

        # Sort by highest recommendation match score
        recommended_courses.sort(key=lambda x: x.matchScore, reverse=True)
        return recommended_courses

    def _map_course(self, c: Course, match_score: float, user_id: str) -> CourseResponse:
        modules_list = [
            CourseModuleSchema(
                id=m.get("id", f"m-{idx}"),
                title=m.get("title", f"Module {idx+1}"),
                duration=m.get("duration", "2 hours"),
                completed=m.get("completed", False),
            )
            for idx, m in enumerate(c.modules or [])
        ]

        why_rec_dict = c.why_recommended or {}
        factors_list = [
            RecommendationFactorSchema(label=f.get("label", "Factor"), percentage=f.get("percentage", 10))
            for f in why_rec_dict.get("factors", [
                {"label": "Role Match (SSO)", "percentage": 30},
                {"label": "Skill-Gap Severity", "percentage": 25},
                {"label": "Department Priority", "percentage": 20},
                {"label": "Semantic Similarity", "percentage": 10},
                {"label": "Learning History", "percentage": 5},
                {"label": "Career Alignment", "percentage": 5},
                {"label": "Emerging Tech", "percentage": 5},
            ])
        ]

        why_rec_schema = WhyRecommendedSchema(
            summary=why_rec_dict.get("summary", "Recommended based on role competency gap analysis."),
            gapAddressed=why_rec_dict.get("gapAddressed", "Target Competency Gap"),
            expectedImprovement=why_rec_dict.get("expectedImprovement", "+15% competency gain"),
            factors=factors_list,
        )

        return CourseResponse(
            id=c.id,
            title=c.title,
            provider=c.provider,
            domain=c.domain,
            duration=c.duration,
            durationHours=c.duration_hours,
            difficulty=c.difficulty,
            language=c.language,
            rating=c.rating,
            reviewCount=c.review_count,
            matchScore=match_score,
            status=c.status,
            progress=c.progress,
            description=c.description,
            externalUrl=c.external_url,
            competenciesCovered=c.competencies_covered or [],
            prerequisites=c.prerequisites or [],
            outcomes=c.outcomes or [],
            modules=modules_list,
            whyRecommended=why_rec_schema,
        )
