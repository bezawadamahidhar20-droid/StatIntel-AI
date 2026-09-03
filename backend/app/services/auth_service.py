from datetime import datetime, timezone
from typing import Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_token,
)
from app.core.exceptions import (
    UnauthorizedException,
    AppException,
    NotFoundException,
)
from app.models.user import User, UserRole
from app.repositories.user_repository import UserRepository
from app.repositories.audit_repository import AuditRepository
from app.schemas.auth import LoginRequest, RegisterRequest, TokenSchema
from app.core.config import settings


class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)
        self.audit_repo = AuditRepository(db)

    async def register(self, req: RegisterRequest) -> User:
        existing = await self.user_repo.get_by_email(req.email)
        if existing:
            raise AppException(status_code=400, code="EMAIL_EXISTS", message="Email is already registered")

        existing_emp = await self.user_repo.get_by_employee_id(req.employee_id)
        if existing_emp:
            raise AppException(status_code=400, code="EMPLOYEE_ID_EXISTS", message="Employee ID is already registered")

        user = User(
            employee_id=req.employee_id,
            email=req.email,
            hashed_password=get_password_hash(req.password),
            full_name=req.full_name,
            designation=req.designation,
            department_id=req.department_id,
            role=req.role,
        )
        created_user = await self.user_repo.create(user)
        await self.audit_repo.log_action(
            user_id=created_user.id,
            user_email=created_user.email,
            action="USER_REGISTERED",
            resource="User",
            resource_id=created_user.id,
        )
        return created_user

    async def login(self, req: LoginRequest) -> Dict[str, Any]:
        user = await self.user_repo.get_by_email(req.email)
        if not user or not verify_password(req.password, user.hashed_password):
            raise UnauthorizedException("Invalid email or password")

        if not user.is_active:
            raise AppException(status_code=403, code="ACCOUNT_DISABLED", message="Account is deactivated")

        user.last_login_at = datetime.now(timezone.utc)
        self.db.add(user)

        role_str = user.role.value if hasattr(user.role, "value") else str(user.role)
        access_token = create_access_token(
            subject=user.id,
            extra_claims={"email": user.email, "role": role_str},
        )
        refresh_token = create_refresh_token(subject=user.id)

        await self.audit_repo.log_action(
            user_id=user.id,
            user_email=user.email,
            action="LOGIN_SUCCESS",
            resource="User",
            resource_id=user.id,
        )

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            "user": user,
        }

    async def refresh_tokens(self, refresh_token: str) -> Dict[str, Any]:
        payload = decode_token(refresh_token)
        if payload.get("type") != "refresh":
            raise UnauthorizedException("Invalid refresh token type")

        user_id = payload.get("sub")
        user = await self.user_repo.get_by_id(user_id)
        if not user or not user.is_active:
            raise UnauthorizedException("User not found or inactive")

        role_str = user.role.value if hasattr(user.role, "value") else str(user.role)
        new_access_token = create_access_token(
            subject=user.id,
            extra_claims={"email": user.email, "role": role_str},
        )
        new_refresh_token = create_refresh_token(subject=user.id)

        return {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer",
            "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        }
