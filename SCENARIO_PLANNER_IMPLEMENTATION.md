# Policy Simulation & Scenario Planner Implementation (Feature B)
**StatIntel-AI &mdash; Smart India Hackathon 2024 / MoSPI PS-1628**

---

## 1. Executive Summary & Scientific Integrity Declaration

### Nature of the Model Implementation
> **Explicit Scientific Distinction:**
> This feature implements a **Target Planning Trajectory & Model-Based Baseline Forecasting Engine (Trend-Decomposition / Prophet-LSTM-style simulation)** with **Differential Gap Analysis and Priority District Interventions**.
>
> **It is NOT a causal policy impact simulator.** It does not claim that adjusting a slider "causes" an econometric outcome. Instead, it computes what mathematical velocity (annual average change) is required to bridge the gap between observed reality, model-based baseline trajectory, and policy milestone objectives.

---

## 2. Existing Model & Dataset Used

### 1. Existing Model:
- **Model:** `TimeSeriesForecaster` (trend-decomposition simulation; Prophet/LSTM-style) located in `ml_backend/models/forecasting.py`.
- **Methodology:** Polynomial trend fitting + residual-based 95% confidence bounds ($z = 1.96 \cdot \sigma \sqrt{1 + 0.15 \cdot t}$).
- **Performance:** In-sample RMSE and R² are computed on the supplied historical series; no fixed accuracy claim is made.

### 2. Existing Dataset & Variables:
- **Dataset:** Curated reference registries of Census 2011 district baselines and MoSPI/RBI indicator values.
- **Genuine Model Input Variables:**
  - `geography`: Indian State (e.g. Tamil Nadu, Maharashtra, Kerala, Karnataka, Gujarat, Uttar Pradesh, Delhi) or District.
  - `indicator`: `literacy_rate`, `cpi_inflation`, `iip_growth`, `unemployment_rate`, `urbanization_rate`, `gdp_growth`.
  - `current_value`: Observed baseline value (2026).
  - `target_value`: Policy target milestone.
  - `target_year`: Policy horizon (2027 &ndash; 2035).

---

## 3. Scenario Calculation Methodology

### Mathematical Equations:
1. **Total Required Delta:**
   $$\Delta_{total} = \text{target\_value} - \text{current\_value}$$

2. **Required Annual Average Change Velocity:**
   $$v_{req} = \frac{\Delta_{total}}{T_{target} - T_{base}}$$

3. **Percentage Growth Required:**
   $$\% \Delta = \left(\frac{\Delta_{total}}{\text{current\_value}}\right) \times 100$$

4. **Gap to Model Baseline Forecast:**
   $$\text{Gap}_{baseline} = \text{target\_value} - \hat{y}_{baseline}(T_{target})$$

5. **District Gap Ranking:**
   For each district $d$ in the state:
   $$\text{Gap}_d = \text{target\_value} - y_d(2026)$$
   $$\text{Priority Tier} = \begin{cases} \text{Critical Priority} & \text{if } \text{Gap}_d > 8.0\% \\ \text{Moderate Priority} & \text{if } 3.0\% < \text{Gap}_d \le 8.0\% \\ \text{On Track} & \text{if } \text{Gap}_d \le 3.0\% \end{cases}$$

---

## 4. API Specification

### Endpoint: `POST /scenario/simulate`

#### Request Payload:
```json
{
  "geography": "Tamil Nadu",
  "indicator": "literacy_rate",
  "target_value": 86.5,
  "target_year": 2030,
  "current_value": 80.09,
  "base_year": 2026
}
```

#### Response Payload:
```json
{
  "success": true,
  "geography": "Tamil Nadu",
  "state_code": "TN",
  "indicator": "literacy_rate",
  "indicator_display": "Literacy Rate (%)",
  "current_value": 80.09,
  "base_year": 2026,
  "target_value": 86.5,
  "target_year": 2030,
  "metrics": {
    "total_change_required": 6.41,
    "annual_average_change_required": 1.6,
    "percentage_change_required": 8.0,
    "baseline_forecast_target_year": 83.49,
    "gap_to_baseline_forecast": 3.01,
    "model_rmse": 0.02,
    "model_r2": 0.99
  },
  "historical_observations": [
    { "year": 2021, "value": 75.99, "type": "historical" },
    { "year": 2022, "value": 76.81, "type": "historical" },
    { "year": 2023, "value": 77.63, "type": "historical" },
    { "year": 2024, "value": 78.45, "type": "historical" },
    { "year": 2025, "value": 79.27, "type": "historical" },
    { "year": 2026, "value": 80.09, "type": "historical" }
  ],
  "baseline_forecast": [
    { "year": 2027, "baseline_forecast": 80.94, "lower_bound": 80.19, "upper_bound": 81.69, "type": "baseline_forecast" },
    { "year": 2028, "baseline_forecast": 81.79, "lower_bound": 80.99, "upper_bound": 82.59, "type": "baseline_forecast" },
    { "year": 2029, "baseline_forecast": 82.64, "lower_bound": 81.79, "upper_bound": 83.49, "type": "baseline_forecast" },
    { "year": 2030, "baseline_forecast": 83.49, "lower_bound": 82.59, "upper_bound": 84.39, "type": "baseline_forecast" }
  ],
  "target_trajectory": [
    { "year": 2026, "target_value": 80.09, "type": "target_trajectory" },
    { "year": 2027, "target_value": 81.69, "type": "target_trajectory" },
    { "year": 2028, "target_value": 83.29, "type": "target_trajectory" },
    { "year": 2029, "target_value": 84.89, "type": "target_trajectory" },
    { "year": 2030, "target_value": 86.5, "type": "target_trajectory" }
  ],
  "priority_districts": [
    { "district": "Dharmapuri", "state": "Tamil Nadu", "current_value": 68.54, "target_value": 86.5, "gap": 17.96, "annual_required_rate": 4.49, "priority_tier": "Critical Priority" },
    { "district": "Salem", "state": "Tamil Nadu", "current_value": 72.86, "target_value": 86.5, "gap": 13.64, "annual_required_rate": 3.41, "priority_tier": "Critical Priority" },
    { "district": "Madurai", "state": "Tamil Nadu", "current_value": 83.45, "target_value": 86.5, "gap": 3.05, "annual_required_rate": 0.76, "priority_tier": "Moderate Priority" },
    { "district": "Coimbatore", "state": "Tamil Nadu", "current_value": 83.98, "target_value": 86.5, "gap": 2.52, "annual_required_rate": 0.63, "priority_tier": "On Track" },
    { "district": "Chennai", "state": "Tamil Nadu", "current_value": 90.18, "target_value": 86.5, "gap": -3.68, "annual_required_rate": -0.92, "priority_tier": "On Track" },
    { "district": "Kanyakumari", "state": "Tamil Nadu", "current_value": 91.75, "target_value": 86.5, "gap": -5.25, "annual_required_rate": -1.31, "priority_tier": "On Track" }
  ],
  "methodology": {
    "type": "Target Trajectory & Planning Scenario Model",
    "baseline_model": "Trend-Decomposition (Prophet/LSTM-style Simulation)",
    "planning_method": "Linear Target Interpolation & Differential Gap Analysis",
    "scientific_disclaimer": "Scenario results are model-based planning estimates and should not be interpreted as causal policy impact estimates unless supported by a verified causal model."
  }
}
```

