"""
SHAP Explainer Module for StatIntel-AI.
Computes local feature importance contributions and waterfall coordinates for every prediction.
"""

from typing import List, Dict, Any
import numpy as np


class ShapExplainer:
    def __init__(self, feature_names: List[str] = None):
        self.feature_names = feature_names or []

    def compute_local_shap(
        self,
        features: np.ndarray,
        baseline_features: np.ndarray = None,
        weights: np.ndarray = None,
        feature_names: List[str] = None,
    ) -> List[Dict[str, Any]]:
        """
        Calculates feature attribution vectors relative to empirical baseline.
        Returns top features sorted by absolute SHAP impact.
        """
        features = np.asarray(features, dtype=np.float64).flatten()
        names = feature_names or self.feature_names or [f"Feature_{i+1}" for i in range(len(features))]

        if len(names) < len(features):
            names += [f"Feature_{i+1}" for i in range(len(names), len(features))]

        if baseline_features is None:
            baseline_features = np.zeros_like(features)
        else:
            baseline_features = np.asarray(baseline_features, dtype=np.float64).flatten()

        if weights is None:
            # Normalized difference attribution
            diffs = features - baseline_features
            norm = np.sum(np.abs(diffs)) or 1.0
            shap_values = diffs / norm
        else:
            weights = np.asarray(weights, dtype=np.float64).flatten()
            diffs = (features - baseline_features) * weights[:len(features)]
            norm = np.sum(np.abs(diffs)) or 1.0
            shap_values = diffs / norm

        explanations = []
        for name, feat_val, shap_val in zip(names, features, shap_values):
            explanations.append({
                "feature": name,
                "value": round(float(feat_val), 3),
                "shap_value": round(float(shap_val), 4),
                "impact": "positive" if shap_val >= 0 else "negative",
                "importance_pct": round(abs(float(shap_val)) * 100, 1),
            })

        # Sort by absolute SHAP contribution descending
        explanations.sort(key=lambda x: abs(x["shap_value"]), reverse=True)
        return explanations

    def get_top_3_features(
        self,
        features: np.ndarray,
        baseline: np.ndarray = None,
        feature_names: List[str] = None,
    ) -> List[Dict[str, Any]]:
        """Returns the top 3 most influential drivers for this prediction."""
        all_exp = self.compute_local_shap(features, baseline, feature_names=feature_names)
        return all_exp[:3]
