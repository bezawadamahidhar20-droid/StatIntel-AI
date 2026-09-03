from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.skill_gap import SkillGap
from app.models.competency import CompetencyLevelEnum
from app.repositories.competency_repository import CompetencyRepository
from app.repositories.recommendation_repository import SkillGapRepository
from app.schemas.skill_gap import SkillGapResponse, SkillGapSummaryResponse


class SkillGapService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.comp_repo = CompetencyRepository(db)
        self.gap_repo = SkillGapRepository(db)

    async def get_user_skill_gaps(self, user_id: str) -> List[SkillGapResponse]:
        gaps = await self.gap_repo.get_user_skill_gaps(user_id)
        if not gaps:
            # Auto-calculate initial gaps from user competencies if empty
            await self.recalculate_user_skill_gaps(user_id)
            gaps = await self.gap_repo.get_user_skill_gaps(user_id)

        return [
            SkillGapResponse(
                id=g.id,
                competencyId=g.competency_id,
                competencyName=g.competency_name,
                domain=g.domain,
                currentLevel=g.current_level,
                requiredLevel=g.required_level,
                currentScore=g.current_score,
                requiredScore=g.required_score,
                gapLevels=g.gap_levels,
                severity=g.severity,
                roleRelevance=g.role_relevance,
                priorityRank=g.priority_rank,
                estimatedTimeToBridge=g.estimated_time_to_bridge,
                recommendedCourseId=g.recommended_course_id,
                rationale=g.rationale,
            )
            for g in gaps
        ]

    async def get_user_skill_gaps_summary(self, user_id: str) -> SkillGapSummaryResponse:
        gaps = await self.get_user_skill_gaps(user_id)
        critical_count = sum(1 for g in gaps if g.severity == "Critical")
        medium_count = sum(1 for g in gaps if g.severity in ["High", "Medium"])
        low_count = sum(1 for g in gaps if g.severity == "Low")

        top_comp = gaps[0].competencyName if gaps else None

        return SkillGapSummaryResponse(
            totalGapsCount=len(gaps),
            criticalGapsCount=critical_count,
            mediumGapsCount=medium_count,
            lowGapsCount=low_count,
            topPriorityCompetency=top_comp,
            gaps=gaps,
        )

    async def recalculate_user_skill_gaps(self, user_id: str) -> List[SkillGap]:
        user_ucs = await self.comp_repo.get_user_competencies(user_id)
        all_comps = await self.comp_repo.get_all_competencies()
        comp_map = {c.id: c for c in all_comps}

        await self.gap_repo.delete_user_skill_gaps(user_id)

        new_gaps = []
        rank = 1

        for uc in user_ucs:
            comp = comp_map.get(uc.competency_id)
            if not comp:
                continue

            current_score = uc.current_score
            req_score = uc.required_score
            score_diff = req_score - current_score

            if score_diff <= 0:
                continue  # Target met, no gap

            # Level gap count
            lvl_order = {"L1": 1, "L2": 2, "L3": 3, "L4": 4, "L5": 5}
            c_lvl_val = lvl_order.get(uc.current_level.value if hasattr(uc.current_level, "value") else str(uc.current_level), 1)
            r_lvl_val = lvl_order.get(uc.required_level.value if hasattr(uc.required_level, "value") else str(uc.required_level), 3)
            gap_levels = max(0, r_lvl_val - c_lvl_val)

            if score_diff >= 20 or gap_levels >= 2:
                severity = "Critical"
                est_time = "12-16 hours"
            elif score_diff >= 5 or gap_levels == 1:
                severity = "Medium"
                est_time = "8-10 hours"
            else:
                severity = "Low"
                est_time = "4-6 hours"

            rec_course_id = uc.recommended_course_ids[0] if uc.recommended_course_ids else "crs-001"

            sg = SkillGap(
                user_id=user_id,
                competency_id=comp.id,
                competency_name=comp.name,
                domain=comp.domain.value if hasattr(comp.domain, "value") else str(comp.domain),
                current_level=uc.current_level.value if hasattr(uc.current_level, "value") else str(uc.current_level),
                required_level=uc.required_level.value if hasattr(uc.required_level, "value") else str(uc.required_level),
                current_score=current_score,
                required_score=req_score,
                gap_levels=gap_levels,
                severity=severity,
                role_relevance=95.0 if severity == "Critical" else 90.0,
                priority_rank=rank,
                estimated_time_to_bridge=est_time,
                recommended_course_id=rec_course_id,
                rationale=f"Automated intelligence gap detection: {comp.name} current score ({int(current_score)}%) is below required role benchmark ({int(req_score)}%).",
            )
            await self.gap_repo.save_skill_gap(sg)
            new_gaps.append(sg)
            rank += 1

        return new_gaps
