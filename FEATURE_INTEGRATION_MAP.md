# 🗺️ StatIntel-AI — Feature Integration Map & Extension Feasibility Matrix

**Project:** StatIntel-AI (SIH 2024 Grand Finale Edition)  
**Problem Statement:** SIH-2024-PS-1628 (MoSPI)  
**Date:** September 2026  
**Auditor:** Lead Systems Engineer  

---

## 1. Existing Core Features Matrix

| Feature | Files Involved | API Endpoints | Database Models | Frontend Components | Dependencies | Safe to Extend? |
|---|---|---|---|---|---|---|
| **1. Government Data Connectors** | `src/services/api/dataGovIn.ts`, `mospi.ts`, `rbi.ts`, `census.ts`, `http.ts`, `cache.ts` | External `api.data.gov.in`, `/api/v1/mospi/*`, `/api/v1/rbi/*`, `/api/v1/census/*` | In-memory + localStorage cache entries | `KPICards.tsx`, `IndiaMap.tsx`, `TimeSeriesChart.tsx` | Native fetch, AbortController | **SAFE** &mdash; Connectors are modular with built-in fallbacks. |
| **2. Time-Series Forecasting + Bands** | `ml_backend/models/forecasting.py`, `ml_backend/main.py`, `src/components/analytics/TimeSeriesChart.tsx` | `POST /predict/forecast` | None (Stateless ML Pipeline) | `TimeSeriesChart.tsx`, `ExplainAIModal.tsx` | `numpy`, `scipy`, `pydantic`, `fastapi`, `lucide-react` | **SAFE** &mdash; Pure mathematical forecasting with standard JSON contracts. |
| **3. TreeSHAP Explainability (XAI)** | `ml_backend/explainability/shap_explainer.py`, `src/components/modals/ExplainAIModal.tsx` | Embedded in all `/predict/*` responses | None (Feature vectors) | `ExplainAIModal.tsx` | `numpy`, `lucide-react`, `motion` | **SAFE** &mdash; Isolated modal component accepting standardized `ShapFeature[]`. |
| **4. District Geospatial Heatmap** | `src/components/analytics/IndiaMap.tsx`, `src/services/api/census.ts` | `/api/v1/census/districts`, `/national-overview` | `census_districts` payload | `IndiaMap.tsx`, `DrillDown.tsx` | `lucide-react`, `tailwind` | **SAFE** &mdash; Pure client-side reactive rendering with 788 district coordinates. |
| **5. Anomaly Detection & Alerts** | `ml_backend/models/anomaly.py`, `src/services/alertService.ts`, `src/components/analytics/AnomalyAlert.tsx`, `AlertThresholdSettings.tsx` | `POST /predict/anomaly` | `statintel_alert_threshold_config`, `recent_alerts` | `AnomalyAlert.tsx`, `AlertThresholdSettings.tsx` | `scikit-learn` (IsolationForest), `numpy` | **SAFE** &mdash; Threshold configuration stored in local storage and synced with UI. |
| **6. Comparative Macroeconomic Analytics** | `src/components/analytics/ComparisonMode.tsx`, `src/components/analytics/DrillDown.tsx` | Client state + API aggregators | None | `ComparisonMode.tsx`, `DrillDown.tsx` | `lucide-react` | **SAFE** &mdash; Fully decoupled view component. |
| **7. Official Executive Brief & Watermarked PDF** | `src/components/analytics/ExecutiveReportGenerator.tsx` | Client rendering + Print CSS | `statintel_reports` | `ExecutiveReportGenerator.tsx` | Browser print stylesheet, `lucide-react` | **SAFE** &mdash; Uses native window print stylesheet with official watermark. |
| **8. Bilingual i18n Localization** | `src/services/i18n.tsx`, `src/components/common/LanguageToggle.tsx` | None (Client dictionary) | `statintel_lang` (localStorage) | `LanguageToggle.tsx`, All views | React Context | **SAFE** &mdash; React Context dictionary with instant fallback to English key. |
| **9. DigiLocker SSO & System Audit Trail** | `src/components/auth/DigiLockerLoginModal.tsx`, `src/services/auditTrail.ts`, `src/components/analytics/AuditTrailViewer.tsx` | `/api/v1/auth/login`, `/api/v1/auth/me` | `audit_logs`, `users` | `DigiLockerLoginModal.tsx`, `AuditTrailViewer.tsx` | `jwt`, `passlib` (backend) | **SAFE** &mdash; Non-blocking simulation modal with persistent event logging. |
| **10. Competency Digital Twin & Adaptive Path** | `src/views/CompetencyDigitalTwinView.tsx`, `SkillGapView.tsx`, `LearningPathView.tsx`, `backend/app/services/competency_service.py` | `/api/v1/competencies`, `/api/v1/skill-gaps`, `/api/v1/learning/path` | `competencies`, `user_competencies`, `skill_gaps` | `CompetencyRadar.tsx`, `CompetencyDetailDrawer.tsx` | `groqService.ts`, `geminiService.ts` | **MEDIUM RISK** &mdash; Involves database state synchronization; maintain strict null checks. |
| **11. AI Quiz Studio (RAG)** | `src/views/QuizGeneratorView.tsx`, `backend/app/api/v1/quiz.py`, `backend/app/ai/quiz_generator.py` | `POST /api/v1/quiz/generate` | `documents`, `questions`, `quiz_results` | `QuizGeneratorView.tsx` | `gemini_provider`, `groqService` | **MEDIUM RISK** &mdash; Requires external LLM token connectivity; keep offline fallback questions active. |
| **12. Navigation & App Router** | `src/App.tsx`, `src/context/AppContext.tsx`, `src/components/layout/AppSidebar.tsx` | None (Hash URL sync) | `activeView` state | `App.tsx`, `AppHeader.tsx`, `AppSidebar.tsx` | React Context | **DO NOT TOUCH (STABLE)** &mdash; Preserves the resolved loading/buffering fix. |

