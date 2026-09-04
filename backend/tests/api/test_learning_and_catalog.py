import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_get_course_curriculum(async_client: AsyncClient):
    login_res = await async_client.post(
        "/api/v1/auth/login",
        json={"email": "rajesh.sharma@mospi.gov.in", "password": "password123"},
    )
    token = login_res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = await async_client.get("/api/v1/courses/crs-001/curriculum", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["course_id"] == "crs-001"
    assert len(data["data"]["modules"]) >= 1
    
    # Verify Module 1 contains topics
    mod1 = data["data"]["modules"][0]
    assert len(mod1["topics"]) >= 1
    top1 = mod1["topics"][0]
    assert "title" in top1
    assert "resources" in top1


@pytest.mark.asyncio
async def test_topic_completion(async_client: AsyncClient):
    login_res = await async_client.post(
        "/api/v1/auth/login",
        json={"email": "rajesh.sharma@mospi.gov.in", "password": "password123"},
    )
    token = login_res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = await async_client.post(
        "/api/v1/learning/topics/top-01/complete",
        json={"time_spent_seconds": 300},
        headers=headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["status"] == "COMPLETED"
    assert data["data"]["course_completion_percentage"] > 0


@pytest.mark.asyncio
async def test_generate_study_notes(async_client: AsyncClient):
    response = await async_client.post("/api/v1/learning/topics/top-04/generate-notes")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "Pandas DataFrames" in data["data"]["topic_title"]
    assert len(data["data"]["key_concepts"]) >= 2
    assert len(data["data"]["important_formulas"]) >= 1
    assert "attribution" in data["data"]


@pytest.mark.asyncio
async def test_module_assessment(async_client: AsyncClient):
    login_res = await async_client.post(
        "/api/v1/auth/login",
        json={"email": "rajesh.sharma@mospi.gov.in", "password": "password123"},
    )
    token = login_res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = await async_client.post(
        "/api/v1/learning/modules/mod-01/assessment",
        json={"user_answers": [1, 0, 2, 3, 1], "time_spent_seconds": 120},
        headers=headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["total"] == 5
    assert data["data"]["accuracy"] >= 60.0
    assert data["data"]["passed"] is True


@pytest.mark.asyncio
async def test_get_nssta_catalog(async_client: AsyncClient):
    response = await async_client.get("/api/v1/catalog/nssta")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["total"] >= 1
    
    # Test Role filter
    role_res = await async_client.get("/api/v1/catalog/nssta?role=Data Analyst")
    assert role_res.status_code == 200
    role_data = role_res.json()
    assert role_data["success"] is True
    assert role_data["total"] >= 1


@pytest.mark.asyncio
async def test_verify_url_safety(async_client: AsyncClient):
    # Valid official URL
    res = await async_client.post(
        "/api/v1/catalog/verify-url",
        json={"url": "https://www.mospi.gov.in/download-reports"},
    )
    assert res.status_code == 200
    assert res.json()["data"]["verification_status"] == "VERIFIED"

    # Reject private/local IP (SSRF protection)
    bad_res = await async_client.post(
        "/api/v1/catalog/verify-url",
        json={"url": "http://127.0.0.1:8000/admin"},
    )
    assert bad_res.status_code == 200
    assert bad_res.json()["data"]["verification_status"] == "DISABLED"
