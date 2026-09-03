from datetime import datetime
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.assessment import Assessment, Question, AssessmentAttempt
from app.repositories.assessment_repository import AssessmentRepository
from app.services.competency_service import CompetencyService
from app.services.skill_gap_service import SkillGapService
from app.schemas.assessment import AssessmentResponse, QuestionSchema, QuizResultResponse, AssessmentSubmitRequest


class AssessmentService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.asmt_repo = AssessmentRepository(db)
        self.comp_service = CompetencyService(db)
        self.gap_service = SkillGapService(db)

    async def get_all_assessments(self) -> List[AssessmentResponse]:
        asmts = await self.asmt_repo.get_all()
        return [self._map_assessment(a) for a in asmts]

    async def get_assessment_by_id(self, asmt_id: str) -> Optional[AssessmentResponse]:
        asmt = await self.asmt_repo.get_by_id(asmt_id)
        if not asmt:
            return None
        return self._map_assessment(asmt)

    async def submit_attempt(
        self,
        user_id: str,
        asmt_id: str,
        req: AssessmentSubmitRequest,
    ) -> QuizResultResponse:
        asmt = await self.asmt_repo.get_by_id(asmt_id)
        if not asmt:
            raise Exception("Assessment not found")

        correct_count = 0
        answer_details = []

        for idx, q in enumerate(asmt.questions):
            selected_idx = req.answers[idx] if idx < len(req.answers) else -1
            is_correct = selected_idx == q.correct_index
            if is_correct:
                correct_count += 1

            answer_details.append({
                "questionId": q.id,
                "selectedIndex": selected_idx,
                "correctIndex": q.correct_index,
                "isCorrect": is_correct,
            })

        total = len(asmt.questions) if asmt.questions else 1
        accuracy = round((correct_count / total) * 100, 1)

        # Execute closed loop: Update Competency Digital Twin
        updated_uc = await self.comp_service.update_user_competency_from_assessment(
            user_id=user_id,
            target_competency_name=asmt.target_competency,
            assessment_accuracy=accuracy,
            assessment_title=asmt.title,
        )

        # Execute closed loop: Recalculate Skill Gaps
        await self.gap_service.recalculate_user_skill_gaps(user_id)

        # Save attempt record
        attempt = AssessmentAttempt(
            user_id=user_id,
            assessment_id=asmt.id,
            score=correct_count,
            total_questions=total,
            accuracy=accuracy,
            time_spent_seconds=req.timeSpentSeconds,
            competency_before=updated_uc.current_score - (8.0 if accuracy >= 80 else 5.0 if accuracy >= 60 else 2.0),
            competency_after=updated_uc.current_score,
            competency_gain=8.0 if accuracy >= 80 else 5.0 if accuracy >= 60 else 2.0,
            user_answers=answer_details,
        )
        await self.asmt_repo.record_attempt(attempt)

        return QuizResultResponse(
            assessmentId=asmt.id,
            assessmentTitle=asmt.title,
            targetCompetency=asmt.target_competency,
            score=correct_count,
            total=total,
            accuracy=accuracy,
            timeSpentSeconds=req.timeSpentSeconds,
            competencyBefore=attempt.competency_before,
            competencyAfter=attempt.competency_after,
            competencyGain=attempt.competency_gain,
            answers=answer_details,
            timestamp=datetime.now().strftime("%H:%M"),
        )

    def _map_assessment(self, a: Assessment) -> AssessmentResponse:
        return AssessmentResponse(
            id=a.id,
            title=a.title,
            description=a.description,
            domain=a.domain,
            targetCompetency=a.target_competency,
            sourceDocName=a.source_doc_name,
            totalQuestions=a.total_questions,
            durationMinutes=a.duration_minutes,
            questions=[
                QuestionSchema(
                    id=q.id,
                    question=q.question_text,
                    options=q.options or [],
                    correctIndex=q.correct_index,
                    explanation=q.explanation,
                    difficulty=q.difficulty,
                    competency=q.competency,
                    sourceReference=q.source_reference,
                    approved=q.approved,
                )
                for q in a.questions
            ],
            difficulty=a.difficulty,
            createdBy=a.created_by,
        )
