from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, RefreshTokenRequest
from app.services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(req: RegisterRequest, db: AsyncSession = Depends(get_db)):
    auth_service = AuthService(db)
    user = await auth_service.register(req)
    role_str = user.role.value if hasattr(user.role, "value") else str(user.role)
    return {
        "success": True,
        "data": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": role_str,
        },
    }


@router.post("/login")
async def login(req: LoginRequest, db: AsyncSession = Depends(get_db)):
    auth_service = AuthService(db)
    res = await auth_service.login(req)
    user = res["user"]
    role_str = user.role.value if hasattr(user.role, "value") else str(user.role)
    return {
        "success": True,
        "data": {
            "access_token": res["access_token"],
            "refresh_token": res["refresh_token"],
            "token_type": res["token_type"],
            "expires_in": res["expires_in"],
            "user": {
                "id": user.id,
                "name": user.full_name,
                "email": user.email,
                "designation": user.designation,
                "role": role_str,
                "employeeId": user.employee_id,
            },
        },
    }


@router.post("/refresh")
async def refresh_tokens(req: RefreshTokenRequest, db: AsyncSession = Depends(get_db)):
    auth_service = AuthService(db)
    res = await auth_service.refresh_tokens(req.refresh_token)
    return {
        "success": True,
        "data": res,
    }


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    return {
        "success": True,
        "data": {"message": "Logged out successfully"},
    }


@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    role_str = current_user.role.value if hasattr(current_user.role, "value") else str(current_user.role)
    return {
        "success": True,
        "data": {
            "id": current_user.id,
            "name": current_user.full_name,
            "designation": current_user.designation,
            "department": current_user.department.name if current_user.department else "MoSPI",
            "cadre": current_user.cadre or "Indian Statistical Service (ISS)",
            "employeeId": current_user.employee_id,
            "email": current_user.email,
            "avatar": current_user.avatar or "",
            "role": role_str,
            "overallCompetency": current_user.overall_competency,
            "roleReadiness": current_user.role_readiness,
            "criticalGapsCount": current_user.critical_gaps_count,
            "learningHours": current_user.learning_hours,
            "assessmentAverage": current_user.assessment_average,
        },
    }