---

## 5. Frontend Experience & Visualizations

Created `<PolicyScenarioPlanner />` mounted cleanly inside `StatisticalIntelligenceDashboard.tsx`:
1. **Interactive Controls:** Geography picker, statistical indicator picker, baseline value input, target milestone input, and horizon year selector.
2. **5 Key Metric Cards:**
   - Observed Baseline (2026)
   - Model Baseline Forecast at Target Year
   - Target Planning Milestone
   - Gap to Baseline Differential
   - Required Annual Change Velocity
3. **Pure SVG Trajectory Visualization:** Multi-series SVG path showing historical observations, model baseline forecast with 95% shaded confidence interval band, and target planning trajectory.
4. **Priority Districts Intervention Ranking Table:** Automatically highlights districts within the state with the highest progress gaps, categorizing them into *Critical Priority*, *Moderate Priority*, and *On Track*.

---

## 6. Verification & Test Results

### 1. ML Backend & Scenario Verification Suite:
```
================================================================
>> Running StatIntel-AI ML Backend Verification Suite
================================================================
  [PASS] Preprocessor: Clean Records
  [PASS] Preprocessor: Quality Cleanliness Score
  [PASS] SHAP Explainer: Top-3 Attribution Vectors
  [PASS] TimeSeriesForecaster: Prophet/LSTM Forecast
  [PASS] AnomalyDetector: Isolation Forest Outliers
  [PASS] Classifier: Socio-Economic Development Tier
  [PASS] NLP: English Literacy Trend
  [PASS] NLP: English District Ranking
  [PASS] NLP: English 5-Yr Growth
  [PASS] NLP: Hindi Literacy Trend
  [PASS] NLP: Hindi 5-Yr Growth
  [PASS] NLP: Tamil Literacy Lookup
  [PASS] NLP: Tamil District Ranking
  [PASS] NLP: Unknown Indicator Clarification
  [PASS] NLP: Empty Query Clarification
  [PASS] Scenario: Valid Target Trajectory Simulation
  [PASS] Scenario: Invalid Geography Validation
  [PASS] Scenario: Invalid Indicator Validation
  [PASS] Scenario: Target Year Bounding Validation
  [PASS] Scenario: Percentage Bounds Validation
  [PASS] Scenario: Priority Districts Gap Ranking
  [PASS] FastAPI: /health Endpoint
  [PASS] FastAPI: /predict/forecast + SHAP
  [PASS] FastAPI: /predict/anomaly + SHAP
  [PASS] FastAPI: /predict/classify + SHAP
  [PASS] FastAPI: /nlp/query Multilingual API
  [PASS] FastAPI: /scenario/simulate API
  [PASS] FastAPI: /pipeline/clean Scoring
================================================================
>> Results: 28/28 Passed | Test Coverage/Success Rate: 100.0%
================================================================
```

### 2. FastAPI Backend Verification Suite:
- **`30 passed in 8.39s`** (`backend/tests` across auth, AI subsystem, assessments, competencies, recommendations, security).

### 3. Frontend Typecheck & Build:
- `npx tsc --noEmit`: **0 errors**.
- `npm run build`: **Success** (`dist/` generated in 4.24s).

---

## 7. Files Changed / Created

1. `ml_backend/models/scenario.py` `[NEW]`: Policy Scenario & Planning Trajectory Engine.
2. `ml_backend/main.py`: Added `ScenarioSimulateRequest` and `POST /scenario/simulate` endpoint.
3. `ml_backend/tests/test_ml_backend.py`: Added 6 dedicated scenario engine test cases.
4. `ml_backend/tests/run_tests.py`: Updated test runner for scenario verification.
5. `src/services/scenarioService.ts` `[NEW]`: Frontend scenario service with offline client fallback.
6. `src/components/analytics/PolicyScenarioPlanner.tsx` `[NEW]`: Interactive scenario planning UI with native SVG multi-series chart and district gap table.
7. `src/views/StatisticalIntelligenceDashboard.tsx`: Added `Policy Scenario Planner` tab and mounted component.
8. `SCENARIO_PLANNER_IMPLEMENTATION.md` `[NEW]`: Technical documentation.
