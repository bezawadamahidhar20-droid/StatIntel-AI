from fastapi import APIRouter
from app.api.v1 import (
    auth,
    profile,
    competencies,
    users,
    assessments,
    skill_gaps,
    courses,
    recommendations,
    learning,
    quiz,
    assistant,
    integrations,
    workforce,
    analytics,
    admin,
    catalog,
)

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(profile.router)
api_router.include_router(competencies.router)
api_router.include_router(users.router)
api_router.include_router(assessments.router)
api_router.include_router(skill_gaps.router)
api_router.include_router(courses.router)
api_router.include_router(recommendations.router)
api_router.include_router(learning.router)
api_router.include_router(quiz.router)
api_router.include_router(assistant.router)
api_router.include_router(integrations.router)
api_router.include_router(workforce.router)
api_router.include_router(analytics.router)
api_router.include_router(admin.router)
api_router.include_router(catalog.router)

