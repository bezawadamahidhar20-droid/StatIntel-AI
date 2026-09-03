import json
import os
import re
import urllib.request
import urllib.error
from typing import Dict, Any, List, Optional
from app.ai.llm_provider import LLMProvider
from app.ai.mock_provider import MockLLMProvider
from app.core.config import settings
from app.core.logging import logger

FALLBACK_MODELS = ["gemini-3.1-flash-lite", "gemini-3.6-flash", "gemini-flash-latest"]


class GeminiProvider(LLMProvider):
    def __init__(self):
        self.mock_fallback = MockLLMProvider()
        self.api_key = settings.GEMINI_API_KEY or os.getenv("GEMINI_API_KEY", "")
        self.model_name = settings.GEMINI_MODEL or "gemini-3.1-flash-lite"
        self._active_model = self.model_name

    def _clean_json_string(self, raw_text: str) -> str:
        """Strip markdown codeblock backticks if present."""
        text = raw_text.strip()
        if text.startswith("```"):
            text = re.sub(r"^```[a-zA-Z]*\n?", "", text)
            text = re.sub(r"\n?```$", "", text)
        return text.strip()

    def _execute_rest_generate(self, prompt: str, system_instruction: Optional[str] = None, temperature: float = 0.2, response_mime: Optional[str] = None) -> str:
        """Direct, fast REST call to Google Generative Language API with model fallback cascade."""
        models_to_try = [self._active_model] + [m for m in FALLBACK_MODELS if m != self._active_model]
        
        payload_dict: Dict[str, Any] = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {
                "temperature": temperature,
            }
        }
        if response_mime:
            payload_dict["generationConfig"]["responseMimeType"] = response_mime
        if system_instruction:
            payload_dict["systemInstruction"] = {"parts": [{"text": system_instruction}]}

        payload = json.dumps(payload_dict).encode("utf-8")

        for model in models_to_try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={self.api_key}"
            req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
            try:
                with urllib.request.urlopen(req, timeout=20) as response:
                    res_data = json.loads(response.read().decode("utf-8"))
                    candidates = res_data.get("candidates", [])
                    if candidates and "content" in candidates[0]:
                        parts = candidates[0]["content"].get("parts", [])
                        if parts and "text" in parts[0]:
                            self._active_model = model
                            return parts[0]["text"]
            except urllib.error.HTTPError as he:
                logger.warning(f"Gemini model {model} returned HTTP {he.code}: {he.reason}")
                continue
            except Exception as e:
                logger.warning(f"Gemini call with {model} failed: {e}")
                continue

        raise RuntimeError("All Gemini models failed or timed out.")

    async def generate_text(
        self,
        prompt: str,
        system_instruction: Optional[str] = None,
        temperature: float = 0.2,
    ) -> str:
        if not self.api_key or settings.USE_MOCK_AI:
            return await self.mock_fallback.generate_text(prompt, system_instruction, temperature)

        try:
            return self._execute_rest_generate(
                prompt=prompt,
                system_instruction=system_instruction,
                temperature=temperature,
            )
        except Exception as e:
            logger.error(f"Gemini API error, falling back to Mock: {e}")
            return await self.mock_fallback.generate_text(prompt, system_instruction, temperature)

    async def generate_structured_json(
        self,
        prompt: str,
        json_schema: Dict[str, Any],
        system_instruction: Optional[str] = None,
    ) -> Dict[str, Any]:
        if not self.api_key or settings.USE_MOCK_AI:
            return await self.mock_fallback.generate_structured_json(prompt, json_schema, system_instruction)

        try:
            schema_str = json.dumps(json_schema)
            structured_prompt = (
                f"{prompt}\n\n"
                f"STRICT INSTRUCTION: Output ONLY a valid JSON object strictly complying with this JSON Schema: {schema_str}."
            )
            raw_text = self._execute_rest_generate(
                prompt=structured_prompt,
                system_instruction=system_instruction,
                temperature=0.1,
                response_mime="application/json",
            )
            clean_text = self._clean_json_string(raw_text)
            return json.loads(clean_text)
        except Exception as e:
            logger.error(f"Gemini structured JSON error, falling back to Mock: {e}")
            return await self.mock_fallback.generate_structured_json(prompt, json_schema, system_instruction)

    async def generate_embeddings(self, texts: List[str]) -> List[List[float]]:
        if not self.api_key or settings.USE_MOCK_AI:
            return await self.mock_fallback.generate_embeddings(texts)

        try:
            results = []
            for text in texts:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key={self.api_key}"
                payload = json.dumps({
                    "model": "models/text-embedding-004",
                    "content": {"parts": [{"text": text[:2000]}]}
                }).encode("utf-8")
                req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
                with urllib.request.urlopen(req, timeout=10) as response:
                    res_data = json.loads(response.read().decode("utf-8"))
                    results.append(res_data.get("embedding", {}).get("values", []))
            return results
        except Exception as e:
            logger.error(f"Gemini Embeddings error, falling back to Mock: {e}")
            return await self.mock_fallback.generate_embeddings(texts)


def get_llm_provider() -> LLMProvider:
    if settings.USE_MOCK_AI or not settings.GEMINI_API_KEY:
        return MockLLMProvider()
    return GeminiProvider()

