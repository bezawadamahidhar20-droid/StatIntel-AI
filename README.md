# StatIntel AI — AI-Powered Competency Intelligence & Learning Platform for Official Statistics

[![Python 3.12+](https://img.shields.io/badge/python-3.12+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688.svg)](https://fastapi.tiangolo.com/)
[![React 18](https://img.shields.io/badge/React-18.0-61dafb.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-336791.svg)](https://github.com/pgvector/pgvector)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**StatIntel AI** is an enterprise-grade AI-powered competency assessment, skill-gap detection, personalized learning recommendation, grounded RAG assessment, and workforce intelligence platform designed specifically for government officials working in the **Official Statistics ecosystem** (Ministry of Statistics and Programme Implementation - MoSPI, Indian Statistical Service - ISS, SSS, and National Statistical Office - NSO).

---

## 🏛️ 1. Core Intelligence Feedback Loop

StatIntel AI operates as a **Competency Intelligence + Workforce Skill Analytics Engine**. It executes a continuous closed-loop feedback pipeline:

```text
       ┌─────────────────────────────────────────────────────────┐
       │                   User Profile                          │
       └──────────────────────────┬──────────────────────────────┘
                                  │
                                  ▼
       ┌─────────────────────────────────────────────────────────┐
       │               Competency Assessment                     │
       └──────────────────────────┬──────────────────────────────┘
                                  │
                                  ▼
       ┌─────────────────────────────────────────────────────────┐
       │               Skill Gap Engine (L1 - L5)                │
       └──────────────────────────┬──────────────────────────────┘
                                  │
                                  ▼
       ┌─────────────────────────────────────────────────────────┐
       │      7-Factor Explainable Recommendation Engine          │
       └──────────────────────────┬──────────────────────────────┘
                                  │
                                  ▼
       ┌─────────────────────────────────────────────────────────┐
       │            Personalized Learning Pathway                │
       └──────────────────────────┬──────────────────────────────┘
                                  │
                                  ▼
       ┌─────────────────────────────────────────────────────────┐
       │            Grounded RAG AI Quiz Generator               │
       └──────────────────────────┬──────────────────────────────┘
                                  │
                                  ▼
       ┌─────────────────────────────────────────────────────────┐
       │         Competency Digital Twin Update & KPIs           │
       └──────────────────────────┬──────────────────────────────┘
                                  │
                                  ▼
       ┌─────────────────────────────────────────────────────────┐
       │       Workforce Intelligence & Department Heatmap        │
       └─────────────────────────────────────────────────────────┘
```

---

## ✨ 2. Key Platform Features

### 🏢 Official Statistics Competency Framework
Database-driven ontology covering 4 primary domains:
- **Statistical Competencies**: Survey Design & Sampling Methodology (NSSO), National Accounts & GDP (SNA 2008), CPI/WPI Price Statistics, Data Quality Frameworks (NQAF/SDMX).
- **Technical Competencies**: Python for Large Microdata Processing (Pandas/Polars), R & Stata Econometric Modeling, SQL, GIS Mapping, Cloud Computing.
- **Digital Governance**: Digital Personal Data Protection (DPDP Act 2023) compliance, Anonymization Protocols, Digital Public Infrastructure.
- **Behavioural & Managerial**: Evidence-Based Policy Communication, Technical Leadership, Project Management.

### 👤 Competency Digital Twin
Dynamic digital representation for every government officer tracking:
- Current proficiency level ($L1$ Awareness to $L5$ Expert) vs Required benchmark level
- Real-time score trends ($0 - 100\%$) and confidence levels
- Verified evidence sources (Assessments, Certifications, Experience logs)
- Overall role readiness percentage and learning metrics

### 🤖 Grounded RAG AI Quiz Generator & Learning Assistant
- Grounded in official manuals (e.g., NSSO 78th Round Household Consumer Expenditure Survey)
- Hallucination-proof question generation with exact page citations (`sourceReference`)
- LLM Provider Abstraction supporting **Gemini API** (`gemini-2.5-flash`) with automatic **Mock Provider** fallback for offline execution
- Domain-aware AI chatbot assistant for Official Statistics queries

### 📊 7-Factor Explainable Recommendation Engine
Calculates weighted course recommendation scores:
$$\text{Score} = \text{RoleMatch} \cdot 0.30 + \text{SkillGap} \cdot 0.25 + \text{DeptPriority} \cdot 0.20 + \text{SemanticSim} \cdot 0.10 + \text{LearningHist} \cdot 0.05 + \text{CareerAlign} \cdot 0.05 + \text{EmergingSkill} \cdot 0.05$$
Returns transparent percentage factor breakdowns for every recommendation.

### 🌐 iGOT / NSSTA / TPAC Integration Abstraction
Unified provider interface (`TrainingProvider`) enabling seamless integration with:
- **iGOT Karmayogi** (Government of India Capacity Building Platform)
- **NSSTA** (National Statistical Systems Training Academy)
- **TPAC** (Training Provider Alignment Cell)

### 📈 Workforce Intelligence Analytics
Executive leadership dashboard featuring:
- Department skill gap heatmaps (Department $\rightarrow$ Competency $\rightarrow$ Gap Severity $\rightarrow$ Affected Officers)
- Predictive skill intelligence demand forecasting baseline

---

## 🛠️ 3. Technology Stack

### Frontend
- **Framework**: React 18, Vite, TypeScript
- **Styling**: TailwindCSS, Glassmorphism design system, Dark Mode support
- **Icons**: Lucide React
- **API Client**: [apiClient.ts](file:///c:/Users/MAHIDHAR/Downloads/StatIntel-AI-main/StatIntel-AI-main/src/services/apiClient.ts)

### Backend
- **Core**: Python 3.12+, FastAPI, Pydantic v2
- **ORM & DB**: async SQLAlchemy 2.x, Alembic, PostgreSQL + `pgvector` (SQLite in-memory fallback)
- **Security**: JWT Access/Refresh tokens, bcrypt password hashing, RBAC permissions
- **AI & RAG**: Gemini API (`google-genai`), PyPDF, RAG retrieval
- **Testing**: Pytest, AsyncIO, HTTPX (19/19 tests passing)
- **Containers**: Docker, Docker Compose

---

## 🚀 4. Quick Start Guide

### Option A: Local Development

#### 1. Backend Setup
```bash
cd backend

# Create virtual environment & install dependencies
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Copy environment settings
cp .env.example .env

# Seed initial database
python scripts/seed_data.py

# Start FastAPI dev server
uvicorn app.main:app --reload --port 8000
```
- API OpenAPI Swagger Docs: [http://localhost:8000/docs](http://localhost:8000/docs)
- API ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

#### 2. Frontend Setup
```bash
# In the repository root directory
npm install  # or bun install / yarn install
npm run dev
```
- Frontend UI: [http://localhost:5173](http://localhost:5173)

---

### Option B: Docker Compose Setup

Run the full containerized stack (FastAPI Backend + PostgreSQL pgvector + Redis):

```bash
docker-compose -f backend/docker-compose.yml up --build -d
```

---

## 🧪 5. Running Tests

Run the complete Pytest test suite covering unit tests, API endpoints, security, and full end-to-end intelligence feedback loops:

```bash
python -m pytest backend/tests
```

```text
collected 19 items

backend/tests/api/test_ai_subsystem.py ..                                [ 10%]
backend/tests/api/test_assessments_and_gaps.py .                         [ 15%]
backend/tests/api/test_auth.py ...                                       [ 31%]
backend/tests/api/test_competencies.py ..                                [ 42%]
backend/tests/api/test_health.py ....                                    [ 63%]
backend/tests/api/test_recommendations_and_courses.py .                  [ 68%]
backend/tests/api/test_workforce_and_analytics.py ..                     [ 78%]
backend/tests/integration/test_end_to_end_loop.py .                      [ 84%]
backend/tests/unit/test_repositories.py ...                              [100%]

============================= 19 passed in 2.81s ==============================
```

---

## 🔑 6. Demo Accounts

| User | Email | Password | Role | Designation & Department |
|---|---|---|---|---|
| **Learner** | `rajesh.sharma@mospi.gov.in` | `password123` | `LEARNER` | Senior Statistical Officer (SDRD, MoSPI) |
| **Admin** | `vandana.sengupta@gov.in` | `password123` | `ADMIN` | Director General & Head of Training (NSSTA) |

---

## 📜 7. License

Distributed under the MIT License. See `LICENSE` for details.
