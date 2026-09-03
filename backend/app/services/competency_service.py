from typing import List, Dict, Any, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.competency import Competency, UserCompetency, CompetencyLevelEnum
from app.models.user import User
from app.repositories.competency_repository import CompetencyRepository
from app.repositories.user_repository import UserRepository
from app.schemas.competency import CompetencyResponse, CompetencyTwinSummaryResponse


class CompetencyService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.comp_repo = CompetencyRepository(db)
        self.user_repo = UserRepository(db)

    async def get_all_competencies(self) -> List[Competency]:
        return await self.comp_repo.get_all_competencies()

    async def get_competency_by_id(self, comp_id: str) -> Optional[Competency]:
        return await self.comp_repo.get_by_id(comp_id)

    async def get_user_digital_twin(self, user_id: str) -> CompetencyTwinSummaryResponse:
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise Exception("User not found")

        all_comps = await self.comp_repo.get_all_competencies()
        user_ucs = await self.comp_repo.get_user_competencies(user_id)
        uc_map = {uc.competency_id: uc for uc in user_ucs}

        comp_responses = []
        for comp in all_comps:
            uc = uc_map.get(comp.id)
            if uc:
                c_resp = CompetencyResponse(
                    id=comp.id,
                    name=comp.name,
                    domain=comp.domain.value if hasattr(comp.domain, "value") else str(comp.domain),
                    currentLevel=uc.current_level.value if hasattr(uc.current_level, "value") else str(uc.current_level),
                    requiredLevel=uc.required_level.value if hasattr(uc.required_level, "value") else str(uc.required_level),
                    currentScore=uc.current_score,
                    requiredScore=uc.required_score,
                    gap=uc.gap,
                    confidence=uc.confidence,
                    status=uc.status,
                    description=comp.description,
                    evidenceSources=uc.evidence_sources or [],
                    trend=uc.trend,
                    lastAssessed=uc.last_assessed or "Recent",
                    historicalScores=uc.historical_scores or [],
                    recommendedCourseIds=uc.recommended_course_ids or [],
                )
            else:
                c_resp = CompetencyResponse(
                    id=comp.id,
                    name=comp.name,
                    domain=comp.domain.value if hasattr(comp.domain, "value") else str(comp.domain),
                    currentLevel=CompetencyLevelEnum.L1.value,
                    requiredLevel=comp.default_required_level.value if hasattr(comp.default_required_level, "value") else str(comp.default_required_level),
                    currentScore=30.0,
                    requiredScore=comp.default_required_score,
                    gap=30.0 - comp.default_required_score,
                    confidence=85.0,
                    status="Critical Gap",
                    description=comp.description,
                    evidenceSources=[],
                    trend="stable",
                    lastAssessed="Pending Initial Assessment",
                    historicalScores=[{"date": "Baseline", "score": 30}],
                    recommendedCourseIds=[],
                )
            comp_responses.append(c_resp)

        # Recalculate User KPIs
        avg_score = sum(c.currentScore for c in comp_responses) / len(comp_responses) if comp_responses else user.overall_competency
        critical_count = sum(1 for c in comp_responses if c.status == "Critical Gap")

        return CompetencyTwinSummaryResponse(
            overallCompetency=round(avg_score, 1),
            roleReadiness=user.role_readiness,
            criticalGapsCount=critical_count,
            learningHours=user.learning_hours,
            assessmentAverage=user.assessment_average,
            competencies=comp_responses,
        )

    async def update_user_competency_from_assessment(
        self,
        user_id: str,
        target_competency_name: str,
        assessment_accuracy: float,
        assessment_title: str,
    ):
        all_comps = await self.comp_repo.get_all_competencies()
        target_comp = None
        for c in all_comps:
            if c.name.lower() in target_competency_name.lower() or target_competency_name.lower() in c.name.lower():
                target_comp = c
                break

        if not target_comp and all_comps:
            target_comp = all_comps[0]

        uc = await self.comp_repo.get_user_competency(user_id, target_comp.id)
        if not uc:
            uc = UserCompetency(
                user_id=user_id,
                competency_id=target_comp.id,
                current_level=CompetencyLevelEnum.L2,
                required_level=target_comp.default_required_level,
                current_score=50.0,
                required_score=target_comp.default_required_score,
                evidence_sources=[],
                historical_scores=[],
            )

        gain_points = 8.0 if assessment_accuracy >= 80 else 5.0 if assessment_accuracy >= 60 else 2.0
        new_score = min(100.0, uc.current_score + gain_points)

        # Level mapping threshold: L1 <40, L2 40-59, L3 60-79, L4 80-92, L5 93+
        if new_score >= 93:
            new_level = CompetencyLevelEnum.L5
        elif new_score >= 80:
            new_level = CompetencyLevelEnum.L4
        elif new_score >= 60:
            new_level = CompetencyLevelEnum.L3
        elif new_score >= 40:
            new_level = CompetencyLevelEnum.L2
        else:
            new_level = CompetencyLevelEnum.L1

        new_gap = new_score - uc.required_score
        new_status = "Target Met" if new_gap >= 0 else "Moderate Gap" if new_gap >= -10 else "Critical Gap"

        today_str = datetime.now().strftime("%d %b %Y")
        ev_sources = list(uc.evidence_sources or [])
        ev_sources.insert(0, {
            "type": "Assessment",
            "title": assessment_title,
            "date": today_str,
            "score": f"{int(assessment_accuracy)}%",
        })

        hist_scores = list(uc.historical_scores or [])
        hist_scores.append({"date": today_str, "score": int(new_score)})

        uc.current_score = new_score
        uc.current_level = new_level
        uc.gap = new_gap
        uc.status = new_status
        uc.trend = "increasing"
        uc.last_assessed = today_str
        uc.evidence_sources = ev_sources
        uc.historical_scores = hist_scores

        await self.comp_repo.save_user_competency(uc)

        # Update User aggregated KPIs
        user = await self.user_repo.get_by_id(user_id)
        if user:
            user.role_readiness = min(98.0, user.role_readiness + round(gain_points / 2, 1))
            self.db.add(user)

        return uc
