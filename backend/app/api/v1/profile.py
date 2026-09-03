from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter(prefix="/profile", tags=["Profile"])


from pydantic import BaseModel, Field

class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = Field(None, min_length=1, max_length=100)
    designation: Optional[str] = Field(None, min_length=1, max_length=100)
    cadre: Optional[str] = Field(None, max_length=100)
    qualification: Optional[str] = Field(None, max_length=100)
    years_of_experience: Optional[int] = Field(None, ge=0, le=70)
    location: Optional[str] = Field(None, max_length=100)



@router.get("")
async def get_profile(current_user: User = Depends(get_current_user)):
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
            "qualification": current_user.qualification,
            "yearsOfExperience": current_user.years_of_experience,
            "location": current_user.location,
            "overallCompetency": current_user.overall_competency,
            "roleReadiness": current_user.role_readiness,
            "criticalGapsCount": current_user.critical_gaps_count,
            "learningHours": current_user.learning_hours,
            "assessmentAverage": current_user.assessment_average,
        },
    }


@router.put("")
async def update_profile(
    req: ProfileUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if req.full_name is not None:
        current_user.full_name = req.full_name
    if req.designation is not None:
        current_user.designation = req.designation
    if req.cadre is not None:
        current_user.cadre = req.cadre
    if req.qualification is not None:
        current_user.qualification = req.qualification
    if req.years_of_experience is not None:
        current_user.years_of_experience = req.years_of_experience
    if req.location is not None:
        current_user.location = req.location

    db.add(current_user)
    await db.commit()
    await db.refresh(current_user)

    return {
        "success": True,
        "data": {
            "message": "Profile updated successfully",
            "user": {
                "id": current_user.id,
                "name": current_user.full_name,
                "designation": current_user.designation,
                "cadre": current_user.cadre,
                "email": current_user.email,
            },
        },
    }
