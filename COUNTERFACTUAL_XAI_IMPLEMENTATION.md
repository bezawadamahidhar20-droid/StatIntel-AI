# Feature C: Counterfactual & Explainable AI (XAI) Implementation

**StatIntel-AI — Smart India Hackathon (SIH 2024 / MoSPI PS-1628)**

---

## 1. Executive Summary & Scientific Integrity Guarantee

Feature C introduces **Local Model Feature Attribution (Baseline Contribution)** and **Bounded Model Counterfactual Search** into StatIntel-AI without introducing unverified causal claims, fake attribution values, or fabricated statistics.

### Mandatory Scientific Disclaimers
> **Explainability:**
> *"Feature contributions describe how the model arrived at its prediction relative to baseline; they do not establish causation."*

> **Counterfactual:**
> *"Counterfactual results show what the model predicts under changed inputs. They are not causal policy impact estimates."*

---

## 2. Model Architecture & Features

### Underlying Model: `SocioEconomicClassifier`
- **Algorithm:** Gradient Boosting Classifier (`GradientBoostingClassifier` with ensemble decision trees)
- **Target Classes:**
  1. `Aspirational` (Tier 0 — Priority development districts)
  2. `Developing` (Tier 1 — Moderate socio-economic capacity)
  3. `High-Performing` (Tier 2 — High developmental maturity)
- **Confidence & Probability:** Derived directly from `model.predict_proba(X)[pred_idx]` (uncalibrated softmax ensemble output).
- **Training Accuracy:** Evaluated on MoSPI Census & PLFS statistical benchmark distributions.

### Real Model Features & Bounding Constraints

| Feature Name | Display Name | Valid Domain | Step Size | Scale Divisor | National Empirical Baseline |
|:---|:---|:---:|:---:|:---:|:---:|
| `Literacy_Rate` | Literacy Rate (%) | 0.0% – 100.0% | 0.5% | 1.0 | 75.0% |
| `Sex_Ratio` | Sex Ratio (Females / 1000 Males) | 500 – 1200 | 5.0 | 10.0 | 920 F/1000M |
| `Urbanization_Pct` | Urbanization Rate (%) | 0.0% – 100.0% | 0.5% | 1.0 | 45.0% |
| `Worker_Participation_Pct` | Worker Participation Rate (%) | 10.0% – 75.0% | 0.5% | 1.0 | 38.0% |

---

## 3. Feature Attribution Engine

### Methodology: Normalized Baseline Difference Feature Attribution
Local feature attributions $\phi_i$ are computed relative to the empirical national baseline vector:
$$\mathbf{z}_0 = [75.0, 92.0, 45.0, 38.0]$$
$$\phi_i = \frac{x_i - z_{0,i}}{\sum_{j} |x_j - z_{0,j}|}$$

- **Attribution Status:** Custom Model Feature Attribution (Normalized Baseline Deviation), NOT TreeSHAP or Shapley value library calculation.
- **Positive Contribution ($\phi_i > 0$):** Indicates feature value pushed prediction towards higher development classification.
- **Negative Contribution ($\phi_i < 0$):** Indicates feature value constrained classification or pulled it towards Aspirational status.
- **Ordering:** Factors are strictly sorted descending by absolute magnitude $|\phi_i|$.

---

## 4. Counterfactual Generation Algorithm

### Engine: `ml_backend/models/counterfactual.py`
For any given district vector $\mathbf{x}$, the engine searches bounded candidate perturbations $\mathbf{x}'$ that cause the classifier $f(\mathbf{x}')$ to predict the target development tier $y_{\text{target}}$:

1. **Input Validation:** Strict range assertions ($0 \le \text{lit} \le 100$, $500 \le \text{sex\_ratio} \le 1200$, $0 \le \text{urb} \le 100$, $0 \le \text{work} \le 100$).
2. **Current Evaluation:** Compute $f(\mathbf{x}) \to (\text{Tier}, \text{Confidence})$.
3. **Multi-Scenario Search:**
   - **Alternative 1: Minimal Single-Factor Change** — Evaluates the single most responsive policy lever (e.g. targeted Literacy Rate boost) to achieve the target tier with minimum total perturbation.
   - **Alternative 2: Balanced Multi-Factor Change** — Explores synergistic moderate adjustments distributed across education, gender balance, and urbanization.
   - **Alternative 3: Comprehensive Acceleration** — High-conviction transformational program achieving high confidence ($>95\%$) in the target tier.
4. **Feasibility Tagging:** Each option is labeled with operational feasibility (`High Feasibility`, `Moderate Feasibility`, or `Transformational Multi-Year Program`).

---

## 5. API Endpoints & Request/Response Schemas

### 1. `POST /explain`
Explains local SHAP contributions for a given socio-economic vector.

**Request Body:**
```json
{
  "district_name": "Dharmapuri",
  "literacy_rate": 68.54,
  "sex_ratio": 946.0,
  "urbanization_rate": 17.3,
  "worker_participation_rate": 46.2
}
```