---

## 2. Deep-Dive Mapping for the 5 Candidate Hackathon Features

### Feature A: AI Policy Copilot (Interactive MoSPI Decision Support Chatbot)
- **Concept:** Conversational policy advisor that answers complex econometric questions, summarizes district discrepancies, and suggests fiscal/sampling interventions based on real data feeds.
- **Files Involved:**
  - `src/components/copilot/PolicyCopilotDrawer.tsx` (New interactive drawer / floating widget)
  - `src/services/copilotService.ts` (Connects to Groq Qwen-3.6 / Gemini / IndicBERT with domain prompt)
  - `ml_backend/models/nlp.py` (Entity and query intent extraction)
  - `ml_backend/main.py` (Adds `/copilot/query` endpoint)
- **API Endpoints:** `POST /api/v1/copilot/chat` or `POST /copilot/query`
- **Database Models:** `copilot_conversations`, `copilot_messages` (Optional / In-Memory Session)
- **Frontend Components:** `<PolicyCopilotDrawer />`, `<CopilotFloatingTrigger />`, `<PromptChipBar />`
- **Dependencies:** `lucide-react`, `motion`, existing `groqService.ts` / `geminiService.ts`
- **Feasibility & Safety:** **SAFE (High Demo Wow Factor)**. Mounts as an overlay drawer without interfering with existing dashboard layouts or routing.

---

### Feature B: Scenario / Target Planner (Interactive What-If Policy Simulation)
- **Concept:** Interactive simulation engine allowing policy officers to drag sliders (e.g. adjust Repo Rate by &plusmn;50 bps, increase rural industrial subsidy by 15%, or target 85% district literacy) and view real-time projected impacts on CPI, IIP, and unemployment with confidence intervals.
- **Files Involved:**
  - `src/components/analytics/ScenarioPlanner.tsx` (Interactive what-if policy simulator)
  - `ml_backend/models/forecasting.py` (Adds perturbation response curves)
  - `src/views/StatisticalIntelligenceDashboard.tsx` (Mounts within analytics tabs)
