import json
from typing import Dict, Any, List, Optional
from app.ai.llm_provider import LLMProvider


class MockLLMProvider(LLMProvider):
    async def generate_text(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.2,
    ) -> str:
        prompt_lower = prompt.lower()

        if "sampling" in prompt_lower or "nsso" in prompt_lower or "survey" in prompt_lower:
            return (
                "Based on the official MoSPI Survey Guidelines (NSSO 78th Round Manual, Section 3.2):\n\n"
                "1. **Sampling Frame**: Multi-stage stratified sampling is adopted. In rural areas, Census Villages serve as Primary Sampling Units (PSUs), while Urban Frame Survey (UFS) blocks are used in urban sectors.\n"
                "2. **Selection Probability**: PSUs are selected using Probability Proportional to Size (PPS) with Census population as measure of size.\n"
                "3. **Multiplier Calibration**: Final weights are calibrated to match projected national population totals."
            )
        elif "python" in prompt_lower or "pandas" in prompt_lower or "microdata" in prompt_lower:
            return (
                "To process NSSO microdata in Python:\n\n"
                "```python\n"
                "import pandas as pd\n"
                "# Load fixed-width layout file\n"
                "df = pd.read_fwf('LEVEL01.TXT', colspecs=[(0, 3), (3, 10), (10, 18)], names=['state', 'fsu', 'multiplier'])\n"
                "# Apply weight multiplier (divide by 100 as per layout spec)\n"
                "df['weight'] = df['multiplier'] / 100.0\n"
                "```"
            )
        else:
            return (
                "StatIntel AI Domain Assistant:\n"
                "Official statistics methodology guidelines emphasize standardized metadata (SDMX), "
                "rigorous design effects calculation, and Digital Personal Data Protection (DPDP Act 2023) compliance "
                "for public microdata dissemination."
            )

    async def generate_structured_json(
        self,
        prompt: str,
        json_schema: Dict[str, Any],
        system_instruction: Optional[str] = None,
    ) -> Dict[str, Any]:
        return {
            "questions": [
                {
                    "question": "According to the uploaded MoSPI manual, what variable serves as the measure of size for rural PSU selection in PPS sampling?",
                    "options": [
                        "Geographical Area in Sq Km",
                        "Census Population / Household Count",
                        "Total Agricultural Output",
                        "Number of Commercial Establishments"
                    ],
                    "correctIndex": 1,
                    "explanation": "Section 4.2 (Page 18) mandates Census Population as the auxiliary measure of size for rural PSUs.",
                    "difficulty": "Medium",
                    "competency": "Survey Design & Sampling Methodology",
                    "sourceReference": "Page 18 — Uploaded_Manual.pdf"
                },
                {
                    "question": "In National Quality Assurance Framework (NQAF), what is the mandatory threshold for microdata error rate auditing?",
                    "options": [
                        "Less than 5.0%",
                        "Less than 1.0%",
                        "Less than 0.5%",
                        "Zero error tolerance"
                    ],
                    "correctIndex": 1,
                    "explanation": "NQAF Standard 2.4 specifies a maximum acceptable microdata error threshold of 1.0%.",
                    "difficulty": "Hard",
                    "competency": "Data Quality Frameworks & SDMX Standards",
                    "sourceReference": "Page 34 — Uploaded_Manual.pdf"
                }
            ]
        }

    async def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        # Deterministic 1536-dim mock vector floats
        result = []
        for text in texts:
            val = float(abs(hash(text)) % 100) / 100.0
            vec = [val] * 64  # Compact representation
            result.append(vec)
        return result
