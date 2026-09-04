"""
Comprehensive Test Suite for StatIntel-AI ML Microservice.
Tests:
- Preprocessor & Data Quality scoring
- SHAP Explainer top-3 attribution vectors
- TimeSeriesForecaster (Prophet + LSTM simulation with confidence bands & RMSE)
- AnomalyDetector (Isolation Forest)
- SocioEconomicClassifier (GradientBoosting multi-class)
- IndicNLPProcessor (English & Hindi query parsing)
- FastAPI Endpoints (/health, /predict/forecast, /predict/anomaly, /predict/classify, /nlp/query, /pipeline/clean)
"""

import os
import sys

# Ensure ml_backend is on python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

import pytest
import numpy as np
import pandas as pd

from pipeline.preprocessor import Preprocessor
from explainability.shap_explainer import ShapExplainer
from models.forecasting import TimeSeriesForecaster
from models.anomaly import AnomalyDetector
from models.classifier import SocioEconomicClassifier
from models.nlp import IndicNLPProcessor
from main import (
    health_check,
    predict_forecast,
    predict_anomaly,
    predict_tier,
    parse_nlp_query,
    clean_dataset,
    ForecastRequest,
    AnomalyRequest,
    ClassifyRequest,
    NLPQueryRequest,
    DataQualityRequest,
)


# --- 1. Preprocessor Tests ---

def test_preprocessor_clean_records():
    p = Preprocessor()
    raw = [
        {"name": "  District A ", "val": "100.5", "missing": None},
        {"name": "District B", "val": "120.0", "missing": "50"},
    ]
    df = p.clean_records(raw)
    assert len(df) == 2
    assert df["name"].iloc[0] == "District A"
    assert df["val"].dtype in [np.float64, float]


def test_preprocessor_quality_score():
    p = Preprocessor()
    df = pd.DataFrame({
        "A": [1, 2, 3, None],
        "B": ["x", "y", "x", "z"],
    })
    score_info = p.compute_data_quality_score(df)
    assert 0 <= score_info["quality_score"] <= 100
    assert score_info["total_rows"] == 4
    assert score_info["missing_values_count"] == 1


# --- 2. SHAP Explainer Tests ---

def test_shap_explainer():
    explainer = ShapExplainer(feature_names=["CPI", "IIP", "Repo_Rate"])
    features = np.array([192.0, 154.0, 6.25])
    baseline = np.array([180.0, 140.0, 6.50])

    top3 = explainer.get_top_3_features(features, baseline)
    assert len(top3) == 3
    assert all("feature" in item for item in top3)
    assert all("shap_value" in item for item in top3)
    assert all("impact" in item for item in top3)


# --- 3. Forecasting Tests ---

def test_time_series_forecaster():
    forecaster = TimeSeriesForecaster(horizon=6)
    history = [180.0, 182.5, 185.0, 187.8, 190.2, 192.5]
    res = forecaster.fit_predict(history, periods_ahead=6)

    assert len(res["forecast"]) == 6
    assert res["metrics"]["rmse"] >= 0
    assert res["forecast"][0]["lower_bound"] < res["forecast"][0]["prediction"] < res["forecast"][0]["upper_bound"]


# --- 4. Anomaly Detector Tests ---

def test_anomaly_detector():
    detector = AnomalyDetector(contamination=0.1)
    records = [
        {"id": 1, "cpi": 190.0, "iip": 150.0},
        {"id": 2, "cpi": 191.0, "iip": 151.0},
        {"id": 3, "cpi": 192.0, "iip": 152.0},
        {"id": 4, "cpi": 190.5, "iip": 149.8},
        {"id": 5, "cpi": 191.2, "iip": 150.5},
        {"id": 6, "cpi": 280.0, "iip": 350.0},  # Outlier
    ]
    results = detector.fit_detect(records, feature_keys=["cpi", "iip"])
    assert len(results) == 6
    assert any(r["is_anomaly"] for r in results)


# --- 5. Classifier Tests ---

def test_socio_economic_classifier():
    classifier = SocioEconomicClassifier()
    high_perf = classifier.predict_tier([90.0, 98.0, 80.0, 45.0])
    assert high_perf["tier"] in classifier.CLASSES
    assert 0 <= high_perf["confidence"] <= 1.0
    assert high_perf["metrics"]["training_accuracy"] > 0.85


# --- 6. IndicBERT Multilingual NLP & Structured Query Tests ---

def test_indic_nlp_processor_english_trend():
    nlp = IndicNLPProcessor()
    res = nlp.parse_query("Show literacy trend in Tamil Nadu")
    assert res["detected_language"] == "en"
    assert res["prediction"] in ["trend", "growth"]
    assert res["region_entity"] == "Tamil Nadu"
    assert res["indicator"] == "literacy_rate"
    assert "answer" in res
    assert "structured_query" in res
    assert res["structured_query"]["is_valid"] is True


def test_indic_nlp_processor_english_districts_ranking():
    nlp = IndicNLPProcessor()
    res = nlp.parse_query("Which districts have the highest literacy rate?")
    assert res["detected_language"] == "en"
    assert res["prediction"] in ["ranking", "top_k"]
    assert res["indicator"] == "literacy_rate"
    assert len(res["data_points"]) >= 3
    assert "answer" in res


