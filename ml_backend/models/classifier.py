"""
Multi-Class Classifier Module for StatIntel-AI.
Categorizes districts / states into development tiers (Aspirational, Developing, High-Performing).
"""

from typing import List, Dict, Any, Tuple
import numpy as np
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import accuracy_score, f1_score


class SocioEconomicClassifier:
    CLASSES = ["Aspirational", "Developing", "High-Performing"]

    def __init__(self, random_state: int = 42):
        self.model = GradientBoostingClassifier(
            n_estimators=50,
            learning_rate=0.1,
            max_depth=3,
            random_state=random_state,
        )
        self.accuracy = 0.934
        self.f1_macro = 0.928
        self._is_trained = False
        self._init_benchmark_model()

    def _init_benchmark_model(self):
        """Pre-trains model on benchmark district socio-economic synthetic vectors."""
        np.random.seed(42)
        # Features: [Literacy Rate, Sex Ratio / 10, Urbanization %, Worker Participation %]
        X_aspirational = np.random.normal(loc=[68.0, 89.0, 22.0, 32.0], scale=[4.0, 2.0, 5.0, 3.0], size=(40, 4))
        X_developing = np.random.normal(loc=[78.0, 93.0, 48.0, 39.0], scale=[3.0, 1.5, 6.0, 2.5], size=(40, 4))
        X_leader = np.random.normal(loc=[88.0, 97.0, 75.0, 44.0], scale=[3.0, 1.0, 7.0, 2.0], size=(40, 4))

        X = np.vstack([X_aspirational, X_developing, X_leader])
        y = np.array([0] * 40 + [1] * 40 + [2] * 40)

        self.model.fit(X, y)
        preds = self.model.predict(X)
        self.accuracy = round(float(accuracy_score(y, preds)), 3)
        self.f1_macro = round(float(f1_score(y, preds, average="macro")), 3)
        self._is_trained = True

    def predict_tier(self, feature_vector: List[float]) -> Dict[str, Any]:
        """
        Predicts socio-economic classification tier with probability distribution.
        """
        X = np.asarray(feature_vector, dtype=np.float64).reshape(1, -1)
        pred_idx = int(self.model.predict(X)[0])
        probabilities = self.model.predict_proba(X)[0]

        tier_name = self.CLASSES[pred_idx]
        confidence = float(probabilities[pred_idx])

        return {
            "tier": tier_name,
            "tier_index": pred_idx,
            "confidence": round(confidence, 3),
            "class_probabilities": {
                name: round(float(prob), 3) for name, prob in zip(self.CLASSES, probabilities)
            },
            "metrics": {
                "model_name": "GradientBoosting-XGB-Classifier",
                "training_accuracy": self.accuracy,
                "f1_score": self.f1_macro,
            },
        }
