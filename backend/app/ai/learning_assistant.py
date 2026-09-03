from typing import List, Dict, Any, Optional
from app.ai.gemini_provider import get_llm_provider


class StatIntelLearningAssistant:
    def __init__(self):
        self.provider = get_llm_provider()

    async def chat(
        self,
        user_message: str,
        user_context: Dict[str, Any],
        conversation_history: Optional[List[Dict[str, str]]] = None,
    ) -> str:
        system_instruction = (
            "You are StatIntel AI — Official Assistant for Indian Statistical Service (ISS) officers and government statisticians.\n"
            "Provide precise, authoritative guidance on MoSPI survey methodology, National Accounts (SNA 2008), CPI/WPI price statistics, "
            "Python/R statistical computing, DPDP Act 2023 data governance, and personalized learning pathways.\n"
            "Keep responses structured, accurate, and professional."
        )

        user_prompt = (
            f"USER ROLE: {user_context.get('designation', 'Senior Officer')} ({user_context.get('department', 'MoSPI')})\n"
            f"USER OVERALL COMPETENCY: {user_context.get('overallCompetency', 75)}%\n\n"
            f"USER QUESTION: {user_message}"
        )

        response_text = await self.provider.generate_text(
            prompt=user_prompt,
            system_instruction=system_instruction,
            temperature=0.3,
        )
        return response_text
