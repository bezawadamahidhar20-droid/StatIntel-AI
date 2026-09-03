import pytest


@pytest.mark.asyncio
async def test_get_all_competencies(async_client):
    response = await async_client.get("/api/v1/competencies")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) >= 4


@pytest.mark.asyncio
async def test_get_my_competency_twin(async_client):
    # Login first
    login_res = await async_client.post(
        "/api/v1/auth/login",
        json={"email": "rajesh.sharma@mospi.gov.in", "password": "password123"},
    )
    token = login_res.json()["data"]["access_token"]

    response = await async_client.get(
        "/api/v1/users/me/competency-twin",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "overallCompetency" in data["data"]
    assert "competencies" in data["data"]
    assert len(data["data"]["competencies"]) >= 4