def test_indic_nlp_processor_english_growth():
    nlp = IndicNLPProcessor()
    res = nlp.parse_query("What was the literacy growth in Tamil Nadu over the last 5 years?")
    assert res["detected_language"] == "en"
    assert res["prediction"] in ["growth", "trend"]
    assert res["region_entity"] == "Tamil Nadu"
    assert res["indicator"] == "literacy_rate"
    assert "80.09%" in res["answer"] or "80.09" in res["answer"]


def test_indic_nlp_processor_hindi_trend():
    nlp = IndicNLPProcessor()
    res = nlp.parse_query("तमिलनाडु में साक्षरता दर दिखाइए")
    assert res["detected_language"] == "hi"
    assert res["indicator"] == "literacy_rate"
    assert res["region_entity"] == "Tamil Nadu"
    assert "साक्षरता" in res["answer"]


def test_indic_nlp_processor_hindi_growth():
    nlp = IndicNLPProcessor()
    res = nlp.parse_query("पिछले 5 साल में तमिलनाडु की साक्षरता दर में कितनी बढ़ोतरी हुई?")
    assert res["detected_language"] == "hi"
    assert res["indicator"] == "literacy_rate"
    assert res["prediction"] in ["growth", "trend"]
    assert "साक्षरता" in res["answer"]


def test_indic_nlp_processor_tamil_lookup():
    nlp = IndicNLPProcessor()
    res = nlp.parse_query("தமிழ்நாட்டின் கல்வியறிவு விகிதத்தை காட்டுங்கள்")
    assert res["detected_language"] == "ta"
    assert res["indicator"] == "literacy_rate"
    assert res["region_entity"] == "Tamil Nadu"
    assert "கல்வியறிவு" in res["answer"]


def test_indic_nlp_processor_tamil_districts_ranking():
    nlp = IndicNLPProcessor()
    res = nlp.parse_query("தமிழ்நாட்டில் அதிக கல்வியறிவு விகிதம் கொண்ட மாவட்டங்கள் எவை?")
    assert res["detected_language"] == "ta"
    assert res["indicator"] == "literacy_rate"
    assert res["prediction"] in ["ranking", "top_k"]
    assert "கல்வியறிவு" in res["answer"]


def test_indic_nlp_processor_unknown_indicator():
    nlp = IndicNLPProcessor()
    res = nlp.parse_query("What is the average rainfall in Tamil Nadu?")
    assert res["structured_query"]["is_valid"] is False
    assert res["prediction"] == "clarification_needed"
    assert "clarify" in res["answer"].lower() or "unsupported" in res["answer"].lower() or "statistical indicator" in res["answer"].lower()


def test_indic_nlp_processor_empty_query():
    nlp = IndicNLPProcessor()
    res = nlp.parse_query("")
    assert res["structured_query"]["is_valid"] is False
    assert res["prediction"] == "clarification_needed"



# --- 7. FastAPI Route Handler Tests ---

def test_api_health():
    res = health_check()
    assert res["status"] == "online"
    assert len(res["models_loaded"]) >= 4


def test_api_predict_forecast():
    req = ForecastRequest(
        series_name="CPI_Combined",
        historical_values=[188.0, 189.2, 190.4, 191.8, 192.6, 193.4],
        periods_ahead=4,
    )
    res = predict_forecast(req)
    assert "prediction" in res
    assert "confidence_score" in res
    assert "shap_explanation" in res
    assert "model_metrics" in res
    assert len(res["shap_explanation"]) <= 3


def test_api_predict_anomaly():
    req = AnomalyRequest(
        records=[
            {"name": "MH", "val": 100},
            {"name": "KA", "val": 102},
            {"name": "TN", "val": 101},
            {"name": "DL", "val": 103},
            {"name": "UP", "val": 102},
            {"name": "X", "val": 450},
        ],
        feature_keys=["val"],
    )
    res = predict_anomaly(req)
    assert "anomaly_count" in res
    assert "shap_explanation" in res


def test_api_predict_classify():
    req = ClassifyRequest(
        district_name="Pune",
        literacy_rate=86.15,
        sex_ratio=915.0,
        urbanization_rate=60.9,
        worker_participation_rate=41.2,
    )
    res = predict_tier(req)
    assert res["prediction"] in ["Aspirational", "Developing", "High-Performing"]
    assert len(res["shap_explanation"]) == 3


def test_api_nlp_query_endpoint():
    req = NLPQueryRequest(query="Analyze IIP manufacturing trends in Gujarat")
    res = parse_nlp_query(req)
    assert res["prediction"] in ["trend", "growth", "point_lookup"]
    assert res["region_entity"] == "Gujarat"
    assert res["indicator"] == "iip_growth"
    assert "answer" in res
    assert res["structured_query"]["is_valid"] is True



def test_api_clean_pipeline():
    req = DataQualityRequest(
        records=[
            {"state": "Maharashtra", "gdp": "4200000", "growth": 8.1},
            {"state": "Tamil Nadu", "gdp": "2800000", "growth": 7.9},
        ]
    )
    res = clean_dataset(req)
    assert "quality_metrics" in res
    assert res["quality_metrics"]["quality_score"] > 80

