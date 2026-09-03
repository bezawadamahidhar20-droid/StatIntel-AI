# StatIntel AI — 5–7 Minute SIH Pitch & Demonstration Script

**Target Audience**: Smart India Hackathon (SIH 2026) Evaluation Panel, MoSPI Dignitaries, NIC Tech Judges  
**Core Story Narrative**: **ASSESS → IDENTIFY → RECOMMEND → LEARN → REASSESS → UPDATE → PREDICT**  
**Total Running Time**: 6 Minutes (with 2 minutes buffer for Q&A)

---

## Pre-Demo Checklist
- [ ] Backend running: `uvicorn app.main:app --reload` (`http://localhost:8000`)
- [ ] Frontend running: `npm run dev` (`http://localhost:5173` or `3000`)
- [ ] Browser open on Landing Page: `http://localhost:5173`
- [ ] Optional: Click **"Reset Demo State"** under Admin if previously tested to ensure clean initial values.

---

## ⏱ Minute 0:00 – 0:45 | Introduction & The Problem Statement
### Presenter Script:
> *"Respected Jury Members, the Ministry of Statistics and Programme Implementation (MoSPI) manages massive national surveys like NSSO, PLFS, and National Accounts that drive India’s 5-trillion-dollar economy. Yet, human capacity management across the 1,200+ Indian Statistical Service officers still relies on disconnected course completions rather than audited statistical competencies.*
>
> *Introducing **StatIntel AI** — India’s first AI-powered Competency Intelligence Platform engineered specifically for MoSPI and the National Statistical Systems Training Academy (NSSTA). Let's see the live system in action."*

### On Screen Action:
- Start on `LandingView`.
- Point cursor to the MoSPI national banner and live cadre statistics card (**1,248 Digital Twins**, **74.8% Readiness**).
- Click **"Enter Platform"** to transition to the Login Screen.

---

## ⏱ Minute 0:45 – 1:30 | 1. ASSESS: Quick SSO & Competency Digital Twin
### Presenter Script:
> *"We support Jan Parichay Single Sign-On. For today's demo, we will log in as **Rajesh Sharma**, a Senior Statistical Officer in the Survey Design & Research Division (SDRD).*
>
> *Upon logging in, Rajesh isn't presented with a generic catalog. Instead, he sees his **Competency Digital Twin** — a live, multidimensional radar of his statistical mastery across Survey Sampling, National Accounts, Python Microdata Processing, and DPDP Act compliance."*

### On Screen Action:
- Click the **"Quick Demo: Rajesh Sharma (SSO SDRD)"** button on `LoginView`.
- Navigate to `CompetencyDigitalTwinView` (`/digital-twin`).
- Hover over the interactive radar chart showing **Survey Design at 78% (Level 3 Operational)**.
- Click **"Survey Design & Sampling Methodology"** to open the **Competency Deep Dive Drawer**, showing historical assessment dates and evidence trails.

---

## ⏱ Minute 1:30 – 2:30 | 2. IDENTIFY: Deterministic Skill Gap Engine
### Presenter Script:
> *"Next, the system's **Deterministic Skill Gap Engine** audits Rajesh's current level against the mandate for Senior Statistical Officers. Notice: for Survey Sampling, Rajesh is at 78%, but SDRD requires 82% (Level 4).*
>
> *The math is exact and auditable: Gap = 82 - 78 = 4 points. The engine tags this as a **Critical Gap** with an estimated bridging time of 12-16 hours."*

### On Screen Action:
- Navigate to `SkillGapView` (`/skill-gaps`).
- Point out the **Critical Severity** badge and the **MoSPI Mandated Target (82%)**.
- Click the **"Recalculate Gaps"** button to demonstrate live API calculation via `POST /api/v1/skill-gaps/recalculate` (<10ms).

---

## ⏱ Minute 2:30 – 3:30 | 3. RECOMMEND: 7-Factor Explainable Recommendations
### Presenter Script:
> *"Unlike standard recommender systems that behave like black boxes, StatIntel AI employs a **7-Factor Explainable Recommendation Algorithm**. Every recommendation is justified to the officer."*

