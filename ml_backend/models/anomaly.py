"""
Isolation Forest Anomaly Detection Model for StatIntel-AI.
Detects statistical deviations, regional outliers, and unexpected metric surges.
"""

from typing import List, Dict, Any
import numpy as np
from sklearn.ensemble import IsolationForest


class AnomalyDetector:
    def __init__(self, contamination: float = 0.08, random_state: int = 42):
        self.contamination = contamination
        self.random_state = random_state
        self.model = IsolationForest(
            contamination=contamination,
            random_state=random_state,
            n_estimators=100,
        )
        self.is_fitted = False

    def fit_detect(
        self,
        records: List[Dict[str, Any]],
        feature_keys: List[str],
    ) -> List[Dict[str, Any]]:
        """
        Fits Isolation Forest on multidimensional tabular indicators.
        Returns scored anomalies with severity level and outlier score (-1 to 1).
        """
        if not records or not feature_keys:
            return []

        # Extract numeric matrix
        X = []
        for r in records:
            row = [float(r.get(k, 0.0) or 0.0) for k in feature_keys]
            X.append(row)

        X = np.array(X, dtype=np.float64)

        if len(X) < 5:
            # Not enough samples for robust isolation forest; use z-score heuristic
            means = np.mean(X, axis=0)
            stds = np.std(X, axis=0)
            stds[stds == 0] = 1.0
            z_scores = np.max(np.abs((X - means) / stds), axis=1)

            results = []
            for idx, r in enumerate(records):
                is_anom = bool(z_scores[idx] > 2.2)
                score = float(z_scores[idx])
                severity = "Critical" if score > 3.0 else "Warning" if score > 2.2 else "Normal"
                results.append({
                    **r,
                    "is_anomaly": is_anom,
                    "anomaly_score": round(score, 3),
                    "severity": severity,
                })
            return results

        # Fit Isolation Forest
        self.model.fit(X)
        self.is_fitted = True

        predictions = self.model.predict(X)  # -1 for anomaly, 1 for inlier
        decision_scores = self.model.decision_function(X)  # lower = more anomalous

        results = []
        for idx, r in enumerate(records):
            is_anom = bool(predictions[idx] == -1)
            raw_score = float(decision_scores[idx])
            # Normalize decision score to positive deviation scale
            norm_score = round(max(0.0, -raw_score * 2.5), 3)

            if is_anom and norm_score > 0.4:
                severity = "Critical"
            elif is_anom:
                severity = "Warning"
            else:
                severity = "Normal"

            results.append({
                **r,
                "is_anomaly": is_anom,
                "anomaly_score": norm_score,
                "severity": severity,
            })

        return results
