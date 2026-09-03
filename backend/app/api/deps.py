from typing import List, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.security import decode_token
from app.core.exceptions import UnauthorizedException, PermissionDeniedException
from app.models.user import User, UserRole
from app.repositories.user_repository import UserRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

# Permission matrix map
ROLE_PERMISSIONS = {
    UserRole.LEARNER: [
        "users:read",
        "courses:read",
        "assessments:read",
        "assessments:submit",
        "skill_gaps:read",
        "recommendations:read",
        "quiz:generate",
        "assistant:chat",
    ],
    UserRole.TRAINER: [
        "users:read",
        "courses:read",
        "courses:write",
        "assessments:read",
        "assessments:create",
        "assessments:grade",
        "quiz:generate",
        "assistant:chat",
    ],
    UserRole.DEPARTMENT_ADMIN: [
        "users:read",
        "courses:read",
        "analytics:read",
        "workforce:read",
        "departments:read",
    ],
    UserRole.ADMIN: [
        "users:read",
        "users:write",
        "courses:read",
        "courses:write",
        "assessments:read",
        "assessments:create",
        "assessments:grade",
        "analytics:read",
        "workforce:read",
        "system:admin",
    ],
    UserRole.SUPER_ADMIN: [
        "users:read",
        "users:write",
        "courses:read",
        "courses:write",
        "assessments:read",
        "assessments:create",
        "assessments:grade",
        "analytics:read",
        "workforce:read",
        "system:admin",
    ],
}


async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    if not token:
        raise UnauthorizedException("Authentication token is required")

    payload = decode_token(token)
    user_id = payload.get("sub")
    if not user_id:
        raise UnauthorizedException("Invalid token payload")


    user_repo = UserRepository(db)
    user = await user_repo.get_by_id(user_id)
    if not user or not user.is_active:
        raise UnauthorizedException("User not found or inactive")

    return user


def require_permission(permission: str):
    async def permission_checker(current_user: User = Depends(get_current_user)) -> User:
        user_permissions = ROLE_PERMISSIONS.get(current_user.role, [])
        if permission not in user_permissions and "system:admin" not in user_permissions:
            raise PermissionDeniedException(f"Permission '{permission}' is required")
        return current_user

    return permission_checker


def require_roles(allowed_roles: List[UserRole]):
    async def role_checker(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in allowed_roles:
            raise PermissionDeniedException(f"Role in {allowed_roles} is required")
        return current_user

    return role_checker
