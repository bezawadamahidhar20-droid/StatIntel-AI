"""
Data Preprocessing Pipeline for StatIntel-AI ML Microservice.
Performs data cleaning, missing value imputation, outlier detection/capping, and scaling.
"""

from typing import List, Dict, Any, Union
import numpy as np
import pandas as pd


class Preprocessor:
    def __init__(self, clip_quantiles: tuple = (0.01, 0.99)):
        self.clip_quantiles = clip_quantiles
        self.feature_means: Dict[str, float] = {}
        self.feature_stds: Dict[str, float] = {}
        self.fitted: bool = False

    def clean_records(self, records: List[Dict[str, Any]]) -> pd.DataFrame:
        """
        Converts list of dictionary records to clean DataFrame.
        Handles null values, numeric conversions, and whitespace trimming.
        """
        if not records:
            return pd.DataFrame()

        df = pd.DataFrame(records)

        # Trim string columns
        for col in df.select_dtypes(include=["object"]).columns:
            df[col] = df[col].astype(str).str.strip()

        # Convert numeric columns where possible
        for col in df.columns:
            try:
                numeric_series = pd.to_numeric(df[col], errors="coerce")
                if numeric_series.notnull().sum() > 0.5 * len(df):
                    df[col] = numeric_series
            except Exception:
                pass

        # Impute missing values for numeric columns
        for col in df.select_dtypes(include=[np.number]).columns:
            mean_val = df[col].mean()
            if np.isnan(mean_val):
                mean_val = 0.0
            df[col] = df[col].fillna(mean_val)

        return df

    def fit_transform(self, X: np.ndarray) -> np.ndarray:
        """
        Fits mean/std scaling and clips extreme outliers using quantiles.
        """
        X = np.asarray(X, dtype=np.float64)
        if X.ndim == 1:
            X = X.reshape(-1, 1)

        low_q, high_q = self.clip_quantiles
        q_min = np.quantile(X, low_q, axis=0)
        q_max = np.quantile(X, high_q, axis=0)
        X_clipped = np.clip(X, q_min, q_max)

        means = np.mean(X_clipped, axis=0)
        stds = np.std(X_clipped, axis=0)
        stds[stds == 0.0] = 1.0

        self.fitted = True
        return (X_clipped - means) / stds

    def compute_data_quality_score(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Evaluates dataset quality and cleanliness score (0 to 100%).
        """
        if df.empty:
            return {"quality_score": 0.0, "total_rows": 0, "cleanliness_grade": "F"}

        total_cells = df.size
        null_cells = df.isnull().sum().sum()
        duplicate_rows = df.duplicated().sum()

        completeness = max(0.0, (1.0 - (null_cells / total_cells))) * 100
        uniqueness = max(0.0, (1.0 - (duplicate_rows / len(df)))) * 100

        # Weighted quality metric
        overall_score = round(0.6 * completeness + 0.4 * uniqueness, 1)

        grade = "A+" if overall_score >= 95 else "A" if overall_score >= 85 else "B" if overall_score >= 70 else "C"

        return {
            "quality_score": overall_score,
            "completeness_pct": round(completeness, 1),
            "uniqueness_pct": round(uniqueness, 1),
            "total_rows": len(df),
            "total_columns": len(df.columns),
            "missing_values_count": int(null_cells),
            "cleanliness_grade": grade,
        }
