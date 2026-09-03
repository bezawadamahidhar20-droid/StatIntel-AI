import json
import os
from typing import Dict, Any, List, Optional
from app.ai.llm_provider import LLMProvider
from app.ai.mock_provider import MockLLMProvider
from app.core.config import settings
from app.core.logging import logger


class GeminiProvider(LLMProvider):
    def __init__(self):
        self.mock_fallback = MockLLMProvider()
        self.api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
        self.model_name = settings.GEMINI_MODEL or "gemini-2.5-flash"
        self._genai_client = None

        if self.api_key and not settings.USE_MOCK_AI:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self._genai = genai
                self._model = genai.GenerativeModel(self.model_name)
            except Exception as e:
                logger.warning(f"Failed to initialize Gemini SDK, using Mock fallback: {e}")

    async def generate_text(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.2,
    ) -> str:
        if not self.api_key or settings.USE_MOCK_AI or not hasattr(self, "_model"):
            return await self.mock_fallback.generate_text(prompt, system_instruction, temperature)

        try:
            full_prompt = f"{system_instruction}\n\n{prompt}" if system_instruction else prompt
            response = self._model.generate_content(
                full_prompt,
                generation_config={"temperature": temperature},
            )
            return response.text
        except Exception as e:
            logger.error(f"Gemini API error, falling back to Mock: {e}")
            return await self.mock_fallback.generate_text(prompt, system_instruction, temperature)

    async def generate_structured_json(
        self,
        prompt: str,
        json_schema: Dict[str, Any],
        system_instruction: Optional[str] = None,
    ) -> Dict[str, Any]:
        if not self.api_key or settings.USE_MOCK_AI or not hasattr(self, "_model"):
            return await self.mock_fallback.generate_structured_json(prompt, json_schema, system_instruction)

        try:
            structured_prompt = (
                f"{system_instruction or ''}\n\n"
                f"{prompt}\n\n"
                "Return ONLY a valid JSON object strictly matching this schema. Do not include markdown codeblocks or extra text."
            )
            response = self._model.generate_content(
                structured_prompt,
                generation_config={"response_mime_type": "application/json"},
            )
            return json.loads(response.text)
        except Exception as e:
            logger.error(f"Gemini structured JSON error, falling back to Mock: {e}")
            return await self.mock_fallback.generate_structured_json(prompt, json_schema, system_instruction)

    async def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        if not self.api_key or settings.USE_MOCK_AI or not hasattr(self, "_genai"):
            return await self.mock_fallback.generate_embeddings(texts)

        try:
            results = []
            for text in texts:
                res = self._genai.embed_content(
                    model="models/text-embedding-004",
                    content=text,
                )
                results.append(res["embedding"])
            return results
        except Exception as e:
            logger.error(f"Gemini Embeddings error, falling back to Mock: {e}")
            return await self.mock_fallback.generate_embeddings(texts)


def get_llm_provider() -> LLMProvider:
    if settings.USE_MOCK_AI or not settings.GEMINI_API_KEY:
        return MockLLMProvider()
    return GeminiProvider()
