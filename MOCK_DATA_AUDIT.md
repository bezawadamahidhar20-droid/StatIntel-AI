# 📊 StatIntel-AI — Mock Data & Hardcoded Components Comprehensive Audit

**Project:** StatIntel-AI (SIH 2024 - AI-Powered Statistical Intelligence & Analytics Platform)  
**Date:** September 2026  
**Status:** Phase 1 Complete (Audit & Cleanup Ready)

---

## 🎯 Audit Summary
This audit catalogues every instance of mock data, dummy fallbacks, hardcoded dataset payloads, and simulated integrations across the frontend, backend, and service layers. Replacing these with real-time API integrations (`data.gov.in`, `MoSPI`, `RBI`, `Census India`, and the FastAPI ML Backend) is the core objective to achieve production readiness for SIH.

---

## 🔍 Detailed File-by-File Breakdown

### 1. `src/data/mockData.ts` (Primary Mock Data File - 1,904 Lines, ~83.5 KB)

| Line Range | Mock Data Object / Function | Type of Mock Data | Proposed Real Data Source / Service Replacement |
|---|---|---|---|
| **Lines 14–33** | `initialUser` | Hardcoded student learner profile (Scores: 65%, readiness: 60%, learning hours: 12). | Live User Auth session, DigiLocker / Aadhaar OAuth SSO, PostgreSQL User profile database via `/api/v1/auth/me`. |
| **Lines 35–52** | `adminUser` | Hardcoded Admin profile ("Prof. Vandana Sengupta"). | Role-Based Access Control (RBAC) API with real Ministry/Institutional admin credentials via `/api/v1/auth/me`. |
| **Lines 54–368** | `initialCompetencies` | Static array of 12 MoSPI competencies (Survey Sampling, National Accounts, Index Numbers, etc.). | Dynamic competency tracking engine synced with MoSPI / NSSTA Competency Framework and live assessment results via `/api/v1/competencies`. |
| **Lines 370–473** | `initialSkillGaps` | Static skill gap items with hardcoded delta scores and training recommendations. | Dynamic AI Skill Gap Diagnostic API powered by FastAPI ML backend `/api/v1/skill-gaps`. |
| **Lines 475–751** | `allCourses` | 14 hardcoded course objects with static enrollments, ratings, and syllabus. | Real iGOT Karmayogi API & NSSTA Course Catalog Connector via `services/api/mospi.js` and `/api/v1/courses`. |
| **Lines 753–820** | `learningPathSteps` | Static 7-step career progression path. | Adaptive AI Learning Path Generator (`/api/v1/learning/path`) adjusting dynamically to user's diagnosed skill gaps. |
| **Lines 822–854** | `sampleUploadDocuments` | Hardcoded metadata and summaries for 4 MoSPI official survey manuals (PLFS, CPI, ASI, SUT). | Live document ingestion system accepting CSV/Excel/PDF uploads + MoSPI Open Data Portal direct ingestor (`/api/v1/documents/upload`). |
| **Lines 856–1061** | `initialAssessments` | Static multiple-choice questions for 8 exams. | Live GenAI / IndicBERT-powered Quiz Engine with difficulty scaling & dynamic generation via `/api/v1/quiz/generate`. |
| **Lines 1063–1112** | `initialTimelineEvents` | Hardcoded timeline activity log. | Real PostgreSQL Audit Trail & Telemetry event log (`/api/v1/analytics/timeline`). |
| **Lines 1114–1152** | `initialCertificates` | 4 hardcoded digital certificates. | Digitally signed cryptographic credentials / DigiLocker Issuer API (`/api/v1/certificates`). |
| **Lines 1154–1239** | `departmentHeatmapData` | Static 6-division competency matrix across MoSPI directorates (NSSO, CSO, FOD, SDRD, NAD, ESD). | Real-time Department Workforce Analytics aggregation engine from backend database (`/api/v1/admin/heatmap`). |
| **Lines 1241–1282** | `predictiveSkillItems` | Static emerging statistical skill trends for 2026–2028. | Prophet + LSTM Time-Series Forecasting Model on labor market / statistical demand data (`/api/v1/analytics/predictive`). |
| **Lines 1284–1742** | `mockCurriculumData` | Hardcoded markdown modules, lessons, and code snippets for 4 full courses. | Live LMS CMS database & dynamic interactive lab runner (`/api/v1/courses/{id}/curriculum`). |
| **Lines 1744–1904** | `mockCatalogCourses` | Redundant static course cards catalog. | Unified Catalog API `/api/v1/catalog` pulling from NSSTA and iGOT data streams. |

---

### 2. Frontend State & View Layers

