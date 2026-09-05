import secrets
from urllib.parse import urlencode
import httpx
from app.core.config import settings

_STATE: dict[str, float] = {}


def login_url() -> tuple[str, str]:
    state = secrets.token_urlsafe(24)
    q = urlencode(
        {
            "response_type": "code",
            "client_id": settings.PARICHAY_CLIENT_ID,
            "redirect_uri": settings.PARICHAY_REDIRECT_URI,
            "scope": "openid profile email",
            "state": state,
        }
    )
    return f"{settings.PARICHAY_AUTH_URL}?{q}", state


async def exchange_code(code: str) -> dict:
    async with httpx.AsyncClient(timeout=20) as c:
        tok_res = await c.post(
            settings.PARICHAY_TOKEN_URL,
            data={
                "grant_type": "authorization_code",
                "code": code,
                "redirect_uri": settings.PARICHAY_REDIRECT_URI,
                "client_id": settings.PARICHAY_CLIENT_ID,
                "client_secret": settings.PARICHAY_CLIENT_SECRET,
            },
            headers={"Content-Type": "application/x-www-form-urlencoded"},
        )
        tok = tok_res.json()
        me_res = await c.get(
            settings.PARICHAY_USERINFO_URL,
            headers={"Authorization": f"Bearer {tok.get('access_token', '')}"},
        )
        me = me_res.json()
        return {"token": tok, "profile": me}
