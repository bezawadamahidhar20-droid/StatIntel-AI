from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_
from app.models.learning import CatalogCourse, CourseStatusEnum, VerificationStatusEnum, SourceClassEnum
from app.schemas.learning_schemas import CatalogCourseResponse


class CatalogService:
    @classmethod
    async def get_catalog_courses(
        cls,
        db: AsyncSession,
        role: Optional[str] = None,
        domain: Optional[str] = None,
        level: Optional[str] = None,
        provider: Optional[str] = None,
        search: Optional[str] = None,
    ) -> List[CatalogCourseResponse]:
        """
        Retrieves accredited MoSPI / NSSTA / iGOT courses with filtering by role and domain.
        """
        stmt = select(CatalogCourse)

        conditions = []
        if domain and domain != "All":
            conditions.append(CatalogCourse.domain == domain)
        if level and level != "All":
            conditions.append(CatalogCourse.level == level)
        if provider and provider != "All":
            conditions.append(CatalogCourse.provider.ilike(f"%{provider}%"))
        if search:
            search_term = f"%{search.strip()}%"
            conditions.append(
                or_(
                    CatalogCourse.title.ilike(search_term),
                    CatalogCourse.description.ilike(search_term),
                    CatalogCourse.course_code.ilike(search_term),
                )
            )

        if conditions:
            stmt = stmt.where(and_(*conditions))

        res = await db.execute(stmt.order_by(CatalogCourse.course_code))
        courses = res.scalars().all()

        results: List[CatalogCourseResponse] = []
        for c in courses:
            # Check role match if requested
            if role and role != "All":
                role_lower = role.lower()
                matches_primary_role = role_lower in c.role.lower()
                matches_supported_roles = any(role_lower in r.lower() for r in (c.roles_supported or []))
                if not (matches_primary_role or matches_supported_roles):
                    continue

            results.append(
                CatalogCourseResponse(
                    id=c.id,
                    course_code=c.course_code,
                    title=c.title,
                    description=c.description,
                    provider=c.provider,
                    provider_type=c.provider_type,
                    role=c.role,
                    roles_supported=c.roles_supported or [],
                    department=c.department,
                    domain=c.domain,
                    competencies_covered=c.competencies_covered or [],
                    duration=c.duration,
                    duration_hours=c.duration_hours,
                    delivery_mode=c.delivery_mode,
                    eligibility=c.eligibility,
                    level=c.level,
                    source_class=c.source_class,
                    official_url=c.official_url,
                    source_url=c.source_url,
                    last_verified=c.last_verified,
                    status=c.status,
                    verification_status=c.verification_status,
                    modules_count=c.modules_count,
                    topics_count=c.topics_count,
                    is_mandatory_for_role=c.is_mandatory_for_role,
                )
            )

        return results


catalog_service = CatalogService()
