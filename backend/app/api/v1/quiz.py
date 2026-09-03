from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.models.assessment import Assessment, Question
from app.repositories.assessment_repository import AssessmentRepository
from app.ai.quiz_generator import GroundedQuizGenerator

router = APIRouter(prefix="/quiz", tags=["AI Quiz Generator"])


class QuizGenerateRequest(BaseModel):
    documentName: Optional[str] = "MoSPI_Official_Statistics_Manual.pdf"
    documentText: Optional[str] = None
    numberOfQuestions: int = 5
    difficulty: str = "Medium"
    competency: str = "Survey Design & Sampling Methodology"


@router.post("/generate")
async def generate_quiz(
    req: QuizGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    doc_text = req.documentText or (
        "According to NSSO 78th Round Household Consumer Expenditure Survey manual, Primary Sampling Units (PSUs) "
        "in rural sector are Census Villages selected via Probability Proportional to Size (PPS). In urban sector, "
        "Urban Frame Survey (UFS) blocks constitute PSUs. Multipliers inflate sample estimates to domain totals."
    )

    generator = GroundedQuizGenerator()
    generated_q_list = await generator.generate_grounded_quiz(
        document_text=doc_text,
        source_filename=req.documentName or "Uploaded_Manual.pdf",
        num_questions=req.numberOfQuestions,
        difficulty=req.difficulty,
        competency=req.competency,
    )

    asmt_repo = AssessmentRepository(db)
    new_asmt = Assessment(
        title=f"AI Diagnostic: {req.competency}",
        description=f"AI-generated diagnostic assessment grounded in {req.documentName}.",
        domain="Statistical" if "Sampling" in req.competency else "Technical",
        target_competency=req.competency,
        source_doc_name=req.documentName,
        total_questions=len(generated_q_list),
        duration_minutes=15,
        difficulty=req.difficulty,
        created_by="AI Generator",
    )
    await asmt_repo.create_assessment(new_asmt)

    db_questions = []
    for q_dict in generated_q_list:
        q = Question(
            assessment_id=new_asmt.id,
            question_text=q_dict.get("question", "What is the primary sampling unit?"),
            options=q_dict.get("options", ["Option A", "Option B", "Option C", "Option D"]),
            correct_index=q_dict.get("correctIndex", 0),
            explanation=q_dict.get("explanation", "Grounded in official manual reference."),
            difficulty=q_dict.get("difficulty", req.difficulty),
            competency=q_dict.get("competency", req.competency),
            source_reference=q_dict.get("sourceReference", f"Page 12 — {req.documentName}"),
            approved=True,
        )
        db.add(q)
        db_questions.append(q)

    await db.commit()
    await db.refresh(new_asmt)

    return {
        "success": True,
        "data": {
            "id": new_asmt.id,
            "title": new_asmt.title,
            "description": new_asmt.description,
            "domain": new_asmt.domain,
            "targetCompetency": new_asmt.target_competency,
            "sourceDocName": new_asmt.source_doc_name,
            "totalQuestions": new_asmt.total_questions,
            "durationMinutes": new_asmt.duration_minutes,
            "difficulty": new_asmt.difficulty,
            "createdBy": new_asmt.created_by,
            "questions": [
                {
                    "id": q.id,
                    "question": q.question_text,
                    "options": q.options,
                    "correctIndex": q.correct_index,
                    "explanation": q.explanation,
                    "difficulty": q.difficulty,
                    "competency": q.competency,
                    "sourceReference": q.source_reference,
                    "approved": q.approved,
                }
                for q in db_questions
            ],
        },
    }
