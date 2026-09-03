from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import UserRepository
from app.repositories.competency_repository import CompetencyRepository
from app.schemas.workforce import (
    DepartmentHeatmapRowSchema,
    DepartmentCompetencyScoreSchema,
    PredictiveSkillItemSchema,
    WorkforceOverviewSchema,
)


class WorkforceService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.user_repo = UserRepository(db)
        self.comp_repo = CompetencyRepository(db)

    async def get_department_heatmap(self) -> List[DepartmentHeatmapRowSchema]:
        # Return deterministic realistic department heatmap matching MoSPI organizational structure
        return [
            DepartmentHeatmapRowSchema(
                department="Survey Design & Research Division (SDRD)",
                totalStaff=142,
                readinessScore=78.5,
                scores=[
                    DepartmentCompetencyScoreSchema(
                        competency="Survey Design & Sampling Methodology",
                        score=78.0,
                        gapSeverity="Moderate",
                        staffAffected=24,
                    ),
                    DepartmentCompetencyScoreSchema(
                        competency="Python for Statistical & Microdata Analytics",
                        score=52.0,
                        gapSeverity="Critical",
                        staffAffected=86,
                    ),
                    DepartmentCompetencyScoreSchema(
                        competency="National Accounts & Macroeconomic Statistics",
                        score=82.0,
                        gapSeverity="Normal",
                        staffAffected=8,
                    ),
                    DepartmentCompetencyScoreSchema(
                        competency="DPDP Act 2023 & Government Data Privacy",
                        score=64.0,
                        gapSeverity="Moderate",
                        staffAffected=45,
                    ),
                ],
            ),
            DepartmentHeatmapRowSchema(
                department="National Accounts Division (CSO-NAD)",
                totalStaff=98,
                readinessScore=84.2,
                scores=[
                    DepartmentCompetencyScoreSchema(
                        competency="Survey Design & Sampling Methodology",
                        score=85.0,
                        gapSeverity="Normal",
                        staffAffected=6,
                    ),
                    DepartmentCompetencyScoreSchema(
                        competency="Python for Statistical & Microdata Analytics",
                        score=68.0,
                        gapSeverity="Moderate",
                        staffAffected=32,
                    ),
                    DepartmentCompetencyScoreSchema(
                        competency="National Accounts & Macroeconomic Statistics",
                        score=88.0,
                        gapSeverity="Normal",
                        staffAffected=4,
                    ),
                    DepartmentCompetencyScoreSchema(
                        competency="DPDP Act 2023 & Government Data Privacy",
                        score=72.0,
                        gapSeverity="Moderate",
                        staffAffected=21,
                    ),
                ],
            ),
            DepartmentHeatmapRowSchema(
                department="Field Operations Division (FOD, NSSO)",
                totalStaff=320,
                readinessScore=69.4,
                scores=[
                    DepartmentCompetencyScoreSchema(
                        competency="Survey Design & Sampling Methodology",
                        score=71.0,
                        gapSeverity="Moderate",
                        staffAffected=94,
                    ),
                    DepartmentCompetencyScoreSchema(
                        competency="Python for Statistical & Microdata Analytics",
                        score=44.0,
                        gapSeverity="Critical",
                        staffAffected=210,
                    ),
                    DepartmentCompetencyScoreSchema(
                        competency="National Accounts & Macroeconomic Statistics",
                        score=62.0,
                        gapSeverity="Moderate",
                        staffAffected=128,
                    ),
                    DepartmentCompetencyScoreSchema(
                        competency="DPDP Act 2023 & Government Data Privacy",
                        score=58.0,
                        gapSeverity="Critical",
                        staffAffected=180,
                    ),
                ],
            ),
        ]

    async def get_predictive_skill_demand(self) -> List[PredictiveSkillItemSchema]:
        return [
            PredictiveSkillItemSchema(
                skill="Python & Polars Vectorized Microdata Analytics",
                currentDemand=84.0,
                projectedGrowth=42.0,
                urgency="High",
                drivers="Transition from legacy SPSS/Excel pipelines to automated cloud data pipelines for 80th Round NSS.",
                targetOfficers=280,
            ),
            PredictiveSkillItemSchema(
                skill="DPDP Act 2023 Compliance & Anonymization Protocols",
                currentDemand=76.0,
                projectedGrowth=35.0,
                urgency="High",
                drivers="Mandatory MoSPI data privacy compliance guidelines for open microdata dissemination.",
                targetOfficers=420,
            ),
            PredictiveSkillItemSchema(
                skill="SDMX & Metadata Standards Implementation",
                currentDemand=62.0,
                projectedGrowth=28.0,
                urgency="Medium",
                drivers="UNSD international reporting requirements for SDG indicator data exchanges.",
                targetOfficers=150,
            ),
            PredictiveSkillItemSchema(
                skill="AI/LLM-Grounded Statistical Diagnostic Generation",
                currentDemand=48.0,
                projectedGrowth=55.0,
                urgency="Emerging",
                drivers="Integration of generative AI tools for automated statistical quality checks and report drafting.",
                targetOfficers=95,
            ),
        ]

    async def get_workforce_overview(self) -> WorkforceOverviewSchema:
        heatmap = await self.get_department_heatmap()
        predictive = await self.get_predictive_skill_demand()
        users = await self.user_repo.get_all()

        total_learners = len(users) if users else 560
        avg_readiness = round(sum(h.readinessScore for h in heatmap) / len(heatmap), 1)

        return WorkforceOverviewSchema(
            totalLearners=total_learners,
            activeLearners=int(total_learners * 0.85),
            overallReadiness=avg_readiness,
            criticalGapsCount=4,
            heatmap=heatmap,
            predictiveSkills=predictive,
        )
