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
    current_user: User = Depends(require_permission("users:read")),
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
