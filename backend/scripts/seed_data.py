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

        # 5. Courses with Modules, Topics and Verified Resources
        crs1 = Course(
            id="crs-001",
            title="Python Foundations for Statistical Analysis & NSSO Microdata",
            provider="iGOT Karmayogi",
            domain="Technical",
            duration="8 hours",
            duration_hours=8.0,
            difficulty="Intermediate",
            language="English / Hindi",
            rating=4.85,
            review_count=1420,
            match_score=96.0,
            status="In Progress",
            progress=45.0,
            description="Engineered specifically for Ministry of Statistics officials: master Pandas, Polars, and SciPy to process official survey microdata (PLFS, Consumer Expenditure Survey). Learn weighted means, standard error calculations, and automated tabulation without proprietary licenses.",
            competencies_covered=["Python for Statistical & Microdata Analytics", "Data Quality Frameworks"],
            prerequisites=["Basic command line familiarity", "Understanding of survey sampling weights"],
            outcomes=["Parse multi-gigabyte NSSO/PLFS microdata in seconds", "Compute correct pooled sample weights across sub-samples", "Export production-ready tables compliant with MoSPI publication guidelines"],
            modules=[
                {"id": "m-1", "title": "Data Structures for Microdata: Pandas & Polars DataFrames", "duration": "1h 30m", "completed": True},
                {"id": "m-2", "title": "Handling Missing Values & Imputation in NSSO Raw ASCII Records", "duration": "2h 00m", "completed": True},
                {"id": "m-3", "title": "Multiplier Application & Complex Survey Weighting", "duration": "2h 15m", "completed": False},
                {"id": "m-4", "title": "Automated Generation of Official Statistical Statements", "duration": "2h 15m", "completed": False},
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
            title="Advanced Sampling Techniques & Small Area Estimation (SAE)",
            provider="NSSTA TPAC",
            domain="Statistical",
            duration="12 hours",
            duration_hours=12.0,
            difficulty="Advanced",
            language="English",
            rating=4.92,
            review_count=680,
            match_score=94.0,
            status="Recommended",
            progress=0.0,
            description="Designed by senior NSSTA faculty and Indian Statistical Institute (ISI) professors. In-depth coverage of Fay-Herriot models, empirical best linear unbiased prediction (EBLUP), and district-level estimation from national sample surveys.",
            competencies_covered=["Survey Design & Sampling Methodology"],
            prerequisites=["Linear regression fundamentals", "Sampling theory"],
            outcomes=["Implement SAE models linking survey estimates with GST and satellite indices", "Diagnose synthetic vs. direct estimator discrepancies"],
            modules=[
                {"id": "m-21", "title": "Principles of Small Area Estimation and Auxiliary Data", "duration": "3h 00m", "completed": False},
                {"id": "m-22", "title": "Area-Level Fay-Herriot Formulations with Administrative Records", "duration": "3h 30m", "completed": False},
            ],
            why_recommended={
                "summary": "Essential for publishing disaggregated district-level statistics without inflating field survey budgets.",
                "gapAddressed": "Elevates Survey Design from L3 (78%) to L4 (82%) to meet NSSO National Working Group standards.",
                "expectedImprovement": "Competency Level: L3 → L4. Prepares you for lead survey designer assignments.",
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
        await session.flush()

        # Detailed Learning Modules & Topics for Course 1
        from app.models.learning import (
            LearningModule,
            LearningTopic,
            LearningResource,
            CatalogCourse,
            SourceClassEnum,
            VerificationStatusEnum,
            CourseStatusEnum,
        )

        mod1 = LearningModule(
            id="mod-01",
            course_id=crs1.id,
            module_number=1,
            title="Data Structures for Microdata: Pandas & Polars DataFrames",
            description="Introduction to fast columnar data structures for loading, reshaping, and indexing NSSO survey datasets.",
            duration="1h 30m",
            order_index=1,
        )
        mod2 = LearningModule(
            id="mod-02",
            course_id=crs1.id,
            module_number=2,
            title="Handling Missing Values & Imputation in NSSO Raw ASCII Records",
            description="Techniques for handling non-response, special flag codes, and hot-deck imputation in official statistics.",
            duration="2h 00m",
            order_index=2,
        )
        mod3 = LearningModule(
            id="mod-03",
            course_id=crs1.id,
            module_number=3,
            title="Multiplier Application & Complex Survey Weighting",
            description="Vectorized dot-product application of NSSO multipliers for population estimation and sub-sample variance pooling.",
            duration="2h 15m",
            order_index=3,
        )
        mod4 = LearningModule(
            id="mod-04",
            course_id=crs1.id,
            module_number=4,
            title="Automated Generation of Official Statistical Statements",
            description="Production pipelines for exporting publication-ready statistical tables meeting MoSPI dissemination protocols.",
            duration="2h 15m",
            order_index=4,
        )
        session.add_all([mod1, mod2, mod3, mod4])
        await session.flush()

        # Topics for Module 1 (12 Granular Topics as specified in prompt)
        topics_mod1_data = [
            ("top-01", 1, "Introduction to structured statistical microdata", "Concepts of unit-level microdata, household vs person level records, and MoSPI survey rounds.", 20, "L2"),
            ("top-02", 2, "CSV and fixed-width data formats", "Reading fixed-width ASCII data files using read_fwf with official layout dictionaries.", 25, "L2"),
            ("top-03", 3, "Pandas Series architecture", "One-dimensional labeled arrays, indexed operations, and numerical precision in statistical calculations.", 15, "L2"),
            ("top-04", 4, "Pandas DataFrames", "Two-dimensional size-mutable tabular structures for multi-variable survey analysis.", 30, "L3"),
            ("top-05", 5, "Reading large datasets efficiently", "Chunking large survey rounds, optimizing memory dtype allocations, and memory profiling.", 25, "L3"),
            ("top-06", 6, "Data types and category casting", "Categorical types for state, district, religion, social group codes to reduce memory usage by 80%.", 20, "L2"),
            ("top-07", 7, "Filtering and selecting survey records", "Boolean indexing and query syntax for sub-sample and sector (rural/urban) isolation.", 20, "L2"),
            ("top-08", 8, "GroupBy and multi-level aggregation", "Aggregating survey statistics by state, industry NIC code, and household size.", 30, "L3"),
            ("top-09", 9, "Missing-value handling in survey data", "Treating survey non-response codes (99, 999, blanks) and forward/backward filling.", 25, "L3"),
            ("top-10", 10, "Polars for high-performance data processing", "Rust-based multithreaded DataFrame library executing survey transformations in milliseconds.", 30, "L3"),
            ("top-11", 11, "Pandas vs Polars comparison", "Benchmark comparison of memory consumption, execution speed, and lazy query evaluation.", 20, "L3"),
            ("top-12", 12, "Processing large NSS/NSSO datasets", "End-to-end extraction pipeline processing 100,000+ household survey records into aggregate tables.", 35, "L4"),
        ]

        top_entities = []
        for tid, tnum, ttitle, tdesc, tmin, tlvl in topics_mod1_data:
            top_obj = LearningTopic(
                id=tid,
                module_id=mod1.id,
                topic_number=tnum,
                title=ttitle,
                description=tdesc,
                estimated_minutes=tmin,
                difficulty="Intermediate",
                competency_id="comp-tech-1",
                skill_level=tlvl,
                prerequisites=["Basic Python programming", "Elementary statistics"],
                learning_objectives=[
                    f"Master the implementation of {ttitle} for official statistical microdata.",
                    "Execute memory-efficient computations on real-world survey datasets.",
                    "Implement automated data cleaning pipelines meeting MoSPI NQAF quality standards.",
                ],
                order_index=tnum,
            )
            top_entities.append(top_obj)
            session.add(top_obj)

        await session.flush()

        # Real Verified Learning Resources for Topic 4 (Pandas DataFrames) and key topics
        res_list = [
            # Topic 4: Pandas DataFrames
            LearningResource(
                id="res-01",
                topic_id="top-04",
                title="W3Schools Pandas DataFrames Tutorial",
                description="Interactive step-by-step tutorial covering DataFrame creation, indexing, slicing, and manipulation with live code execution.",
                url="https://www.w3schools.com/python/pandas/pandas_dataframes.asp",
                resource_type="WEB_TUTORIAL",
                provider="W3Schools",
                source_domain="w3schools.com",
                source_class=SourceClassEnum.EDUCATIONAL_PLATFORM,
                difficulty="Beginner to Intermediate",
                estimated_minutes=20,
                is_free=True,
                is_official=False,
                verification_status=VerificationStatusEnum.VERIFIED,
                quality_score=90,
                order_index=1,
            ),
            LearningResource(
                id="res-02",
                topic_id="top-04",
                title="Python for Data Analysis & Pandas Full Course",
                description="Comprehensive high-definition video masterclass covering DataFrames, vectorization, and data manipulation.",
                url="https://www.youtube.com/watch?v=vmEHCJofslg",
                resource_type="YOUTUBE_VIDEO",
                provider="freeCodeCamp (YouTube)",
                source_domain="youtube.com",
                source_class=SourceClassEnum.YOUTUBE,
                thumbnail_url="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&auto=format&fit=crop&q=80",
                difficulty="Intermediate",
                estimated_minutes=45,
                is_free=True,
                is_official=False,
                verification_status=VerificationStatusEnum.VERIFIED,
                quality_score=88,
                order_index=2,
            ),
            LearningResource(
                id="res-03",
                topic_id="top-04",
                title="Pandas Official User Guide: Data Structures Intro",
                description="Authoritative documentation explaining DataFrame internals, memory layouts, arithmetic alignment, and indexing.",
                url="https://pandas.pydata.org/docs/user_guide/dsintro.html",
                resource_type="DOCUMENTATION",
                provider="Pandas Development Team",
                source_domain="pandas.pydata.org",
                source_class=SourceClassEnum.OFFICIAL_DOCUMENTATION,
                difficulty="Advanced",
                estimated_minutes=30,
                is_free=True,
                is_official=True,
                verification_status=VerificationStatusEnum.VERIFIED,
                quality_score=98,
                order_index=3,
            ),
            LearningResource(
                id="res-04",
                topic_id="top-04",
                title="MoSPI Microdata Dissemination Standards & Survey Manuals",
                description="Official Ministry of Statistics and Programme Implementation portal for National Sample Survey (NSS) round descriptions and layouts.",
                url="https://www.mospi.gov.in/download-reports",
                resource_type="OFFICIAL_DOCUMENT",
                provider="Ministry of Statistics & Programme Implementation (MoSPI)",
                source_domain="mospi.gov.in",
                source_class=SourceClassEnum.OFFICIAL_GOVERNMENT,
                download_url="https://www.mospi.gov.in/download-reports",
                difficulty="Professional",
                estimated_minutes=25,
                is_free=True,
                is_official=True,
                verification_status=VerificationStatusEnum.VERIFIED,
                quality_score=100,
                order_index=4,
            ),
            # Topic 2: CSV & Fixed Width
            LearningResource(
                id="res-05",
                topic_id="top-02",
                title="W3Schools Read CSV & Tabular Data in Python",
                description="Practical guide on loading, parsing, and configuring CSV readers in Pandas.",
                url="https://www.w3schools.com/python/pandas/pandas_csv.asp",
                resource_type="WEB_TUTORIAL",
                provider="W3Schools",
                source_domain="w3schools.com",
                source_class=SourceClassEnum.EDUCATIONAL_PLATFORM,
                difficulty="Beginner",
                estimated_minutes=15,
                is_free=True,
                verification_status=VerificationStatusEnum.VERIFIED,
                quality_score=88,
                order_index=1,
            ),
            # Topic 10: Polars
            LearningResource(
                id="res-06",
                topic_id="top-10",
                title="Official Polars User Guide & Getting Started",
                description="Complete guide on the high-performance multithreaded DataFrame library implemented in Rust.",
                url="https://docs.pola.rs/user-guide/getting-started/",
                resource_type="DOCUMENTATION",
                provider="Polars Official",
                source_domain="docs.pola.rs",
                source_class=SourceClassEnum.OFFICIAL_DOCUMENTATION,
                difficulty="Intermediate",
                estimated_minutes=25,
                is_free=True,
                is_official=True,
                verification_status=VerificationStatusEnum.VERIFIED,
                quality_score=98,
                order_index=1,
            ),
        ]
        session.add_all(res_list)

        # 6. Comprehensive Multi-Role MoSPI / NSSTA Catalog Courses
        catalog_courses = [
            CatalogCourse(
                id="cat-001",
                course_code="NSSTA-STAT-401",
                title="Advanced Sample Survey Design & Complex Multi-Stage Weighting",
                description="Flagship apex programme by National Statistical Systems Training Academy (NSSTA) on stratified multistage sampling, primary sampling unit (PSU) selection with Probability Proportional to Size (PPS), and calibration weighting for national microdata.",
                provider="National Statistical Systems Training Academy (NSSTA)",
                provider_type="Apex National Statistical Academy",
                role="Indian Statistical Service (ISS) & Statistical Officers",
                roles_supported=["Data Analyst", "Data Scientist", "Statistical Scientist (MoSPI / ISS)", "Indian Statistical Service (ISS)"],
                department="Survey Design & Research Division (SDRD), MoSPI",
                domain="Statistical",
                competencies_covered=["Survey Design & Sampling Methodology", "Statistical Quality Frameworks", "Microdata Analytics"],
                duration="24 hours (4 Modules)",
                duration_hours=24.0,
                delivery_mode="Blended (Virtual Classroom + Practical Lab)",
                eligibility="ISS Officers, SSS Personnel, Academic Researchers & Data Scientists",
                level="Advanced",
                source_class=SourceClassEnum.OFFICIAL_GOVERNMENT,
                official_url="https://www.mospi.gov.in/",
                source_url="https://www.mospi.gov.in/download-reports",
                last_verified="04 Sep 2026",
                status=CourseStatusEnum.CURRENT,
                verification_status=VerificationStatusEnum.VERIFIED,
                modules_count=4,
                topics_count=16,
                is_mandatory_for_role=True,
            ),
            CatalogCourse(
                id="cat-002",
                course_code="IGOT-DATA-201",
                title="Python Data Processing for Official Microdata Pipelines",
                description="Curated by iGOT Karmayogi Bharat for public servants and students: modern Python, Pandas, Polars, and SQLite data wrangling for handling multi-gigabyte survey rounds and government data registers.",
                provider="iGOT Karmayogi Bharat",
                provider_type="National Civil Service Digital Learning Platform",
                role="Data Analyst & Data Engineers",
                roles_supported=["Data Analyst", "Data Scientist", "Data Engineer (Big Data & ETL)", "Backend Developer", "Full Stack Developer", "Machine Learning Engineer"],
                department="MoSPI IT & Modernization Division",
                domain="Technical",
                competencies_covered=["Python for Statistical & Microdata Analytics", "Data Wrangling", "SQL & Database Systems"],
                duration="16 hours (4 Modules)",
                duration_hours=16.0,
                delivery_mode="Self-Paced e-Learning",
                eligibility="Open to all students, university scholars, and civil servants",
                level="Intermediate",
                source_class=SourceClassEnum.OFFICIAL_GOVERNMENT,
                official_url="https://igotkarmayogi.gov.in/",
                source_url="https://igotkarmayogi.gov.in/",
                last_verified="04 Sep 2026",
                status=CourseStatusEnum.CURRENT,
                verification_status=VerificationStatusEnum.VERIFIED,
                modules_count=4,
                topics_count=14,
                is_mandatory_for_role=True,
            ),
            CatalogCourse(
                id="cat-003",
                course_code="NSSTA-ECON-502",
                title="System of National Accounts (SNA 2008) & GVA Compilation",
                description="In-depth training on compilation of Gross Value Added (GVA), base year revisions, supply-use tables (SUT), and macroeconomic indicators following United Nations Statistics Division (UNSD) standards.",
                provider="National Statistical Systems Training Academy (NSSTA)",
                provider_type="Apex National Statistical Academy",
                role="National Accounts Economists & Financial Analysts",
                roles_supported=["Data Analyst", "Data Scientist", "Statistical Scientist (MoSPI / ISS)", "Indian Statistical Service (ISS)"],
                department="National Accounts Division (NAD), MoSPI",
                domain="Statistical",
                competencies_covered=["National Accounts & Macroeconomic Statistics", "Econometric Modeling"],
                duration="20 hours (5 Modules)",
                duration_hours=20.0,
                delivery_mode="Instructor-Led Virtual Training",
                eligibility="Postgraduate students in Economics/Statistics and MoSPI officers",
                level="Advanced",
                source_class=SourceClassEnum.OFFICIAL_GOVERNMENT,
                official_url="https://www.mospi.gov.in/national-accounts-division-nad",
                source_url="https://www.mospi.gov.in/national-accounts-division-nad",
                last_verified="04 Sep 2026",
                status=CourseStatusEnum.CURRENT,
                verification_status=VerificationStatusEnum.VERIFIED,
                modules_count=5,
                topics_count=20,
                is_mandatory_for_role=False,
            ),
            CatalogCourse(
                id="cat-004",
                course_code="IGOT-SEC-301",
                title="DPDP Act 2023 & Statistical Data Privacy Compliance",
                description="Comprehensive masterclass on implementing Digital Personal Data Protection Act compliance, k-anonymity algorithms, and differential privacy protocols on public open datasets.",
                provider="iGOT Karmayogi Bharat",
                provider_type="National Civil Service Digital Learning Platform",
                role="Cybersecurity, Governance & Cloud Architects",
                roles_supported=["Cybersecurity Analyst & Ethical Hacker", "Cloud Solutions Architect", "Backend Developer", "Database Administrator & SQL Architect"],
                department="Ministry of Electronics and Information Technology (MeitY) & MoSPI",
                domain="Digital Governance",
                competencies_covered=["DPDP Act 2023 & Government Data Privacy Frameworks", "Cybersecurity & Data Protection"],
                duration="10 hours (3 Modules)",
                duration_hours=10.0,
                delivery_mode="Self-Paced e-Learning",
                eligibility="Open to all software developers, analysts, and public administrators",
                level="Intermediate",
                source_class=SourceClassEnum.OFFICIAL_GOVERNMENT,
                official_url="https://www.india.gov.in/",
                source_url="https://www.india.gov.in/",
                last_verified="04 Sep 2026",
                status=CourseStatusEnum.CURRENT,
                verification_status=VerificationStatusEnum.VERIFIED,
                modules_count=3,
                topics_count=12,
                is_mandatory_for_role=True,
            ),
            CatalogCourse(
                id="cat-005",
                course_code="NSSTA-GIS-305",
                title="Spatial Analytics & GIS Demarcation for Agricultural Surveys",
                description="Practical geospatial workshop using QGIS and GeoPandas for Urban Frame Survey (UFS) block digitization, satellite imagery overlay, and spatial enumeration.",
                provider="NSSTA TPAC",
                provider_type="Apex National Statistical Academy",
                role="GIS Specialists & Field Survey Managers",
                roles_supported=["Computer Vision Engineer", "Data Scientist", "Data Analyst", "Systems & Embedded Software Engineer"],
                department="National Sample Survey Office (NSSO), MoSPI",
                domain="Technical",
                competencies_covered=["GIS & Spatial Analytics for Surveys", "Survey Design & Sampling Methodology"],
                duration="18 hours (4 Modules)",
                duration_hours=18.0,
                delivery_mode="Practical GIS Lab & Field Workshop",
                eligibility="Graduate students in Engineering/Geo-informatics and survey officers",
                level="Intermediate",
                source_class=SourceClassEnum.OFFICIAL_GOVERNMENT,
                official_url="https://www.mospi.gov.in/",
                source_url="https://www.mospi.gov.in/download-reports",
                last_verified="04 Sep 2026",
                status=CourseStatusEnum.CURRENT,
                verification_status=VerificationStatusEnum.VERIFIED,
                modules_count=4,
                topics_count=16,
                is_mandatory_for_role=False,
            ),
            CatalogCourse(
                id="cat-006",
                course_code="IGOT-AI-402",
                title="Applied AI & Machine Learning for Statistical Imputation",
                description="Modern machine learning algorithms (XGBoost, Random Forests, KNN, Isolation Forests) for automated outlier detection and imputation in official enterprise databases.",
                provider="iGOT Karmayogi Bharat",
                provider_type="National Civil Service Digital Learning Platform",
                role="Machine Learning Engineers & AI Specialists",
                roles_supported=["Machine Learning Engineer", "AI & Deep Learning Specialist", "Data Scientist", "Computer Vision Engineer", "NLP & Conversational AI Engineer"],
                department="National Data Analytics Platform (NDAP) & MoSPI",
                domain="Technical",
                competencies_covered=["AI & Machine Learning for Imputation & Outliers", "Python for Statistical & Microdata Analytics"],
                duration="22 hours (4 Modules)",
                duration_hours=22.0,
                delivery_mode="Hands-on Jupyter Notebook Lab",
                eligibility="Proficiency in Python and basic linear algebra",
                level="Advanced",
                source_class=SourceClassEnum.OFFICIAL_GOVERNMENT,
                official_url="https://niti.gov.in/",
                source_url="https://niti.gov.in/",
                last_verified="04 Sep 2026",
                status=CourseStatusEnum.CURRENT,
                verification_status=VerificationStatusEnum.VERIFIED,
                modules_count=4,
                topics_count=18,
                is_mandatory_for_role=True,
            ),
        ]
        session.add_all(catalog_courses)

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
            verification_url="https://www.mospi.gov.in/verify/MOSPI-CERT-2025-8841",
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
        print("Database seeded successfully with verified learning curriculum & NSSTA catalog!")


if __name__ == "__main__":
    asyncio.run(seed_database())

