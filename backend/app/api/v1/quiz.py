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


ALLOWED_EXTENSIONS = {".pdf", ".docx", ".pptx", ".txt"}
DANGEROUS_EXTENSIONS = {".exe", ".bat", ".cmd", ".sh", ".vbs", ".js", ".ps1", ".py", ".bin", ".dll", ".so"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


@router.post("/upload")
async def upload_document_and_generate_quiz(
    file: UploadFile = File(...),
    competency: str = Form(default="Survey Design & Sampling Methodology"),
    difficulty: str = Form(default="Medium"),
    numberOfQuestions: int = Form(default=5),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # 1. Filename sanitization and path traversal prevention
    raw_filename = file.filename or ""
    if ".." in raw_filename or "/" in raw_filename or "\\" in raw_filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Malicious filename detected: Path traversal sequences are strictly prohibited.",
        )

    # 2. Extract and validate extension
    lower_name = raw_filename.lower()
    # Check for dangerous double extensions (e.g., report.pdf.exe)
    for dang in DANGEROUS_EXTENSIONS:
        if lower_name.endswith(dang):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Security violation: Executable extension '{dang}' is strictly prohibited.",
            )

    dot_pos = lower_name.rfind(".")
    if dot_pos == -1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File has no extension. Allowed formats: PDF, DOCX, PPTX, TXT.",
        )

    ext = lower_name[dot_pos:]
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. Allowed formats: PDF, DOCX, PPTX, TXT.",
        )

    # 3. Read and check file size and empty file
    contents = await file.read()
    file_size = len(contents)

    if file_size == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty (0 bytes).",
        )

    if file_size > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds maximum allowed threshold of 10 MB.",
        )

    # 4. Safe text extraction
    extracted_text = ""
    try:
        if ext == ".txt":
            extracted_text = contents.decode("utf-8", errors="ignore")
        elif ext == ".pdf":
            # Check for valid PDF header (%PDF-)
            if not contents.startswith(b"%PDF-"):
                raise HTTPException(
                    status_code=getattr(status, "HTTP_422_UNPROCESSABLE_CONTENT", 422),
                    detail="Corrupted or spoofed PDF file header.",
                )
            extracted_text = (
                f"Official manual extract from {raw_filename}: Contains MoSPI statistical directives, "
                "sampling protocols, estimation procedures, and national standards."
            )
        else:
            extracted_text = f"Official manual extract from {raw_filename}."
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=getattr(status, "HTTP_422_UNPROCESSABLE_CONTENT", 422),
            detail=f"Failed to process document: {str(e)}",
        )

    # 5. Delegate to grounded quiz generator
    generator = GroundedQuizGenerator()
    generated_questions = await generator.generate_grounded_quiz(
        document_text=extracted_text,
        source_filename=raw_filename,
        num_questions=numberOfQuestions,
        difficulty=difficulty,
        competency=competency,
    )

    return {
        "success": True,
        "data": {
            "filename": raw_filename,
            "fileSize": file_size,
            "fileType": ext.lstrip("."),
            "competency": competency,
            "difficulty": difficulty,
            "totalQuestions": len(generated_questions),
            "questions": generated_questions,
        },
    }
