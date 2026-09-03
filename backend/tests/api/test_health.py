import pytest


@pytest.mark.asyncio
async def test_health_check(async_client):
    response = await async_client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["status"] == "healthy"


@pytest.mark.asyncio
async def test_health_db(async_client):
    response = await async_client.get("/health/db")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["status"] == "healthy"


@pytest.mark.asyncio
async def test_health_redis(async_client):
    response = await async_client.get("/health/redis")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True


@pytest.mark.asyncio
async def test_health_ai(async_client):
    response = await async_client.get("/health/ai")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "ai_provider" in data["data"]
