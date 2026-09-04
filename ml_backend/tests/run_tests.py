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
    test_indic_nlp_processor_english_trend,
    test_indic_nlp_processor_english_districts_ranking,
    test_indic_nlp_processor_english_growth,
    test_indic_nlp_processor_hindi_trend,
    test_indic_nlp_processor_hindi_growth,
    test_indic_nlp_processor_tamil_lookup,
    test_indic_nlp_processor_tamil_districts_ranking,
    test_indic_nlp_processor_unknown_indicator,
    test_indic_nlp_processor_empty_query,
    test_scenario_engine_valid_simulation,
    test_scenario_engine_invalid_geography,
    test_scenario_engine_invalid_indicator,
    test_scenario_engine_target_year_out_of_range,
    test_scenario_engine_target_value_out_of_bounds,
    test_scenario_engine_priority_districts_ranking,
    test_api_health,
    test_api_predict_forecast,
    test_api_predict_anomaly,
    test_api_predict_classify,
    test_api_nlp_query_endpoint,
    test_api_scenario_simulate_endpoint,
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
        ("NLP: English Literacy Trend", test_indic_nlp_processor_english_trend),
        ("NLP: English District Ranking", test_indic_nlp_processor_english_districts_ranking),
        ("NLP: English 5-Yr Growth", test_indic_nlp_processor_english_growth),
        ("NLP: Hindi Literacy Trend", test_indic_nlp_processor_hindi_trend),
        ("NLP: Hindi 5-Yr Growth", test_indic_nlp_processor_hindi_growth),
        ("NLP: Tamil Literacy Lookup", test_indic_nlp_processor_tamil_lookup),
        ("NLP: Tamil District Ranking", test_indic_nlp_processor_tamil_districts_ranking),
        ("NLP: Unknown Indicator Clarification", test_indic_nlp_processor_unknown_indicator),
        ("NLP: Empty Query Clarification", test_indic_nlp_processor_empty_query),
        ("Scenario: Valid Target Trajectory Simulation", test_scenario_engine_valid_simulation),
        ("Scenario: Invalid Geography Validation", test_scenario_engine_invalid_geography),
        ("Scenario: Invalid Indicator Validation", test_scenario_engine_invalid_indicator),
        ("Scenario: Target Year Bounding Validation", test_scenario_engine_target_year_out_of_range),
        ("Scenario: Percentage Bounds Validation", test_scenario_engine_target_value_out_of_bounds),
        ("Scenario: Priority Districts Gap Ranking", test_scenario_engine_priority_districts_ranking),
        ("FastAPI: /health Endpoint", test_api_health),
        ("FastAPI: /predict/forecast + SHAP", test_api_predict_forecast),
        ("FastAPI: /predict/anomaly + SHAP", test_api_predict_anomaly),
        ("FastAPI: /predict/classify + SHAP", test_api_predict_classify),
        ("FastAPI: /nlp/query Multilingual API", test_api_nlp_query_endpoint),
        ("FastAPI: /scenario/simulate API", test_api_scenario_simulate_endpoint),
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
            print(f"  [FAIL] {name} -> Error: {type(e).__name__}: {e}")

    coverage_pct = round((passed / total) * 100, 1)
    print("================================================================")
    print(f">> Results: {passed}/{total} Passed | Test Coverage/Success Rate: {coverage_pct}%")
    print("================================================================")

    if passed != total:
        sys.exit(1)

if __name__ == "__main__":
    run_all()

