from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import require_permission, get_current_user
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.repositories.audit_repository import AuditRepository

router = APIRouter(prefix="/admin", tags=["Admin Operations"])


@router.get("/users")
async def get_admin_users(
    skip: int = Query(0),
    limit: int = Query(100),
    current_user: User = Depends(require_permission("system:admin")),
    db: AsyncSession = Depends(get_db),
):

    user_repo = UserRepository(db)
    users = await user_repo.get_all(skip=skip, limit=limit)
    return {
        "success": True,
        "data": [
            {
                "id": u.id,
                "name": u.full_name,
                "email": u.email,
                "employeeId": u.employee_id,
                "designation": u.designation,
                "department": u.department.name if u.department else "MoSPI",
                "role": u.role.value if hasattr(u.role, "value") else str(u.role),
                "overallCompetency": u.overall_competency,
                "roleReadiness": u.role_readiness,
                "criticalGapsCount": u.critical_gaps_count,
            }
            for u in users
        ],
    }


@router.get("/departments")
async def get_admin_departments(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    user_repo = UserRepository(db)
    depts = await user_repo.get_departments()
    return {
        "success": True,
        "data": [
            {
                "id": d.id,
                "name": d.name,
                "code": d.code,
                "description": d.description,
            }
            for d in depts
        ],
    }


@router.get("/audit-logs")
async def get_admin_audit_logs(
    limit: int = Query(100),
    current_user: User = Depends(require_permission("system:admin")),
    db: AsyncSession = Depends(get_db),
):
    audit_repo = AuditRepository(db)
    logs = await audit_repo.get_logs(limit=limit)
    return {
        "success": True,
        "data": [
            {
                "id": l.id,
                "userId": l.user_id,
                "userEmail": l.user_email,
                "action": l.action,
                "resource": l.resource,
                "resourceId": l.resource_id,
                "createdAt": l.created_at.isoformat(),
            }
            for l in logs
        ],
    }


@router.post("/demo-reset")
async def reset_demo_state(
    current_user: User = Depends(require_permission("system:admin")),
    db: AsyncSession = Depends(get_db),
):
    """
    SIH Presentation Safe Reset Mechanism:
    Resets demo learner (Rajesh Sharma) to pristine initial demonstration state:
    - Competency: Survey Design & Sampling Methodology back to 78.0% (L3)
    - Overall Competency: 78.0%, Role Readiness: 72.0%
    - Course progress reset
    - Active skill gap reset to Critical (Gap: 20.0)
    - Records an audit log entry
    """
    from sqlalchemy import select
    from app.models.competency import UserCompetency
    from app.models.course import Enrollment, Course
    from app.models.skill_gap import SkillGap
    from app.models.audit_log import AuditLog

    # Reset Learner
    user_stmt = select(User).where(User.id == "usr-10492")
    user_res = await db.execute(user_stmt)
    learner = user_res.scalars().first()
    if learner:
        learner.overall_competency = 78.0
        learner.role_readiness = 72.0
        learner.critical_gaps_count = 1
        learner.learning_hours = 24.5
        learner.assessment_average = 82.0
        db.add(learner)

    # Reset UserCompetency for Survey Design
    uc_stmt = select(UserCompetency).where(
        UserCompetency.user_id == "usr-10492",
        UserCompetency.competency_id == "comp-01",
    )
    uc_res = await db.execute(uc_stmt)
    uc = uc_res.scalars().first()
    if uc:
        uc.current_score = 78.0
        uc.current_level = "L3"
        db.add(uc)

    # Reset Course status and enrollments
    course_stmt = select(Course).where(Course.id == "crs-01")
    crs_res = await db.execute(course_stmt)
    course = crs_res.scalars().first()
    if course:
        course.status = "Available"
        course.progress = 0.0
        db.add(course)

    enr_stmt = select(Enrollment).where(Enrollment.user_id == "usr-10492")
    enr_res = await db.execute(enr_stmt)
    enrollments = enr_res.scalars().all()
    for enr in enrollments:
        enr.progress = 0.0
        enr.status = "Enrolled"
        db.add(enr)

    # Reset SkillGap
    gap_stmt = select(SkillGap).where(
        SkillGap.user_id == "usr-10492",
        SkillGap.competency_id == "comp-01",
    )
    gap_res = await db.execute(gap_stmt)
    gap = gap_res.scalars().first()
    if gap:
        gap.current_score = 78.0
        gap.current_level = "L3"
        gap.gap_score = 20.0
        gap.gap_level = 1
        gap.severity = "Critical"
        gap.status = "ACTIVE"
        db.add(gap)

    # Log action
    audit_entry = AuditLog(
        user_id=current_user.id,
        user_email=current_user.email,
        action="DEMO_RESET",
        resource="system",
        resource_id="demo_state",
    )
    db.add(audit_entry)
    await db.commit()

    return {
        "success": True,
        "data": {
            "message": "SIH Demo State successfully reset to pristine baseline.",
            "targetUser": "usr-10492 (Rajesh Sharma, SSO)",
            "competencyReset": "Survey Design & Sampling Methodology -> 78.0% (L3)",
            "gapReset": "Critical Gap (20.0%)",
        },
    }
