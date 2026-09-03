from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db, async_engine, Base, AsyncSessionLocal
from app.core.exceptions import AppException
from app.core.logging import setup_logging, logger
from app.core.middleware import RequestContextMiddleware, global_exception_handler


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    logger.info("Initializing StatIntel AI Backend Service...")
    
    # Auto-create tables for sqlite in dev/test mode if required
    if "sqlite" in settings.DATABASE_URL:
        async with async_engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        
        # Auto-seed database if empty
        try:
            from sqlalchemy import select
            from app.models.user import User
            from scripts.seed_data import seed_database
            async with AsyncSessionLocal() as session:
                res = await session.execute(select(User).limit(1))
                if not res.scalar_one_or_none():
                    logger.info("Empty database detected. Running automatic initial seeding...")
                    await seed_database()
                    logger.info("Database auto-seeding completed.")
        except Exception as e:
            logger.warning(f"Database auto-seeding check encountered: {e}")
            
    yield
    logger.info("Shutting down StatIntel AI Backend Service...")


def create_application() -> FastAPI:
    app = FastAPI(
        title=settings.PROJECT_NAME,
        openapi_url=f"{settings.API_V1_STR}/openapi.json",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # Add Middleware
    app.add_middleware(RequestContextMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Exception Handler
    app.add_exception_handler(AppException, global_exception_handler)
    app.add_exception_handler(Exception, global_exception_handler)

    # Include API Routers
    from app.api.router import api_router
    app.include_router(api_router, prefix=settings.API_V1_STR)

    # Health Check Endpoints
    @app.get("/health", tags=["Health"])
    async def health_check():
        return {
            "success": True,
            "data": {
                "status": "healthy",
                "app": settings.PROJECT_NAME,
                "environment": settings.APP_ENV,
                "version": "1.0.0",
            },
        }

    @app.get("/health/db", tags=["Health"])
    async def health_db(db: AsyncSession = Depends(get_db)):
        try:
            res = await db.execute(text("SELECT 1"))
            val = res.scalar()
            return {
                "success": True,
                "data": {"status": "healthy", "database": "connected", "ping": val},
            }
        except Exception as e:
            return {
                "success": False,
                "error": {"code": "DATABASE_DISCONNECTED", "message": str(e)},
            }

    @app.get("/health/redis", tags=["Health"])
    async def health_redis():
        return {
            "success": True,
            "data": {"status": "healthy", "redis": "mock_connected"},
        }

    @app.get("/health/ai", tags=["Health"])
    async def health_ai():
        provider = "MockLLMProvider" if settings.USE_MOCK_AI or not settings.GEMINI_API_KEY else "GeminiProvider"
        return {
            "success": True,
            "data": {
                "status": "healthy",
                "ai_provider": provider,
                "model": settings.GEMINI_MODEL,
            },
        }

    return app


app = create_application()
