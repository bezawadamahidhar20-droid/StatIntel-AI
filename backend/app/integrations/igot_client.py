import asyncio
import json
import time
from typing import Any, Dict, Optional
import httpx
from app.core.config import settings
from app.core.logging import logger


class IGOTAuthError(RuntimeError):
    pass


class IGOTUnavailable(RuntimeError):
    pass


class IGOTClient:
    """Thin Sunbird-compatible HTTP client for iGOT Karmayogi.
    Mirrors the resilience contract:
    3 attempts, exponential backoff, HTTP 429 respect, in-memory TTL cache.
    """

    _cache: Dict[str, tuple[float, Any]] = {}

    def __init__(self) -> None:
        self.mode = settings.IGOT_MODE
        self.base = (
            settings.IGOT_SANDBOX_URL if self.mode == "sandbox" else settings.IGOT_BASE_URL
        ).rstrip("/")

    def _headers(self) -> Dict[str, str]:
        h = {"Content-Type": "application/json", "Accept": "application/json"}
        if settings.IGOT_API_KEY:
            h["Authorization"] = f"Bearer {settings.IGOT_API_KEY}"
        if settings.IGOT_USER_TOKEN:
            h["x-authenticated-user-token"] = settings.IGOT_USER_TOKEN
        return h

    async def request(
        self, method: str, path: str, payload: Optional[dict] = None, cache: bool = True
    ) -> Dict[str, Any]:
        if self.mode == "mock":
            raise IGOTUnavailable("IGOT_MODE=mock — using local fixtures")

        key = f"{method}:{path}:{json.dumps(payload, sort_keys=True) if payload else ''}"
        if cache and key in self._cache:
            ts, val = self._cache[key]
            if time.time() - ts < settings.IGOT_CACHE_TTL_SECONDS:
                return val

        url = f"{self.base}{path}"
        delay = 1.0
        last: Optional[Exception] = None

        async with httpx.AsyncClient(timeout=settings.IGOT_TIMEOUT_SECONDS) as c:
            for attempt in range(3):
                try:
                    r = await c.request(method, url, json=payload, headers=self._headers())
                    if r.status_code in (401, 403):
                        raise IGOTAuthError(f"iGOT rejected credentials ({r.status_code})")
                    if r.status_code == 429:
                        wait = float(r.headers.get("Retry-After", delay))
                        logger.warning(f"iGOT rate limited, sleeping {wait}s")
                        await asyncio.sleep(wait)
                        delay *= 2
                        continue
                    r.raise_for_status()
                    data = r.json()
                    if cache:
                        self._cache[key] = (time.time(), data)
                    return data
                except IGOTAuthError:
                    raise
                except Exception as e:
                    last = e
                    logger.warning(f"iGOT attempt {attempt + 1} failed: {e}")
                    await asyncio.sleep(delay)
                    delay *= 2

            raise IGOTUnavailable(f"iGOT unreachable after 3 attempts: {last}")
