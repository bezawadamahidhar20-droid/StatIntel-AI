# StatIntel AI — Production-Ready FastAPI Backend

**AI-Powered Skill Intelligence & Learning Platform for Official Statistics**

This repository contains the complete production-ready backend for **StatIntel AI**, engineered using Python 3.12+, FastAPI, async SQLAlchemy 2.x, Pydantic v2, PostgreSQL with `pgvector`, Redis, and Gemini AI provider abstractions.

---

## 1. Core Intelligence Feedback Loop

The backend implements this complete closed-loop feedback pipeline:

```text
User Profile → Competency Assessment → Skill Analysis → Skill Gap Detection → Course Recommendation → Learning → AI Assessment → Competency Digital Twin Update → Workforce Intelligence
```

1. **Competency Assessment**: Evaluates officer competency across 4 official domains (Statistical, Technical, Digital Governance, Behavioural & Managerial) on an L1-L5 scale.
2. **Skill Gap Engine**: Deterministically calculates `Gap = Required Level - Current Level`, severity (`Critical`, `High`, `Medium`, `Low`), role relevance, and priority ranking.
3. **7-Factor Explainable Recommendation Engine**:
   $$\text{Score} = \text{RoleMatch} \cdot 0.30 + \text{SkillGap} \cdot 0.25 + \text{DeptPriority} \cdot 0.20 + \text{SemanticSim} \cdot 0.10 + \text{LearningHist} \cdot 0.05 + \text{CareerAlign} \cdot 0.05 + \text{EmergingSkill} \cdot 0.05$$
4. **Grounded RAG AI Quiz Generator**: Hallucination-proof quiz generation grounded in official manuals (NSSO, PLFS, ASI) with exact page citations.
5. **Dynamic Competency Digital Twin**: Automatically updates proficiency levels, score trend histories, evidence logs, and role readiness KPIs whenever an assessment or course is completed.
6. **Workforce Intelligence Analytics**: Aggregates real-time department skill gap heatmaps and predictive skill demand forecasts for government leadership.

---

## 2. Directory Structure

```text
backend/
├── app/
│   ├── main.py                     # FastAPI application factory & lifecycle management
│   ├── core/                       # Configuration, Security (JWT/bcrypt), Database, Middleware
│   ├── api/                        # Modular API router endpoints (v1)
│   │   ├── v1/
│   │   │   ├── auth.py             # Auth endpoints (/login, /register, /refresh, /me)
│   │   │   ├── profile.py          # User profile endpoints
│   │   │   ├── competencies.py     # Competency ontology & Digital Twin
│   │   │   ├── assessments.py      # Adaptive diagnostic assessments & scoring
│   │   │   ├── skill_gaps.py       # Gap severity ranking & recalculation
│   │   │   ├── recommendations.py  # 7-factor explainable recommendation engine
│   │   │   ├── courses.py          # Course catalogue & enrollment
│   │   │   ├── learning.py         # Personalized pathways & progress tracking
│   │   │   ├── quiz.py             # Grounded RAG AI quiz generator
│   │   │   ├── assistant.py        # StatIntel RAG domain assistant chat
│   │   │   ├── integrations.py     # iGOT / NSSTA / TPAC provider abstractions
│   │   │   ├── workforce.py        # Department heatmaps & predictive skill intelligence
│   │   │   ├── analytics.py        # Executive dashboard aggregations
│   │   │   └── admin.py            # User management & audit logs
│   ├── models/                     # SQLAlchemy 2.x Async ORM Models
│   ├── schemas/                    # Pydantic v2 validation & response contracts
│   ├── services/                   # Pure domain business logic services
│   ├── repositories/               # Repository pattern data access layer
│   ├── ai/                         # LLMProvider, GeminiProvider, MockLLMProvider, RAG
│   └── integrations/               # TrainingProvider (iGOT, NSSTA, TPAC)
├── tests/                          # Automated Pytest suite (Unit, API, End-to-End Loop)
├── scripts/                        # Database initialization & seeding scripts
├── Dockerfile                      # Production container build
├── docker-compose.yml              # Local containerized execution stack
├── requirements.txt
└── .env.example
```

---

## 3. Quick Start & Setup

### Prerequisites
* Python 3.12+
* PostgreSQL (with `pgvector` extension) or SQLite (in-memory test mode)
* Redis (optional for production caching)

### Local Environment Setup

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment Variables**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

3. **Seed Database**:
   ```bash
   python scripts/seed_data.py
   ```

4. **Run FastAPI Server**:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   * OpenAPI Documentation: [http://localhost:8000/docs](http://localhost:8000/docs)
   * ReDoc Documentation: [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 4. Docker Deployment

Launch the complete containerized stack (FastAPI Backend + PostgreSQL pgvector + Redis):

```bash
docker-compose up --build -d
```

---

## 5. Automated Test Suite

Run the full Pytest test suite covering unit tests, API endpoint tests, security tests, and the complete end-to-end intelligence feedback loop:

```bash
python -m pytest tests
```

---

## 6. Default Demo Credentials

* **Learner Account**:
  * Email: `rajesh.sharma@mospi.gov.in`
  * Password: `password123`
  * Role: `LEARNER` (Senior Statistical Officer, SDRD MoSPI)

* **Admin Account**:
  * Email: `vandana.sengupta@gov.in`
  * Password: `password123`
  * Role: `ADMIN` (Director General, NSSTA Apex Academy)
