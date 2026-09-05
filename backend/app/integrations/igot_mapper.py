from typing import Any, Dict, List
from app.core.config import settings

PORTAL_TOC = "https://portal.igotkarmayogi.gov.in/app/toc/{cid}/overview"

# iGOT competency label -> StatIntel competency framework key
COMPETENCY_ALIASES = {
    "data analysis": "Statistical Data Analysis",
    "data analytics": "Statistical Data Analysis",
    "python": "Python for Statistical & Microdata Analytics",
    "r programming": "R for Statistical Computing",
    "sql": "SQL & Database Querying",
    "gis": "GIS & Spatial Statistics",
    "machine learning": "AI/ML for Official Statistics",
    "artificial intelligence": "AI/ML for Official Statistics",
    "survey": "Survey Design & Sampling",
    "sampling": "Survey Design & Sampling",
    "national accounts": "National Accounts Statistics",
    "price statistics": "Price Statistics (CPI/WPI)",
    "labour": "Labour Statistics (PLFS)",
    "sdg": "SDG Indicator Framework",
    "metadata": "Metadata Standards & Data Documentation",
    "data quality": "Data Quality Assurance Frameworks",
    "data privacy": "DPDP Act 2023 & Data Privacy",
    "cyber security": "Cyber Security Hygiene",
    "cloud": "Cloud Computing for Statistical Systems",
    "visualisation": "Data Visualization & Dissemination",
    "visualization": "Data Visualization & Dissemination",
    "monitoring": "Monitoring Outcomes & Evaluating Impact",
    "econometrics": "Econometrics",
    "macro economics": "Micro & Macro Economics",
}


def _competencies(node: Dict[str, Any]) -> List[str]:
    raw: List[str] = []
    for key in ("competencies_v5", "competencies_v6", "competencies", "keywords"):
        v = node.get(key)
        if isinstance(v, list):
            for item in v:
                if isinstance(item, dict):
                    raw += [
                        str(item.get(k))
                        for k in (
                            "competencyAreaName",
                            "competencyThemeName",
                            "competencySubThemeName",
                            "name",
                        )
                        if item.get(k)
                    ]
                elif item:
                    raw.append(str(item))

    mapped: List[str] = []
    seen = set()
    for label in raw:
        low = label.lower()
        hit = next((v for k, v in COMPETENCY_ALIASES.items() if k in low), label.strip())
        if hit and hit not in seen:
            seen.add(hit)
            mapped.append(hit)
    return mapped


def map_course(node: Dict[str, Any]) -> Dict[str, Any]:
    cid = node.get("identifier", "")
    minutes = int(float(node.get("duration") or 0) / 60) if node.get("duration") else 0
    return {
        "id": f"igot-{cid}",
        "external_provider": "iGOT Karmayogi",
        "external_course_id": cid,
        "providerCourseId": cid,
        "title": node.get("name") or node.get("title") or "Untitled",
        "description": (node.get("description") or "")[:1000],
        "provider": node.get("source") or node.get("creator") or "iGOT Karmayogi",
        "provider_type": "Government",
        "domain": node.get("primaryCategory") or "Capacity Building",
        "level": node.get("difficultyLevel") or "Beginner",
        "duration": f"{minutes // 60}h {minutes % 60}m" if minutes else "Self-paced",
        "duration_hours": round(minutes / 60, 2),
        "delivery_mode": "Online — Self Paced",
        "competencies_covered": _competencies(node),
        "poster": node.get("posterImage") or node.get("appIcon"),
        "rating": node.get("avgRating") or 4.5,
        "externalUrl": PORTAL_TOC.format(cid=cid),
        "source_class": "OFFICIAL_GOVT_LMS",
        "sync_source": settings.IGOT_MODE,
    }
