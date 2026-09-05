import os
from typing import List, Union
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
        case_sensitive=True,
    )

    APP_ENV: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "StatIntel AI — Skill Intelligence Platform"

    # Database
    DATABASE_URL: str = Field(
        default="sqlite+aiosqlite:///:memory:",
        description="Async database connection string",
    )
    SQLITE_TEST_URL: str = "sqlite+aiosqlite:///:memory:"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # JWT Security
    JWT_SECRET: str = "statintel_secret_key_change_in_production_32bytes_long!!"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # AI Configuration
    GEMINI_API_KEY: str = ""
    GEMINI_MODEL: str = "gemini-3.1-flash-lite"
    USE_MOCK_AI: bool = False

    # ── iGOT Karmayogi (Sunbird ED / Lern based) ──────────────────
    IGOT_MODE: str = "mock"  # mock | sandbox | live
    IGOT_BASE_URL: str = "https://portal.igotkarmayogi.gov.in"
    IGOT_SANDBOX_URL: str = "https://dev.karmayogibharat.net"
    IGOT_API_KEY: str = ""  # Bearer token, issued by Karmayogi Bharat
    IGOT_USER_TOKEN: str = ""  # x-authenticated-user-token
    IGOT_ORG_ID: str = ""  # MoSPI root org id on iGOT
    IGOT_CHANNEL_ID: str = ""
    IGOT_TIMEOUT_SECONDS: int = 20
    IGOT_CACHE_TTL_SECONDS: int = 3600

    # Parichay SSO (NIC single sign-on for government users)
    PARICHAY_CLIENT_ID: str = ""
    PARICHAY_CLIENT_SECRET: str = ""
    PARICHAY_AUTH_URL: str = "https://parichay.nic.in/oauth2/authorize"
    PARICHAY_TOKEN_URL: str = "https://parichay.nic.in/oauth2/token"
    PARICHAY_USERINFO_URL: str = "https://parichay.nic.in/oauth2/userinfo"
    PARICHAY_REDIRECT_URI: str = "http://localhost:8000/api/v1/auth/parichay/callback"

    NSSTA_API_URL: str = "https://nssta.gov.in/api/v1"
    NSSTA_API_KEY: str = "nssta_mock_api_key"

    TPAC_API_URL: str = "https://tpac.gov.in/api/v1"
    TPAC_API_KEY: str = "tpac_mock_api_key"

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
    ]


settings = Settings()
