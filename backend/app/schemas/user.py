from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from app.models.user import UserRole


class UserBase(BaseModel):
    employee_id: str
    email: str
    full_name: str
    designation: str
    cadre: Optional[str] = None
    avatar: Optional[str] = None
    role: UserRole = UserRole.LEARNER
    qualification: Optional[str] = None
    years_of_experience: int = 0
    location: Optional[str] = None


class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: str
    department_name: Optional[str] = None
    overall_competency: float = 0.0
    role_readiness: float = 0.0
    critical_gaps_count: int = 0
    learning_hours: float = 0.0
    assessment_average: float = 0.0

    # CamelCase properties matching React frontend interfaces exactly
    @property
    def name(self) -> str:
        return self.full_name

    @property
    def employeeId(self) -> str:
        return self.employee_id

    @property
    def department(self) -> str:
        return self.department_name or "MoSPI"