| File Path | Line Numbers | Mock Data Usage | Proposed Real Data Source Replacement |
|---|---|---|---|
| `src/context/AppContext.tsx` | Lines 13–22, 160–220 | Loads default state directly from `mockData.ts` on initialization. | Integrate with `apiClient.ts` to hydrate state asynchronously from FastAPI backend with localStorage/Redis cache fallbacks. |
| `src/views/CoursesView.tsx` | Lines 22, 52, 66–69 | State initialized with `mockCatalogCourses` and falls back to mock data on fetch error. | Use real `/api/v1/catalog` endpoint with graceful skeleton loading and actionable retry states. |
| `src/views/CourseDetailView.tsx` | Lines 27, 83–87 | Falls back to `mockCurriculumData[course.id]` when backend API fails. | Fetch from `/api/v1/courses/{id}/curriculum` with interactive code sandbox execution. |
| `src/views/QuizGeneratorView.tsx` | Lines 23, 52, 162, 356 | Uses `sampleUploadDocuments` for document selection list and sample quiz generation. | Drag-and-drop file uploader with auto-schema parser & live document library from backend `/api/v1/quiz`. |
| `src/views/LearningPathView.tsx` | Lines 17, 30 | Imports and displays static `learningPathSteps`. | Fetch personalized roadmaps from `/api/v1/learning/path`. |
| `src/views/AdminDashboardView.tsx` | Lines 32, 50–60 | Uses `departmentHeatmapData` and `predictiveSkillItems`. | Fetch live workforce telemetry and predictive ML forecasts from `/api/v1/admin/heatmap` and `/api/v1/admin/predictive`. |
| `src/views/LoginView.tsx` | Lines 302–343, 601 | Hardcoded demo placeholder credentials and instant role bypass. | Implement simulated DigiLocker / Aadhaar SSO workflow and real JWT-based authentication against backend auth endpoints. |

---

### 3. Service & AI Fallback Layers

| File Path | Line Numbers | Mock Data Usage | Proposed Real Data Source Replacement |
|---|---|---|---|
| `src/services/geminiService.ts` | Lines 148–315, 486–620 | Hardcoded fallback skill taxonomies, default quiz questions, and offline mock explanations. | Real FastAPI ML backend endpoints (`/models/forecast`, `/models/anomaly`, `/explain/shap`) + IndicBERT / Groq API with robust retry. |
| `src/services/groqService.ts` | Lines 50–120 | Hardcoded fallback competency responses when API key is missing. | Dynamic fallback to local ML FastAPI microservice with clear indicator of backend connectivity. |

---

### 4. Backend Integrations & Database Seeds

| File Path | Line Numbers | Mock Data Usage | Proposed Real Data Source Replacement |
|---|---|---|---|
| `backend/app/integrations/nssta_provider.py` | Lines 20–45 | Simulated mock HTTP responses for NSSTA courses. | Real REST connector to MoSPI / NSSTA portal with API key authentication & exponential backoff. |
| `backend/app/integrations/igot_provider.py` | Lines 25–50 | Static dictionary of iGOT Karmayogi competency courses. | Real iGOT API integration using OAuth credentials and caching layer. |
| `backend/app/integrations/tpac_provider.py` | Lines 15–40 | Simulated training provider recommendations. | Integration with real Ministry of Skill Development & MoSPI training feeds. |
| `backend/scripts/seed_data.py` | Lines 1–800 | 40KB hardcoded database seed script containing static mock records for SQLite. | Automated data ingestion pipeline fetching live datasets from `api.data.gov.in`, `MoSPI`, `RBI`, and `Census India`. |

---

## 🚀 Transition Strategy (Phase 2 & Beyond)

1. **Phase 2 (Real Data Integration):**
   - Create `services/api/dataGovIn.js` → Connect to Open Government Data (OGD) Platform India (`https://api.data.gov.in`).
   - Create `services/api/mospi.js` → Ministry of Statistics and Programme Implementation datasets (CPI, IIP, PLFS, ASI).
   - Create `services/api/rbi.js` → Reserve Bank of India macroeconomic and banking indicators.
   - Create `services/api/census.js` → Census India demographic and district-level indicators.
   - Implement exponential retry (3 attempts), Redis / localStorage caching, rate limiting, and TypeScript types.
   - Provide complete `.env.example` setup.

2. **Phase 3 (AI/ML Backend - FastAPI):**
   - Implement `Prophet + LSTM` time-series forecasting.
   - Implement `Isolation Forest` anomaly detection.
   - Implement `XGBoost` multi-class classification.
   - Implement `IndicBERT` bilingual NLP query engine (Hindi + English).
   - Implement `SHAP Explainer` generating top 3 feature importance vectors for all predictions.

3. **Phases 4–8 (UI Overhaul, RBAC, Reports, SIH Pitch & Deployment):**
   - Interactive India Map (District-level GeoJSON heatmap), Recharts with confidence bands, SHAP waterfall modal, Language Toggle (i18next English/Hindi), Cost Savings Calculator, and Pitch documentation.

---