- **API Endpoints:** `POST /predict/scenario-simulate`
- **Database Models:** None (Stateless econometric matrix simulation)
- **Frontend Components:** `<ScenarioPlanner />`, `<SensitivitySlider />`, `<ProjectionDeltaPill />`
- **Dependencies:** `recharts`, `lucide-react`, `motion`
- **Feasibility & Safety:** **SAFE & EXTREMELY HIGH IMPACT**. Demonstrates active policy intelligence rather than passive reporting.

---

### Feature C: Counterfactual Explainable AI (Counterfactual XAI)
- **Concept:** Goes beyond standard SHAP attribution by answering: *"What is the minimum required change in sub-indices to move this district from 'Aspirational' to 'High-Performing'?"* or *"What minimum food supply intervention would bring inflation below 4.0%?"*
- **Files Involved:**
  - `ml_backend/explainability/counterfactual_engine.py` (Optimization search for closest boundary vector)
  - `src/components/modals/CounterfactualModal.tsx` (Visual prescriptive slider delta modal)
  - `ml_backend/main.py` (Adds `/explain/counterfactual` endpoint)
- **API Endpoints:** `POST /explain/counterfactual`
- **Database Models:** None (Optimization algorithm on trained classifier/forecaster)
- **Frontend Components:** `<CounterfactualModal />`, `<MinInterventionCard />`
- **Dependencies:** `scipy.optimize`, `numpy`, `lucide-react`
- **Feasibility & Safety:** **SAFE & HIGH INNOVATION SCORE**. Judges frequently look for prescriptive AI (prescribing solutions) over descriptive AI.

---

### Feature D: Multilingual Natural Language Analytics (Indic Voice/Text to Visual Query)
- **Concept:** Allows an officer to type or speak in Hindi (e.g., *"महाराष्ट्र में औद्योगिक उत्पादन और मुद्रास्फीति का रुझान दिखाएं"*) and automatically renders the exact filtered chart and district card with Hindi narration synthesis.
- **Files Involved:**
  - `ml_backend/models/nlp.py` (Enhanced IndicBERT entity extraction for all 28 states & 788 districts)
  - `src/components/analytics/NaturalLanguageQueryBar.tsx` (Smart search input with instant voice/text suggestions)
  - `src/services/i18n.tsx` (Devanagari query mapping)
- **API Endpoints:** `POST /nlp/query` (Already built and tested in Phase 3!)
- **Database Models:** None
- **Frontend Components:** `<NaturalLanguageQueryBar />`, `<IndicVoiceButton />`
- **Dependencies:** Web Speech API (`webkitSpeechRecognition` / native speech synthesis), `lucide-react`
- **Feasibility & Safety:** **SAFE & ULTRA-FAST TO SHIP**. The backend endpoint `/nlp/query` is already 100% built and passing tests.

---

### Feature E: Data Quality & Anomaly Detection (Automated Schema Validator & Ingestion Engine)
- **Concept:** Advanced drag-and-drop diagnostic hub where officers upload dirty survey CSVs/Excels; the system automatically flags missing multipliers, anomalous variance ratios, and NSSO sampling weight discrepancies with auto-repair suggestions.
- **Files Involved:**
  - `src/components/analytics/DataQualityStudio.tsx` (Deep-dive dataset repair studio)
  - `ml_backend/pipeline/preprocessor.py` (Quantile clipping + imputation already built!)
  - `ml_backend/models/anomaly.py` (Isolation forest already built!)
- **API Endpoints:** `POST /pipeline/clean`, `POST /predict/anomaly`
- **Database Models:** `documents`, `dataset_audit_runs`
- **Frontend Components:** `<DataQualityStudio />`, `<AnomalyBreakdownTable />`
- **Dependencies:** `pandas`, `scikit-learn`, `lucide-react`
- **Feasibility & Safety:** **SAFE**. The underlying ML pipeline (`/pipeline/clean` & `/predict/anomaly`) is already built and tested in `ml_backend`.