### On Screen Action:
- Navigate to `CoursesView` (`/courses`).
- Highlight Course 1: *"Python Foundations for Official Statistics & Microdata Processing"* (Match Score: 96%).
- Click the **"Why Recommended?"** button to open the explanation modal.
- Show the jury the breakdown: **Role Match (30%)**, **Skill Gap Severity (25%)**, **Department Priority (20%)**, and **Expected Competency Gain (+22%)**.
- Click **"Enroll in Course"** — show the instant transition to *In Progress* with the notification popup.

---

## ⏱ Minute 3:30 – 4:30 | 4. LEARN & REASSESS: Grounded AI Quiz Generation (RAG)
### Presenter Script:
> *"Where do assessments come from? NSSTA publishes new survey manuals each round. Instead of months of manual question authoring, StatIntel AI features a **Grounded AI Assessment Engine**.*
>
> *We select the official NSSO 78th Round Manual. Using Google Gemini 3.1, the engine extracts grounded questions strictly citing the exact manual section."*

### On Screen Action:
- Navigate to `QuizGeneratorView` (`/quiz-generator`).
- Select Document: *"MoSPI NSSO 78th Round Household Survey Manual"*.
- Set Difficulty: *Medium*, Questions: *5*.
- Click **"Generate Grounded Assessment"**.
- Watch the questions populate with **Exact Source Citations**: *"Page 18 — Uploaded_Manual.pdf, Section 4.2"*.
- Click **"Take Assessment"** to open the Assessment Player.
- Rapidly answer questions and click **"Submit Assessment"**.

---

## ⏱ Minute 4:30 – 5:15 | 5. UPDATE: Closed-Loop Intelligence Lifecycle
### Presenter Script:
> *"Look at what happens upon submission: the platform closes the intelligence loop in real time.*
>
> *Rajesh scored 100% on the sampling diagnostic. His Survey Sampling competency immediately **boosts from 78% to 80%**, his active skill gap reduces, and his personalized learning path recalculates instantly."*

### On Screen Action:
- Display the **AssessmentResultView** showing the celebratory animation, score breakdown, and **+2% Competency Gain**.
- Click **"View Updated Digital Twin"** to verify that the radar chart immediately reflects the new score.

---

## ⏱ Minute 5:15 – 6:15 | 6. PREDICT: Executive Cadre Workforce Intelligence
### Presenter Script:
> *"Now, let us switch from the individual learner to executive leadership. I am switching role to **Dr. Vandana Sengupta**, Director General of NSSTA.*
>
> *Here, MoSPI leadership gains macro-level cadre visibility across all 5 divisions (SDRD, NAD, ESD, DQID, FOD).*
> *The **Competency Heatmap Matrix** flags institutional skill deficits in real time. And the **Predictive Skill Demand Forecast** projects our need for AI-driven statistical computing over the next 3 years."*

### On Screen Action:
- Click **"Switch to Admin View (Dr. Vandana Sengupta)"** in the top navbar or switch role button.
- Navigate to `AdminDashboardView` (`/admin-dashboard`).
- Show the **Division Heatmap Matrix** (highlighting where SDRD or NAD has lower readiness in Python vs Survey Methodology).
- Click the **"Predictive Skill Demand"** tab, pointing out the projected 3-year capacity trends.

---

## ⏱ Minute 6:15 – 7:00 | Conclusion & Judge Handover
### Presenter Script:
> *"To summarize: StatIntel AI is not just another LMS. It is a complete, explainable, closed-loop skill intelligence infrastructure built for Digital India and the Viksit Bharat 2047 statistical vision.*
>
> *The entire backend runs on asynchronous FastAPI with dual PostgreSQL and SQLite engines, resilient Google Gemini 3.1 integration with instant offline fallbacks, and zero data leaks.*
>
> *Thank you, and we look forward to your questions."*
