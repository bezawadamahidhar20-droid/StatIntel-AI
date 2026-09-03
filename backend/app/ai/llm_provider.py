from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional


class LLMProvider(ABC):
    @abstractmethod
    async def generate_text(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.2,
    ) -> str:
        pass

    @abstractmethod
    async def generate_structured_json(
        self,
        prompt: str,
        json_schema: Dict[str, Any],
        system_instruction: Optional[str] = None,
    ) -> Dict[str, Any]:
        pass

    @abstractmethod
    async def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        pass
