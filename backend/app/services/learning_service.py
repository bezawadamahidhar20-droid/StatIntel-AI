from typing import Dict, Any, List, Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from app.models.learning import (
    LearningModule,
    LearningTopic,
    LearningResource,
    TopicProgress,
    ResourceProgress,
    ModuleAssessment,
    TopicProgressStatusEnum,
)
from app.models.course import Course, Enrollment
from app.models.competency import UserCompetency, CompetencyLevelEnum
from app.models.user import User
from app.schemas.learning_schemas import (
    CourseCurriculumResponse,
    LearningModuleBase,
    LearningTopicBase,
    LearningResourceBase,
    TopicCompletionResponse,
    StudyNotesResponse,
    ModuleAssessmentResultResponse,
)
from app.core.logging import logger


class LearningService:
    @classmethod
    async def get_course_curriculum(
        cls, db: AsyncSession, course_id: str, user_id: str
    ) -> Optional[CourseCurriculumResponse]:
        """
        Retrieves full curriculum with nested modules, topics, resources, and user's completion progress.
        """
        # Fetch Course
        res = await db.execute(select(Course).where(Course.id == course_id))
        course = res.scalar_one_or_none()
        if not course:
            return None

        # Fetch Modules with topics and resources
        m_res = await db.execute(
            select(LearningModule)
            .where(LearningModule.course_id == course_id)
            .order_by(LearningModule.order_index)
        )
        modules = m_res.scalars().all()

        # Fetch User's Topic Progress records
        tp_res = await db.execute(
            select(TopicProgress).where(TopicProgress.user_id == user_id)
        )
        topic_progress_map = {tp.topic_id: tp for tp in tp_res.scalars().all()}

        # Fetch User's Resource Progress records
        rp_res = await db.execute(
            select(ResourceProgress).where(ResourceProgress.user_id == user_id)
        )
        resource_progress_map = {rp.resource_id: rp.is_completed for rp in rp_res.scalars().all()}

        total_topics_count = 0
        completed_topics_count = 0
        module_schemas: List[LearningModuleBase] = []

        for mod in modules:
            # Fetch Topics for this module
            t_res = await db.execute(
                select(LearningTopic)
                .where(LearningTopic.module_id == mod.id)
                .order_by(LearningTopic.order_index)
            )
            topics = t_res.scalars().all()

            mod_completed_topics = 0
            mod_topics_schemas: List[LearningTopicBase] = []

            for top in topics:
                total_topics_count += 1
                tp = topic_progress_map.get(top.id)
                is_topic_done = tp and tp.status == TopicProgressStatusEnum.COMPLETED
                if is_topic_done:
                    completed_topics_count += 1
                    mod_completed_topics += 1

                # Fetch Resources
                r_res = await db.execute(
                    select(LearningResource)
                    .where(LearningResource.topic_id == top.id)
                    .order_by(LearningResource.order_index)
                )
                resources = r_res.scalars().all()

                resource_schemas = [
                    LearningResourceBase(
                        id=r.id,
                        topic_id=r.topic_id,
                        title=r.title,
                        description=r.description or "",
                        url=r.url,
                        resource_type=r.resource_type,
                        provider=r.provider,
                        source_domain=r.source_domain,
                        source_class=r.source_class,
                        language=r.language,
                        difficulty=r.difficulty,
                        estimated_minutes=r.estimated_minutes,
                        is_free=r.is_free,
                        is_official=r.is_official,
                        download_url=r.download_url,
                        thumbnail_url=r.thumbnail_url,
                        published_date=r.published_date,
                        last_verified=r.last_verified,
                        verification_status=r.verification_status,
                        quality_score=r.quality_score,
                        order_index=r.order_index,
                        is_completed=resource_progress_map.get(r.id, False),
                    )
                    for r in resources
                ]

                mod_topics_schemas.append(
                    LearningTopicBase(
                        id=top.id,
                        module_id=top.module_id,
                        topic_number=top.topic_number,
                        title=top.title,
                        description=top.description or "",
                        estimated_minutes=top.estimated_minutes,
                        difficulty=top.difficulty,
                        competency_id=top.competency_id,
                        skill_level=top.skill_level,
                        prerequisites=top.prerequisites or [],
                        learning_objectives=top.learning_objectives or [],
                        exercises=top.exercises or [],
                        order_index=top.order_index,
                        status=tp.status if tp else TopicProgressStatusEnum.NOT_STARTED,
                        completed_at=tp.completed_at if tp else None,
                        time_spent_seconds=tp.time_spent_seconds if tp else 0,
                        resources=resource_schemas,
                    )
                )

            mod_total = len(topics)
            mod_pct = round((mod_completed_topics / mod_total) * 100, 1) if mod_total > 0 else 0.0

            module_schemas.append(
                LearningModuleBase(
                    id=mod.id,
                    course_id=mod.course_id,
                    module_number=mod.module_number,
                    title=mod.title,
                    description=mod.description or "",
                    duration=mod.duration,
                    order_index=mod.order_index,
                    completed_topics_count=mod_completed_topics,
                    total_topics_count=mod_total,
                    completion_percentage=mod_pct,
                    topics=mod_topics_schemas,
                )
            )

        overall_pct = (
            round((completed_topics_count / total_topics_count) * 100, 1)
            if total_topics_count > 0
            else course.progress
        )

        return CourseCurriculumResponse(
            course_id=course.id,
            course_title=course.title,
            provider=course.provider,
            domain=course.domain,
            duration=course.duration,
            difficulty=course.difficulty,
            language=course.language,
            role_relevance=96.0,
            skill_gap_relevance="Critical Priority",
            current_proficiency="L2 (48%)",
            target_proficiency="L4 (75%)",
            completion_percentage=overall_pct,
            total_modules_count=len(modules),
            total_topics_count=total_topics_count,
            completed_topics_count=completed_topics_count,
            modules=module_schemas,
        )

    @classmethod
    async def mark_topic_complete(
        cls, db: AsyncSession, topic_id: str, user_id: str, time_spent_seconds: int = 300
    ) -> TopicCompletionResponse:
        """
        Persists topic completion, recalculates module & course progress, and updates Digital Twin.
        """
        # Fetch Topic and Module
        top_res = await db.execute(select(LearningTopic).where(LearningTopic.id == topic_id))
        topic = top_res.scalar_one_or_none()
        if not topic:
            raise ValueError(f"Topic {topic_id} not found")

        mod_res = await db.execute(select(LearningModule).where(LearningModule.id == topic.module_id))
        module = mod_res.scalar_one_or_none()
        if not module:
            raise ValueError(f"Module {topic.module_id} not found")

        # Check or Create TopicProgress
        tp_res = await db.execute(
            select(TopicProgress).where(
                and_(TopicProgress.user_id == user_id, TopicProgress.topic_id == topic_id)
            )
        )
        tp = tp_res.scalar_one_or_none()
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        if tp:
            tp.status = TopicProgressStatusEnum.COMPLETED
            tp.completed_at = now_str
            tp.time_spent_seconds += time_spent_seconds
        else:
            tp = TopicProgress(
                user_id=user_id,
                topic_id=topic_id,
                status=TopicProgressStatusEnum.COMPLETED,
                completed_at=now_str,
                time_spent_seconds=time_spent_seconds,
            )
            db.add(tp)

        await db.flush()

        # Recalculate Module Progress
        mod_topics_res = await db.execute(
            select(LearningTopic.id).where(LearningTopic.module_id == module.id)
        )
        mod_topic_ids = [r[0] for r in mod_topics_res.all()]
        mod_total = len(mod_topic_ids)

        mod_done_res = await db.execute(
            select(func.count(TopicProgress.id)).where(
                and_(
                    TopicProgress.user_id == user_id,
                    TopicProgress.topic_id.in_(mod_topic_ids),
                    TopicProgress.status == TopicProgressStatusEnum.COMPLETED,
                )
            )
        )
        mod_done = mod_done_res.scalar() or 0
        mod_pct = round((mod_done / mod_total) * 100, 1) if mod_total > 0 else 100.0

        # Recalculate Course Progress
        course_topics_res = await db.execute(
            select(LearningTopic.id)
            .join(LearningModule, LearningTopic.module_id == LearningModule.id)
            .where(LearningModule.course_id == module.course_id)
        )
        course_topic_ids = [r[0] for r in course_topics_res.all()]
        course_total = len(course_topic_ids)

        course_done_res = await db.execute(
            select(func.count(TopicProgress.id)).where(
                and_(
                    TopicProgress.user_id == user_id,
                    TopicProgress.topic_id.in_(course_topic_ids),
                    TopicProgress.status == TopicProgressStatusEnum.COMPLETED,
                )
            )
        )
        course_done = course_done_res.scalar() or 0
        course_pct = round((course_done / course_total) * 100, 1) if course_total > 0 else 100.0

        # Update Course Enrollment progress if exists
        enr_res = await db.execute(
            select(Enrollment).where(
                and_(Enrollment.user_id == user_id, Enrollment.course_id == module.course_id)
            )
        )
        enrollment = enr_res.scalar_one_or_none()
        if enrollment:
            enrollment.progress = course_pct
            if course_pct >= 100.0:
                enrollment.status = "Completed"
                enrollment.completed_at = now_str

        # Digital Twin Closed-Loop Update
        digital_twin_updated = False
        competency_gain = 2.0
        new_score = None
        new_readiness = None

        if topic.competency_id:
            uc_res = await db.execute(
                select(UserCompetency).where(
                    and_(
                        UserCompetency.user_id == user_id,
                        UserCompetency.competency_id == topic.competency_id,
                    )
                )
            )
            uc = uc_res.scalar_one_or_none()
            if uc:
                uc.current_score = min(100.0, uc.current_score + competency_gain)
                uc.gap = uc.current_score - uc.required_score
                if uc.current_score >= 80.0:
                    uc.current_level = CompetencyLevelEnum.L4
                elif uc.current_score >= 60.0:
                    uc.current_level = CompetencyLevelEnum.L3
                new_score = uc.current_score
                digital_twin_updated = True

        # Update User role readiness
        u_res = await db.execute(select(User).where(User.id == user_id))
        user = u_res.scalar_one_or_none()
        if user:
            user.learning_hours += round(time_spent_seconds / 3600.0, 2)
            user.role_readiness = min(98.0, user.role_readiness + 0.8)
            new_readiness = user.role_readiness

        await db.commit()

        return TopicCompletionResponse(
            success=True,
            topic_id=topic_id,
            status=TopicProgressStatusEnum.COMPLETED.value,
            completed_at=now_str,
            module_id=module.id,
            module_completion_percentage=mod_pct,
            course_id=module.course_id,
            course_completion_percentage=course_pct,
            digital_twin_updated=digital_twin_updated,
            competency_gain=competency_gain if digital_twin_updated else None,
            new_competency_score=new_score,
            new_role_readiness=new_readiness,
        )

    @classmethod
    async def update_resource_progress(
        cls, db: AsyncSession, resource_id: str, user_id: str, is_completed: bool = True
    ) -> bool:
        """
        Updates resource interaction record.
        """
        rp_res = await db.execute(
            select(ResourceProgress).where(
                and_(ResourceProgress.user_id == user_id, ResourceProgress.resource_id == resource_id)
            )
        )
        rp = rp_res.scalar_one_or_none()
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        if rp:
            rp.is_completed = is_completed
            rp.last_accessed_at = now_str
        else:
            rp = ResourceProgress(
                user_id=user_id,
                resource_id=resource_id,
                is_completed=is_completed,
                last_accessed_at=now_str,
            )
            db.add(rp)

        await db.commit()
        return True

    @classmethod
    async def generate_study_notes(
        cls, db: AsyncSession, topic_id: str
    ) -> StudyNotesResponse:
        """
        Generates structured revision study notes with MoSPI relevance and verified source citations.
        """
        t_res = await db.execute(select(LearningTopic).where(LearningTopic.id == topic_id))
        topic = t_res.scalar_one_or_none()
        if not topic:
            raise ValueError(f"Topic {topic_id} not found")

        # Fetch resources for citation
        r_res = await db.execute(
            select(LearningResource).where(LearningResource.topic_id == topic_id)
        )
        resources = r_res.scalars().all()
        citations = [
            {"provider": r.provider, "title": r.title, "url": r.url, "type": r.resource_type}
            for r in resources
        ]

        title = topic.title
        return StudyNotesResponse(
            topic_id=topic.id,
            topic_title=title,
            course_title="Python Foundations for Statistical Analysis & NSSO Microdata",
            competency_name="Python for Statistical & Microdata Analytics",
            generated_date="04 Sep 2026",
            overview=f"Comprehensive technical revision notes for '{title}' formatted for official statistical survey processing and national accounts compilation.",
            key_concepts=[
                f"Core structural concepts of {title} in official microdata extraction workflows.",
                "Vectorized transformations avoiding slow Python for-loops across multi-million record surveys.",
                "Application of survey multipliers (weighting factors) to ensure unbiased population estimates.",
                "Handling sub-sample pooling and variance estimation compliant with NSSO standard manuals.",
            ],
            definitions=[
                {"term": "DataFrame", "definition": "A two-dimensional, size-mutable, tabular data structure with labeled axes (rows and columns)."},
                {"term": "Survey Multiplier", "definition": "The inverse of the probability of selection for a sample unit, used to inflate sample data to population aggregates."},
                {"term": "Stratum Weight", "definition": "Weight assigned to sample units within a specific demographic or geographic stratum."},
            ],
            important_formulas=[
                {
                    "name": "Weighted Population Mean Estimate",
                    "formula": r"\hat{\bar{Y}} = \frac{\sum_{i=1}^n w_i \cdot y_i}{\sum_{i=1}^n w_i}",
                    "description": "Calculates population parameter mean where w_i represents the NSSO multiplier and y_i is the observation value.",
                },
                {
                    "name": "Design Effect (DEFF)",
                    "formula": r"DEFF = \frac{Var_{complex}(\hat{\theta})}{Var_{SRS}(\hat{\theta})}",
                    "description": "Quantifies variance inflation caused by complex multistage cluster sampling relative to simple random sampling.",
                },
            ],
            government_statistics_relevance=(
                "Essential for parsing Periodic Labour Force Survey (PLFS) and Annual Survey of Industries (ASI) "
                "data files to compute national employment rates, Gross Value Added (GVA), and Consumer Price Index (CPI) weights."
            ),
            practical_example={
                "code": (
                    "# MoSPI NSSO Microdata Extraction Example\n"
                    "import pandas as pd\n\n"
                    "# 1. Load microdata with fixed-width layout\n"
                    "df = pd.read_csv('plfs_round_raw.csv')\n\n"
                    "# 2. Calculate Weighted Consumption Expenditure\n"
                    "weighted_sum = (df['expenditure'] * df['multiplier']).sum()\n"
                    "total_weight = df['multiplier'].sum()\n"
                    "weighted_mean_exp = weighted_sum / total_weight\n\n"
                    "print(f'Estimated National Mean Expenditure: ₹{weighted_mean_exp:.2f}')"
                ),
                "explanation": "Calculates official weighted average expenditure by weighting individual household surveys by their respective NSS sample multipliers.",
            },
            common_mistakes=[
                "Calculating unweighted means (.mean()) on sample microdata instead of taking the dot-product with sampling weights.",
                "Treating missing survey codes (e.g. 99, 999) as valid numerical observations without proper imputation.",
                "Ignoring sub-sample 1 and sub-sample 2 weight division factors in NSSO raw text records.",
            ],
            interview_questions=[
                {
                    "question": "Why must survey multipliers be applied when computing national statistics from NSSO microdata?",
                    "answer": "Because NSSO surveys use stratified multistage sampling where units have unequal selection probabilities; multipliers correct for this to yield unbiased population parameters.",
                },
                {
                    "question": "What is the memory and performance advantage of Polars over Pandas for NSS microdata?",
                    "answer": "Polars is written in Rust with Apache Arrow memory layout, lazy evaluation query optimization, and multi-core parallelism, handling 10GB+ survey files in seconds.",
                },
            ],
            self_test_questions=[
                {
                    "id": "st-1",
                    "question": "Which method in Pandas is used to compute group-wise weighted statistics across survey strata?",
                    "options": ["df.groupby('stratum').apply()", "df.pivot()", "df.describe()", "df.melt()"],
                    "correctIndex": 0,
                    "explanation": "groupby().apply() allows custom weighted aggregations using the survey multiplier column across strata.",
                },
                {
                    "id": "st-2",
                    "question": "What is the primary indicator of missing data in raw ASCII records of government surveys?",
                    "options": ["Special placeholder codes like 99, 999, or blanks", "Null pointer exceptions", "NaN strings only", "Empty binary bytes"],
                    "correctIndex": 0,
                    "explanation": "Historical NSSO and government datasets represent missing or not-applicable responses using numerical flags such as 99 or 9999.",
                },
            ],
            verified_sources=citations,
            attribution="Generated by StatIntel AI. Based on verified official publications and documentation.",
        )

    @classmethod
    async def submit_module_assessment(
        cls, db: AsyncSession, module_id: str, user_id: str, user_answers: List[int], time_spent_seconds: int = 180
    ) -> ModuleAssessmentResultResponse:
        """
        Processes module mini-assessment and upgrades Competency Digital Twin upon passing.
        """
        m_res = await db.execute(select(LearningModule).where(LearningModule.id == module_id))
        module = m_res.scalar_one_or_none()
        if not module:
            raise ValueError(f"Module {module_id} not found")

        # 5 Grounded Diagnostic Questions
        questions = [
            {
                "question": "What is the correct way to compute population aggregates from NSSO survey samples in Pandas?",
                "correctIndex": 1,
                "options": [
                    "Sum the raw column values directly",
                    "Multiply each observation by its survey multiplier and sum the product",
                    "Calculate the median of the sample",
                    "Normalize values between 0 and 1",
                ],
                "explanation": "Population aggregates require weighting each sample observation by its assigned sampling multiplier.",
            },
            {
                "question": "Which data structure in Polars provides lazy execution and query optimization for large survey datasets?",
                "correctIndex": 0,
                "options": ["LazyFrame", "Series", "DataFrame", "ArrowTable"],
                "explanation": "LazyFrame in Polars defers evaluation until collect() is called, allowing the query planner to optimize execution.",
            },
            {
                "question": "Under NQAF standards, how should non-sampling errors and extreme outliers be validated?",
                "correctIndex": 2,
                "options": [
                    "Silently delete all extreme rows",
                    "Replace all values with 0",
                    "Use robust statistical distance measures (e.g. Mahalanobis/IQR) with audit logging",
                    "Ignore them",
                ],
                "explanation": "Data quality frameworks require statistical outlier identification with transparent audit trails.",
            },
            {
                "question": "What is the purpose of the 'svydesign' or weighted survey specifications in official analytics?",
                "correctIndex": 3,
                "options": [
                    "Generating UI layouts",
                    "Compiling database schemas",
                    "Exporting CSV headers",
                    "Accounting for clustering, stratification, and unequal weights in variance estimation",
                ],
                "explanation": "Survey designs incorporate complex survey design features (PSUs, strata, weights) for correct standard errors.",
            },
            {
                "question": "Under the DPDP Act 2023, what step is mandatory before publishing public microdata?",
                "correctIndex": 1,
                "options": [
                    "Adding watermarks",
                    "Anonymization and de-identification of Personally Identifiable Information (PII)",
                    "Translating to Hindi",
                    "Converting CSV to Excel",
                ],
                "explanation": "Section 8 of DPDP Act mandates rigorous de-identification to prevent re-identification of survey respondents.",
            },
        ]

        total = len(questions)
        correct_count = 0
        answers_feedback = []

        for idx, q in enumerate(questions):
            selected = user_answers[idx] if idx < len(user_answers) else -1
            is_correct = selected == q["correctIndex"]
            if is_correct:
                correct_count += 1
            answers_feedback.append({
                "question": q["question"],
                "selectedIndex": selected,
                "correctIndex": q["correctIndex"],
                "isCorrect": is_correct,
                "explanation": q["explanation"],
            })

        accuracy = round((correct_count / total) * 100, 1)
        passed = accuracy >= 60.0
        now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Save Assessment Record
        ma_res = await db.execute(
            select(ModuleAssessment).where(
                and_(ModuleAssessment.user_id == user_id, ModuleAssessment.module_id == module_id)
            )
        )
        ma = ma_res.scalar_one_or_none()
        if ma:
            ma.score = correct_count
            ma.accuracy = accuracy
            ma.attempts_count += 1
            ma.answers = answers_feedback
            ma.completed_at = now_str
        else:
            ma = ModuleAssessment(
                user_id=user_id,
                module_id=module_id,
                score=correct_count,
                total=total,
                accuracy=accuracy,
                attempts_count=1,
                answers=answers_feedback,
                completed_at=now_str,
            )
            db.add(ma)

        # Digital Twin Closed-Loop Upgrade
        competency_boost = 6.0 if passed else 2.0
        new_score = 54.0
        new_readiness = 66.0

        u_res = await db.execute(select(User).where(User.id == user_id))
        user = u_res.scalar_one_or_none()
        if user:
            user.assessment_average = round((user.assessment_average + accuracy) / 2.0, 1)
            user.role_readiness = min(98.0, user.role_readiness + (2.5 if passed else 0.5))
            new_readiness = user.role_readiness

        # Boost Technical Competency
        uc_res = await db.execute(
            select(UserCompetency).where(
                and_(UserCompetency.user_id == user_id, UserCompetency.competency_id == "comp-tech-1")
            )
        )
        uc = uc_res.scalar_one_or_none()
        if uc:
            uc.current_score = min(100.0, uc.current_score + competency_boost)
            uc.gap = uc.current_score - uc.required_score
            if uc.current_score >= 80.0:
                uc.current_level = CompetencyLevelEnum.L4
            elif uc.current_score >= 60.0:
                uc.current_level = CompetencyLevelEnum.L3
            new_score = uc.current_score

        await db.commit()

        return ModuleAssessmentResultResponse(
            module_id=module_id,
            score=correct_count,
            total=total,
            accuracy=accuracy,
            passed=passed,
            competency_boost=competency_boost,
            new_competency_score=new_score,
            new_role_readiness=new_readiness,
            completed_at=now_str,
            answers_feedback=answers_feedback,
        )


learning_service = LearningService()
