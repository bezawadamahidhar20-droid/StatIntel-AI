"""
Counterfactual & Explainable AI (XAI) Engine for StatIntel-AI.
Combines empirical SHAP local feature attribution with model-backed counterfactual perturbation search.

Scientific Integrity Guarantee:
Feature contributions describe how the model arrived at its prediction; they do not establish causation.
Counterfactual results show what the model predicts under changed inputs. They are not causal policy impact estimates.
"""

from typing import List, Dict, Any, Optional
import numpy as np
from models.classifier import SocioEconomicClassifier
from explainability.shap_explainer import ShapExplainer


class CounterfactualEngine:
    FEATURE_SPECS = [
        {"name": "Literacy_Rate", "display": "Literacy Rate (%)", "min": 0.0, "max": 100.0, "step": 0.5, "unit": "%"},
        {"name": "Sex_Ratio", "display": "Sex Ratio (Females/1000 Males)", "min": 600.0, "max": 1150.0, "step": 5.0, "unit": "F/1000M", "scale_divisor": 10.0},
        {"name": "Urbanization_Pct", "display": "Urbanization Rate (%)", "min": 0.0, "max": 100.0, "step": 1.0, "unit": "%"},
        {"name": "Worker_Participation_Pct", "display": "Worker Participation Rate (%)", "min": 10.0, "max": 75.0, "step": 0.5, "unit": "%"},
    ]

    BASELINE_VECTOR = [75.0, 92.0, 45.0, 38.0]

    def __init__(self):
        self.classifier = SocioEconomicClassifier()
        self.shap_explainer = ShapExplainer(feature_names=[s["display"] for s in self.FEATURE_SPECS])

    def explain_prediction(
        self,
        literacy_rate: float,
        sex_ratio: float,
        urbanization_rate: float,
        worker_participation_rate: float,
        district_name: str = "District_Sample",
    ) -> Dict[str, Any]:
        """
        Computes model prediction and local SHAP feature attribution vectors.
        """
        # Feature vector for classifier: [lit, sex_ratio / 10, urb, worker]
        raw_features = [literacy_rate, sex_ratio, urbanization_rate, worker_participation_rate]
        scaled_features = [literacy_rate, sex_ratio / 10.0, urbanization_rate, worker_participation_rate]

        pred_res = self.classifier.predict_tier(scaled_features)

        # Compute SHAP local attributions relative to empirical baseline
        shap_factors = self.shap_explainer.compute_local_shap(
            features=np.array(scaled_features),
            baseline_features=np.array(self.BASELINE_VECTOR),
            feature_names=[s["display"] for s in self.FEATURE_SPECS],
        )

        return {
            "district_name": district_name,
            "prediction": pred_res["tier"],
            "tier_index": pred_res["tier_index"],
            "confidence": pred_res["confidence"],
            "class_probabilities": pred_res["class_probabilities"],
            "input_features": {
                "literacy_rate": literacy_rate,
                "sex_ratio": sex_ratio,
                "urbanization_rate": urbanization_rate,
                "worker_participation_rate": worker_participation_rate,
            },
            "contributing_factors": shap_factors,
            "top_drivers": shap_factors[:3],
            "model_metrics": pred_res["metrics"],
            "scientific_disclaimer": "Feature contributions describe how the model arrived at its prediction; they do not establish causation.",
        }

    def generate_counterfactuals(
        self,
        literacy_rate: float,
        sex_ratio: float,
        urbanization_rate: float,
        worker_participation_rate: float,
        target_tier: Optional[str] = None,
        district_name: str = "District_Sample",
    ) -> Dict[str, Any]:
        """
        Searches bounded, feasible feature perturbations that shift the classifier prediction to the target tier.
        Generates 3 transparent alternatives: Minimal Change, Balanced Change, and Strong Change.
        """
        # 1. Validate Feature Bounds
        if not (0.0 <= literacy_rate <= 100.0):
            raise ValueError(f"Literacy rate {literacy_rate}% is out of valid bounds (0-100%).")
        if not (500.0 <= sex_ratio <= 1200.0):
            raise ValueError(f"Sex ratio {sex_ratio} is out of valid bounds (500-1200).")
        if not (0.0 <= urbanization_rate <= 100.0):
            raise ValueError(f"Urbanization rate {urbanization_rate}% is out of valid bounds (0-100%).")
        if not (0.0 <= worker_participation_rate <= 100.0):
            raise ValueError(f"Worker participation {worker_participation_rate}% is out of valid bounds (0-100%).")

        raw_curr = [literacy_rate, sex_ratio, urbanization_rate, worker_participation_rate]
        curr_scaled = [literacy_rate, sex_ratio / 10.0, urbanization_rate, worker_participation_rate]

        curr_pred = self.classifier.predict_tier(curr_scaled)
        curr_tier = curr_pred["tier"]
        curr_tier_idx = curr_pred["tier_index"]

        # Determine target tier (default to next higher development tier)
        if target_tier:
            if target_tier not in self.classifier.CLASSES:
                raise ValueError(f"Target tier '{target_tier}' unsupported. Choose from: {self.classifier.CLASSES}")
            desired_tier = target_tier
        else:
            desired_tier = self.classifier.CLASSES[min(2, curr_tier_idx + 1)]

        desired_idx = self.classifier.CLASSES.index(desired_tier)

        if desired_idx == curr_tier_idx:
            # Already in target tier
            return {
                "success": True,
                "current_prediction": curr_tier,
                "target_prediction": desired_tier,
                "is_already_target": True,
                "message": f"District '{district_name}' is already categorized as {curr_tier}.",
                "options": [],
                "disclaimer": "Counterfactual results show what the model predicts under changed inputs. They are not causal policy impact estimates.",
            }

        # 2. Search Counterfactual Options
        options = []

        # Option A: Minimal Targeted Change (single most responsive feature)
        best_single = None
        min_single_cost = float("inf")

        # Check Literacy Boost
        for delta_lit in np.arange(1.0, 20.0, 0.5):
            new_lit = min(100.0, literacy_rate + delta_lit)
            test_vec = [new_lit, sex_ratio / 10.0, urbanization_rate, worker_participation_rate]
            p = self.classifier.predict_tier(test_vec)
            if p["tier_index"] >= desired_idx:
                best_single = {
                    "type": "Minimal Single-Factor Change",
                    "description": f"Targeted increase in Literacy Rate to reach {desired_tier}",
                    "counterfactual_prediction": p["tier"],
                    "confidence": p["confidence"],
                    "changes": [
                        {
                            "feature": "Literacy Rate (%)",
                            "current_value": literacy_rate,
                            "counterfactual_value": round(new_lit, 2),
                            "change": round(delta_lit, 2),
                            "unit": "%",
                        }
                    ],
                    "feasibility": "High Feasibility (Single Target Lever)",
                }
                break

        if best_single:
            options.append(best_single)

        # Option B: Balanced Multi-Factor Change
        best_balanced = None
        for factor in [1.0, 1.25, 1.5, 1.75, 2.0]:
            b_lit = min(100.0, round(literacy_rate + 3.0 * factor, 2))
            b_sex = min(1100.0, round(sex_ratio + 15.0 * factor, 1))
            b_urb = min(100.0, round(urbanization_rate + 4.0 * factor, 2))
            b_work = min(65.0, round(worker_participation_rate + 1.5 * factor, 2))

            test_vec = [b_lit, b_sex / 10.0, b_urb, b_work]
            p = self.classifier.predict_tier(test_vec)
            if p["tier_index"] >= desired_idx:
                best_balanced = {
                    "type": "Balanced Multi-Factor Change",
                    "description": f"Synergistic moderate adjustments across education, sex ratio, and urban development",
                    "counterfactual_prediction": p["tier"],
                    "confidence": p["confidence"],
                    "changes": [
                        {"feature": "Literacy Rate (%)", "current_value": literacy_rate, "counterfactual_value": b_lit, "change": round(b_lit - literacy_rate, 2), "unit": "%"},
                        {"feature": "Sex Ratio (F/1000M)", "current_value": sex_ratio, "counterfactual_value": b_sex, "change": round(b_sex - sex_ratio, 1), "unit": "F/1000M"},
                        {"feature": "Urbanization Rate (%)", "current_value": urbanization_rate, "counterfactual_value": b_urb, "change": round(b_urb - urbanization_rate, 2), "unit": "%"},
                        {"feature": "Worker Participation Rate (%)", "current_value": worker_participation_rate, "counterfactual_value": b_work, "change": round(b_work - worker_participation_rate, 2), "unit": "%"},
                    ],
                    "feasibility": "Moderate Feasibility (Broad Development)",
                }
                break

        if best_balanced:
            options.append(best_balanced)

        # Option C: Comprehensive High-Confidence Change
        c_lit = min(98.0, round(max(literacy_rate + 6.0, 88.0), 2))
        c_sex = min(1050.0, round(max(sex_ratio + 25.0, 960.0), 1))
        c_urb = min(90.0, round(max(urbanization_rate + 10.0, 65.0), 2))
        c_work = min(60.0, round(max(worker_participation_rate + 3.5, 42.0), 2))

        c_vec = [c_lit, c_sex / 10.0, c_urb, c_work]
        c_p = self.classifier.predict_tier(c_vec)
        options.append({
            "type": "Comprehensive Acceleration Change",
            "description": f"High-conviction development transformation achieving {c_p['tier']} status",
            "counterfactual_prediction": c_p["tier"],
            "confidence": c_p["confidence"],
            "changes": [
                {"feature": "Literacy Rate (%)", "current_value": literacy_rate, "counterfactual_value": c_lit, "change": round(c_lit - literacy_rate, 2), "unit": "%"},
                {"feature": "Sex Ratio (F/1000M)", "current_value": sex_ratio, "counterfactual_value": c_sex, "change": round(c_sex - sex_ratio, 1), "unit": "F/1000M"},
                {"feature": "Urbanization Rate (%)", "current_value": urbanization_rate, "counterfactual_value": c_urb, "change": round(c_urb - urbanization_rate, 2), "unit": "%"},
                {"feature": "Worker Participation Rate (%)", "current_value": worker_participation_rate, "counterfactual_value": c_work, "change": round(c_work - worker_participation_rate, 2), "unit": "%"},
            ],
            "feasibility": "Transformational (Multi-Year Program)",
        })

        return {
            "success": True,
            "district_name": district_name,
            "current_prediction": curr_tier,
            "current_confidence": curr_pred["confidence"],
            "target_prediction": desired_tier,
            "options": options,
            "disclaimer": "Counterfactual results show what the model predicts under changed inputs. They are not causal policy impact estimates.",
        }
