import asyncio
import os
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal, async_engine, Base
from app.core.security import get_password_hash
from app.models.user import User, Department, UserRole
from app.models.competency import Competency, UserCompetency, CompetencyDomainEnum, CompetencyLevelEnum
from app.models.assessment import Assessment, Question
from app.models.course import Course
from app.models.skill_gap import SkillGap
from app.models.certificate import Certificate
from app.models.notification import Notification


async def seed_database():
    print("Starting database seeding...")
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # 1. Departments
        sdrd = Department(
            id="dept-01",
            name="Survey Design & Research Division (SDRD), MoSPI",
            code="SDRD",
            description="Division responsible for statistical survey methodology and sampling designs.",
        )
        nssta = Department(
            id="dept-02",
            name="National Statistical Systems Training Academy (NSSTA)",
            code="NSSTA",
            description="Apex Academy for human resource development in official statistics.",
        )
        cad = Department(
            id="dept-03",
            name="Central Statistics Office — National Accounts Division (CSO-NAD)",
            code="NAD",
            description="Division responsible for compilation of National Accounts and GDP statistics.",
        )
        session.add_all([sdrd, nssta, cad])
        await session.flush()

        # 2. Users (Learner & Admin)
        hashed_pwd = get_password_hash("password123")
        learner = User(
            id="usr-10492",
            employee_id="MOSPI-ISS-2019-042",
            email="rajesh.sharma@mospi.gov.in",
            hashed_password=hashed_pwd,
            full_name="Rajesh Sharma",
            designation="Senior Statistical Officer (SSO)",
            cadre="Indian Statistical Service (ISS) - Cadre Reg #9842",
            avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
            role=UserRole.LEARNER,
            department_id=sdrd.id,
            qualification="M.Sc Statistics (ISD Kolkata)",
            years_of_experience=7,
            location="New Delhi, India",
            overall_competency=74.0,
            role_readiness=76.0,
            critical_gaps_count=4,
            learning_hours=38.0,
            assessment_average=82.0,
        )

        admin = User(
            id="usr-admin-01",
            employee_id="NSSTA-DIR-2014-001",
            email="vandana.sengupta@gov.in",
            hashed_password=hashed_pwd,
            full_name="Dr. Vandana Sengupta",
            designation="Director General & Head of Training",
            cadre="Senior Administrative Grade (SAG), ISS",
            avatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
            role=UserRole.ADMIN,
            department_id=nssta.id,
            qualification="Ph.D Econometrics",
            years_of_experience=22,
            location="Greater Noida, India",
            overall_competency=92.0,
            role_readiness=95.0,
            critical_gaps_count=0,
            learning_hours=142.0,
            assessment_average=94.0,
        )
        session.add_all([learner, admin])
        await session.flush()

        # 3. Competencies (4 Domains)
        comp_stat1 = Competency(
            id="comp-stat-1",
            name="Survey Design & Sampling Methodology",
            domain=CompetencyDomainEnum.STATISTICAL,
            description="Mastery of multistage stratified sampling, primary sampling units (PSU) selection, probability proportional to size (PPS), and sampling weight calibration according to NSSO standard operating manuals.",
            default_required_level=CompetencyLevelEnum.L4,
            default_required_score=82.0,
        )
        comp_stat2 = Competency(
            id="comp-stat-2",
            name="National Accounts & Macroeconomic Statistics",
            domain=CompetencyDomainEnum.STATISTICAL,
            description="Compilation of Gross Value Added (GVA), Gross Domestic Product (GDP) base revisions, supply-use tables (SUT), and System of National Accounts (SNA 2008) principles.",
            default_required_level=CompetencyLevelEnum.L3,
            default_required_score=85.0,
        )
        comp_tech1 = Competency(
            id="comp-tech-1",
            name="Python for Statistical & Microdata Analytics",
            domain=CompetencyDomainEnum.TECHNICAL,
            description="Data wrangling with Pandas, NumPy, and Polars on large-scale NSSO/PLFS microdata files, vectorized statistical operations, survey weighting calculations, and pipeline automation.",
            default_required_level=CompetencyLevelEnum.L4,
            default_required_score=75.0,
        )
        comp_dig1 = Competency(
            id="comp-dig-1",
            name="DPDP Act 2023 & Government Data Privacy Frameworks",
            domain=CompetencyDomainEnum.DIGITAL_GOVERNANCE,
            description="Implementation of Digital Personal Data Protection Act compliance, anonymization techniques for official microdata release, and secure government cloud deployment protocols.",
            default_required_level=CompetencyLevelEnum.L4,
            default_required_score=80.0,
        )
        comp_beh1 = Competency(
            id="comp-beh-1",
            name="Evidence-Based Policy Communication & Technical Leadership",
            domain=CompetencyDomainEnum.BEHAVIOURAL,
            description="Translating complex statistical findings, confidence intervals, and policy trade-offs into executive briefings for Union Secretaries and Inter-Ministerial Committees.",
            default_required_level=CompetencyLevelEnum.L4,
            default_required_score=80.0,
        )
        session.add_all([comp_stat1, comp_stat2, comp_tech1, comp_dig1, comp_beh1])
        await session.flush()

        # 4. User Competency Digital Twin records for Learner
        uc_stat1 = UserCompetency(
            id="uc-01",
            user_id=learner.id,
            competency_id=comp_stat1.id,
            current_level=CompetencyLevelEnum.L3,
            required_level=CompetencyLevelEnum.L4,
            current_score=78.0,
            required_score=82.0,
            gap=-4.0,
            confidence=96.0,
            status="Moderate Gap",
            trend="increasing",
            last_assessed="14 Jun 2026",
            evidence_sources=[
                {"type": "Assessment", "title": "NSSTA Advanced Sampling Diagnostic", "date": "2026-06-14", "score": "82%"},
                {"type": "Training", "title": "NSSO 79th Round Survey Design Workshop", "date": "2026-03-10"},
            ],
            historical_scores=[
                {"date": "Jan 2026", "score": 68},
                {"date": "Apr 2026", "score": 72},
                {"date": "Jun 2026", "score": 78},
            ],
            recommended_course_ids=["crs-002"],
        )
        uc_tech1 = UserCompetency(
            id="uc-02",
            user_id=learner.id,
            competency_id=comp_tech1.id,
            current_level=CompetencyLevelEnum.L2,
            required_level=CompetencyLevelEnum.L4,
            current_score=48.0,
            required_score=75.0,
            gap=-27.0,
            confidence=98.0,
            status="Critical Gap",
            trend="increasing",
            last_assessed="10 May 2026",
            evidence_sources=[
                {"type": "Assessment", "title": "iGOT Python Foundation Benchmark", "date": "2026-05-10", "score": "52%"},
            ],
            historical_scores=[
                {"date": "Jan 2026", "score": 32},
                {"date": "Mar 2026", "score": 40},
                {"date": "May 2026", "score": 48},
            ],
            recommended_course_ids=["crs-001"],
        )
        session.add_all([uc_stat1, uc_tech1])

        # 5. Courses
        crs1 = Course(
            id="crs-001",
            title="Python Foundations for Official Statistics & Microdata Processing",
            provider="iGOT Karmayogi",
            domain="Technical",
            duration="12 hours",
            duration_hours=12.0,
            difficulty="Beginner",
            language="English",
            rating=4.8,
            review_count=342,
            match_score=96.0,
            status="In Progress",
            progress=45.0,
            description="Comprehensive hands-on course covering Python data wrangling specifically designed for Indian Statistical Service (ISS) and Subordinate Statistical Service (SSS) officers working with NSSO, PLFS, and ASI microdata.",
            competencies_covered=["Python for Statistical & Microdata Analytics", "Data Wrangling"],
            prerequisites=["Basic understanding of statistical tables and spreadsheet software."],
            outcomes=["Load and parse multi-GB fixed-width microdata files from NSSO rounds.", "Compute survey weights and apply multipliers correctly.", "Export publication-ready tables in Excel and PDF formats."],
            modules=[
                {"id": "m1", "title": "Module 1: Introduction to Python for Statisticians", "duration": "2 hours", "completed": True},
                {"id": "m2", "title": "Module 2: Pandas & NumPy for Microdata Operations", "duration": "4 hours", "completed": True},
                {"id": "m3", "title": "Module 3: Calculating Survey Weights & Sampling Variances", "duration": "3 hours", "completed": False},
                {"id": "m4", "title": "Module 4: Automating Official Report Generation", "duration": "3 hours", "completed": False},
            ],
            why_recommended={
                "summary": "Directly targets your critical gap in Python data analytics (-27 pt gap). Required for upcoming SDRD microdata processing pipeline.",
                "gapAddressed": "Python for Statistical & Microdata Analytics (Level 2 → Level 4)",
                "expectedImprovement": "+22% competency score increase, bridging critical gap.",
                "factors": [
                  {"label": "Role Match (SSO SDRD)", "percentage": 30},
                  {"label": "Skill-Gap Severity", "percentage": 25},
                  {"label": "Department Priority", "percentage": 20},
                  {"label": "Semantic Similarity", "percentage": 10},
                  {"label": "Learning History", "percentage": 5},
                  {"label": "Career Alignment", "percentage": 5},
                  {"label": "Emerging Tech", "percentage": 5},
                ]
            }
        )
        crs2 = Course(
            id="crs-002",
            title="Advanced Multistage Stratified Sampling & Weight Calibration",
            provider="NSSTA TPAC",
            domain="Statistical",
            duration="16 hours",
            duration_hours=16.0,
            difficulty="Advanced",
            language="English",
            rating=4.9,
            review_count=184,
            match_score=94.0,
            status="Recommended",
            progress=0.0,
            description="Deep dive into multistage sampling design, primary sampling unit (PSU) selection using probability proportional to size (PPS), non-response adjustment, and post-stratification weight calibration.",
            competencies_covered=["Survey Design & Sampling Methodology", "Statistical Quality Frameworks"],
            prerequisites=["Basic sampling theory, undergraduate probability."],
            outcomes=["Design 2-stage sampling frames for rural/urban sectors.", "Calculate design effects (DEFF) and standard error bounds."],
            modules=[
                {"id": "m1", "title": "Module 1: Multistage Sampling Paradigms", "duration": "4 hours", "completed": False},
                {"id": "m2", "title": "Module 2: Weight Calibration Techniques", "duration": "4 hours", "completed": False},
            ],
            why_recommended={
                "summary": "Bridges moderate gap in Survey Design & Sampling (-4 pt gap) to meet ISS Senior Officer benchmark.",
                "gapAddressed": "Survey Design & Sampling Methodology (Level 3 → Level 4)",
                "expectedImprovement": "+8% competency gain, elevating score to 86%.",
                "factors": [
                  {"label": "Role Match (SSO SDRD)", "percentage": 30},
                  {"label": "Skill-Gap Severity", "percentage": 25},
                  {"label": "Department Priority", "percentage": 20},
                  {"label": "Semantic Similarity", "percentage": 10},
                  {"label": "Learning History", "percentage": 5},
                  {"label": "Career Alignment", "percentage": 5},
                  {"label": "Emerging Tech", "percentage": 5},
                ]
            }
        )
        session.add_all([crs1, crs2])

        # 6. Skill Gaps
        sg1 = SkillGap(
            id="gap-01",
            user_id=learner.id,
            competency_id=comp_tech1.id,
            competency_name=comp_tech1.name,
            domain="Technical",
            current_level="L2",
            required_level="L4",
            current_score=48.0,
            required_score=75.0,
            gap_levels=2,
            severity="Critical",
            role_relevance=95.0,
            priority_rank=1,
            estimated_time_to_bridge="12-16 hours",
            recommended_course_id="crs-001",
            rationale="SSO designation in SDRD requires independent microdata extraction using Python instead of legacy manual spreadsheets.",
        )
        sg2 = SkillGap(
            id="gap-02",
            user_id=learner.id,
            competency_id=comp_stat1.id,
            competency_name=comp_stat1.name,
            domain="Statistical",
            current_level="L3",
            required_level="L4",
            current_score=78.0,
            required_score=82.0,
            gap_levels=1,
            severity="Medium",
            role_relevance=90.0,
            priority_rank=2,
            estimated_time_to_bridge="8-10 hours",
            recommended_course_id="crs-002",
            rationale="Required for leading sampling frame updates for the 80th Round NSS Survey.",
        )
        session.add_all([sg1, sg2])

        # 7. Sample Assessment with Questions
        asmt = Assessment(
            id="asmt-001",
            title="Survey Design & Sampling Methodology Diagnostic",
            description="Official diagnostic assessment based on NSSO 78th Round Instruction Manual to evaluate sampling design mastery.",
            domain="Statistical",
            target_competency="Survey Design & Sampling Methodology",
            source_doc_name="NSSO_78th_Round_Sampling_Instructions.pdf",
            total_questions=3,
            duration_minutes=15,
            difficulty="Medium",
            created_by="NSSTA Faculty",
        )
        q1 = Question(
            id="q-001",
            assessment_id=asmt.id,
            question_text="In a 2-stage stratified sampling scheme for the Household Consumer Expenditure Survey (HCES), what constitutes the Primary Sampling Unit (PSU) in the rural sector?",
            options=[
                "Individual Agricultural Household",
                "Census Village (or Panchayat Ward)",
                "Sub-district (Tehsil)",
                "District Statistical Block"
            ],
            correct_index=1,
            explanation="According to NSSO Standard Operating Procedures (Page 14), the Census Village as per the latest Population Census constitutes the PSU in rural areas.",
            difficulty="Medium",
            competency="Survey Design & Sampling Methodology",
            source_reference="Page 14 — NSSO_78th_Round_Sampling_Instructions.pdf",
            approved=True,
        )
        q2 = Question(
            id="q-002",
            assessment_id=asmt.id,
            question_text="When executing Probability Proportional to Size (PPS) sampling, which measure of size is primarily utilized for rural PSU selection in MoSPI surveys?",
            options=[
                "Total Geographical Area in Hectares",
                "Census Population / Number of Households",
                "Total Agricultural Yield",
                "Number of Registered Voters"
            ],
            correct_index=1,
            explanation="The census population (or household count) from the preceding Census serves as the auxiliary variable measure of size for PPS sampling.",
            difficulty="Medium",
            competency="Survey Design & Sampling Methodology",
            source_reference="Page 22 — NSSO_78th_Round_Sampling_Instructions.pdf",
            approved=True,
        )
        q3 = Question(
            id="q-003",
            assessment_id=asmt.id,
            question_text="What is the primary function of the Multiplier (Sampling Weight) calculated for each sample household?",
            options=[
                "To adjust for inflation in expenditure data",
                "To blow up sample estimates to represent the entire domain population",
                "To calculate standard error bounds",
                "To normalize qualitative survey responses"
            ],
            correct_index=1,
            explanation="The inverse of the selection probability (multiplier) inflates the sample statistic to unbiased population totals.",
            difficulty="Easy",
            competency="Survey Design & Sampling Methodology",
            source_reference="Page 35 — NSSO_78th_Round_Sampling_Instructions.pdf",
            approved=True,
        )
        session.add(asmt)
        session.add_all([q1, q2, q3])

        # 8. Certificate
        cert = Certificate(
            id="cert-001",
            user_id=learner.id,
            credential_id="MOSPI-CERT-2025-8841",
            course_title="National Accounts & Macroeconomic Compilation Systems",
            provider="NSSTA Apex Academy",
            issue_date="20 Aug 2025",
            expiry_date="Lifetime",
            recipient_name="Rajesh Sharma",
            recipient_role="Senior Statistical Officer",
            grade="Distinction (88%)",
            verification_url="https://nssta.gov.in/verify/MOSPI-CERT-2025-8841",
            competencies_acquired=["National Accounts & Macroeconomic Statistics", "SNA 2008 Principles"],
        )
        session.add(cert)

        # 9. Notifications
        n1 = Notification(
            id="notif-1",
            user_id=learner.id,
            title="New iGOT Recommendation",
            message="Python Foundations for Statistical Analysis recommended based on NSSO microdata requirement.",
            time_str="10 mins ago",
            type="recommendation",
            read=False,
            link_view="learning-path",
        )
        session.add(n1)

        await session.commit()
        print("Database seeded successfully!")


if __name__ == "__main__":
    asyncio.run(seed_database())