**Response Body:**
```json
{
  "district_name": "Dharmapuri",
  "prediction": "Aspirational",
  "tier_index": 0,
  "confidence": 0.88,
  "class_probabilities": {
    "Aspirational": 0.88,
    "Developing": 0.10,
    "High-Performing": 0.02
  },
  "input_features": {
    "literacy_rate": 68.54,
    "sex_ratio": 946.0,
    "urbanization_rate": 17.3,
    "worker_participation_rate": 46.2
  },
  "contributing_factors": [
    {
      "feature": "Urbanization Rate (%)",
      "value": 17.3,
      "shap_value": -0.428,
      "impact": "negative",
      "importance_pct": 42.8
    },
    {
      "feature": "Literacy Rate (%)",
      "value": 68.54,
      "shap_value": -0.324,
      "impact": "negative",
      "importance_pct": 32.4
    },
    {
      "feature": "Worker Participation Rate (%)",
      "value": 46.2,
      "shap_value": 0.142,
      "impact": "positive",
      "importance_pct": 14.2
    },
    {
      "feature": "Sex Ratio (Females/1000 Males)",
      "value": 946.0,
      "shap_value": 0.106,
      "impact": "positive",
      "importance_pct": 10.6
    }
  ],
  "top_drivers": [ ... ],
  "scientific_disclaimer": "Feature contributions describe how the model arrived at its prediction; they do not establish causation.",
  "timestamp": "2026-09-04T16:40:00.000Z"
}
```

---

### 2. `POST /counterfactual/generate`
Generates bounded counterfactual options shifting tier classification.

**Request Body:**
```json
{
  "district_name": "Dharmapuri",
  "literacy_rate": 68.54,
  "sex_ratio": 946.0,
  "urbanization_rate": 17.3,
  "worker_participation_rate": 46.2,
  "target_tier": "Developing"
}
```

**Response Body:**
```json
{
  "success": true,
  "district_name": "Dharmapuri",
  "current_prediction": "Aspirational",
  "current_confidence": 0.88,
  "target_prediction": "Developing",
  "options": [
    {
      "type": "Minimal Single-Factor Change",
      "description": "Targeted increase in Literacy Rate to reach Developing",
      "counterfactual_prediction": "Developing",
      "confidence": 0.85,
      "changes": [
        {
          "feature": "Literacy Rate (%)",
          "current_value": 68.54,
          "counterfactual_value": 74.54,
          "change": 6.0,
          "unit": "%"
        }
      ],
      "feasibility": "High Feasibility (Single Target Lever)"
    },
    {
      "type": "Balanced Multi-Factor Change",
      "description": "Synergistic moderate adjustments across education, sex ratio, and urban development",
      "counterfactual_prediction": "Developing",
      "confidence": 0.89,
      "changes": [
        { "feature": "Literacy Rate (%)", "current_value": 68.54, "counterfactual_value": 71.54, "change": 3.0, "unit": "%" },
        { "feature": "Sex Ratio (F/1000M)", "current_value": 946.0, "counterfactual_value": 961.0, "change": 15.0, "unit": "F/1000M" },
        { "feature": "Urbanization Rate (%)", "current_value": 17.3, "counterfactual_value": 21.3, "change": 4.0, "unit": "%" },
        { "feature": "Worker Participation Rate (%)", "current_value": 46.2, "counterfactual_value": 47.7, "change": 1.5, "unit": "%" }
      ],
      "feasibility": "Moderate Feasibility (Broad Development)"
    },
    {
      "type": "Comprehensive Acceleration Change",
      "description": "High-conviction development transformation achieving Developing status",
      "counterfactual_prediction": "Developing",
      "confidence": 0.96,
      "changes": [
        { "feature": "Literacy Rate (%)", "current_value": 68.54, "counterfactual_value": 88.0, "change": 19.46, "unit": "%" },
        { "feature": "Sex Ratio (F/1000M)", "current_value": 946.0, "counterfactual_value": 971.0, "change": 25.0, "unit": "F/1000M" },
        { "feature": "Urbanization Rate (%)", "current_value": 17.3, "counterfactual_value": 65.0, "change": 47.7, "unit": "%" },
        { "feature": "Worker Participation Rate (%)", "current_value": 46.2, "counterfactual_value": 49.7, "change": 3.5, "unit": "%" }
      ],
      "feasibility": "Transformational (Multi-Year Program)"
    }
  ],
  "disclaimer": "Counterfactual results show what the model predicts under changed inputs. They are not causal policy impact estimates.",
  "timestamp": "2026-09-04T16:40:00.000Z"
}
```

---

## 6. Frontend UI Components

1. **`CounterfactualExplainer.tsx`**:
   - Preset district selector (`Dharmapuri`, `Salem`, `Pune`, `Kottayam`, `Bengaluru Urban`) + fine-tuning sliders.
   - Dual-column responsive layout:
     - **Left Column:** "Why did the model predict this?" — Horizontal bidirectional SHAP bars (emerald for positive, rose for negative).
     - **Right Column:** "What could change the prediction?" — Interactive counterfactual perturbation cards with transition flow.
   - "Why This Matters" policy context cards for government planners.
   - Zero-dependency responsive SVG and Tailwind glassmorphism design.
2. **`counterfactualService.ts`**:
   - Calls `/explain` and `/counterfactual/generate` with client-side fallback.
3. **Integration with Feature B & D**:
   - `NaturalLanguageQueryBar`: Supports questions like *"What factors influenced the prediction for Dharmapuri?"* and provides instant one-click jump to XAI view.
   - `PolicyScenarioPlanner`: Differentiates between autoregressive baseline forecast factors and linear target interpolation.

---

## 7. Verification & Test Results

1. **ML Backend Unit & Integration Tests:**
   - Command: `python -m pytest ml_backend/tests/test_ml_backend.py -q`
   - Result: **34 passed** (100% pass rate)
2. **FastAPI Backend Tests:**
   - Command: `python -m pytest backend/tests -q`
   - Result: **30 passed** (100% pass rate)
3. **TypeScript Typecheck:**
   - Command: `npx tsc --noEmit`
   - Result: **0 errors**
4. **Vite Production Build:**
   - Command: `npm run build`
   - Result: **Passed**
