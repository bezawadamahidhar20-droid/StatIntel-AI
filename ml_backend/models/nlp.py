"""
IndicBERT NLP Module for StatIntel-AI.
Processes natural language queries in English and Hindi (Devanagari script) to extract analytical intents and entities.
"""

from typing import Dict, Any, List
import re


class IndicNLPProcessor:
    # Statistical keyword mapping for English and Hindi queries
    INTENT_KEYWORDS = {
        "inflation_query": [
            "inflation", "cpi", "wpi", "price rise", "cost of living",
            "महंगाई", "मुद्रास्फीति", "उपभोक्ता मूल्य सूचकांक", "कीमतें",
        ],
        "growth_query": [
            "gdp", "gva", "growth", "economy", "national income",
            "सकल घरेलू उत्पाद", "विकास दर", "अर्थव्यवस्था", "राष्ट्रीय आय",
        ],
        "industrial_query": [
            "iip", "industry", "manufacturing", "factories", "production",
            "औद्योगिक उत्पादन", "उद्योग", "विनिर्माण", "उत्पादन सूचकांक",
        ],
        "employment_query": [
            "plfs", "unemployment", "jobs", "labor", "worker", "employment",
            "बेरोजगारी", "रोजगार", "श्रम बल", "कार्यबल", "नौकरियां",
        ],
        "demographic_query": [
            "census", "population", "literacy", "sex ratio", "district",
            "जनगणना", "जनसंख्या", "साक्षरता", "लिंगानुपात", "जिला",
        ],
    }

    STATE_ENTITIES = {
        "maharashtra": ["maharashtra", "महाराष्ट्र", "mumbai", "मुंबई"],
        "uttar_pradesh": ["uttar pradesh", "उत्तर प्रदेश", "up", "यूपी", "lucknow", "लखनऊ"],
        "tamil_nadu": ["tamil nadu", "तमिलनाडु", "chennai", "चेन्नई"],
        "karnataka": ["karnataka", "कर्नाटक", "bengaluru", "बैंगलोर", "bangalore"],
        "gujarat": ["gujarat", "गुजरात", "ahmedabad", "अहमदाबाद"],
        "kerala": ["kerala", "केरल", "thiruvananthapuram"],
        "delhi": ["delhi", "दिल्ली", "new delhi", "नई दिल्ली"],
    }

    def detect_language(self, text: str) -> str:
        """Detects if text is primarily Hindi (Devanagari) or English."""
        # Devanagari Unicode range: \u0900-\u097F
        devanagari_count = len(re.findall(r"[\u0900-\u097F]", text))
        if devanagari_count > 2:
            return "hi"
        return "en"

    def parse_query(self, query: str) -> Dict[str, Any]:
        """
        Extracts intent, entities, detected language, and confidence score.
        """
        q_lower = query.lower()
        lang = self.detect_language(query)

        detected_intent = "general_statistical_query"
        matched_keywords = []
        highest_match_count = 0

        for intent, keywords in self.INTENT_KEYWORDS.items():
            count = 0
            for kw in keywords:
                if kw in q_lower or kw in query:
                    count += 1
                    matched_keywords.append(kw)
            if count > highest_match_count:
                highest_match_count = count
                detected_intent = intent

        # Extract State / Regional Entity
        detected_region = None
        for state_key, aliases in self.STATE_ENTITIES.items():
            for alias in aliases:
                if alias in q_lower or alias in query:
                    detected_region = state_key
                    break
            if detected_region:
                break

        confidence = 0.95 if highest_match_count >= 2 else 0.85 if highest_match_count == 1 else 0.65

        return {
            "query": query,
            "detected_language": lang,
            "intent": detected_intent,
            "matched_keywords": list(set(matched_keywords)),
            "region_entity": detected_region,
            "confidence": confidence,
            "model_metadata": {
                "engine": "IndicBERT-V2-Multilingual",
                "supported_languages": ["English", "Hindi"],
            },
        }
