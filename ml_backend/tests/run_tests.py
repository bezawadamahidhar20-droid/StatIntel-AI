"""
Standalone test runner for ml_backend module.
Executes all unit and integration tests and computes test pass metrics (Windows cp1252 safe).
"""

import sys
import os

# Add ml_backend directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from tests.test_ml_backend import (
    test_preprocessor_clean_records,
    test_preprocessor_quality_score,
    test_shap_explainer,
    test_time_series_forecaster,
    test_anomaly_detector,
    test_socio_economic_classifier,
    test_indic_nlp_processor_english,
    test_indic_nlp_processor_hindi,
    test_api_health,
    test_api_predict_forecast,
    test_api_predict_anomaly,
    test_api_predict_classify,
    test_api_nlp_query,
    test_api_clean_pipeline,
)

def run_all():
    tests = [
        ("Preprocessor: Clean Records", test_preprocessor_clean_records),
        ("Preprocessor: Quality Cleanliness Score", test_preprocessor_quality_score),
        ("SHAP Explainer: Top-3 Attribution Vectors", test_shap_explainer),
        ("TimeSeriesForecaster: Prophet/LSTM Forecast", test_time_series_forecaster),
        ("AnomalyDetector: Isolation Forest Outliers", test_anomaly_detector),
        ("Classifier: Socio-Economic Development Tier", test_socio_economic_classifier),
        ("IndicBERT NLP: English Intent & Entity", test_indic_nlp_processor_english),
        ("IndicBERT NLP: Hindi Intent & Entity", test_indic_nlp_processor_hindi),
        ("FastAPI: /health Endpoint", test_api_health),
        ("FastAPI: /predict/forecast + SHAP", test_api_predict_forecast),
        ("FastAPI: /predict/anomaly + SHAP", test_api_predict_anomaly),
        ("FastAPI: /predict/classify + SHAP", test_api_predict_classify),
        ("FastAPI: /nlp/query Intent", test_api_nlp_query),
        ("FastAPI: /pipeline/clean Scoring", test_api_clean_pipeline),
    ]

    print("================================================================")
    print(">> Running StatIntel-AI ML Backend Verification Suite")
    print("================================================================")

    passed = 0
    total = len(tests)

    for name, test_fn in tests:
        try:
            test_fn()
            print(f"  [PASS] {name}")
            passed += 1
        except Exception as e:
            print(f"  [FAIL] {name} -> Error: {e}")

    coverage_pct = round((passed / total) * 100, 1)
    print("================================================================")
    print(f">> Results: {passed}/{total} Passed | Test Coverage/Success Rate: {coverage_pct}%")
    print("================================================================")

    if passed != total:
        sys.exit(1)

if __name__ == "__main__":
    run_all()
