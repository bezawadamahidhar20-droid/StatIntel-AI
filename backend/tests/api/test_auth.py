import pytest


@pytest.mark.asyncio
async def test_login_success(async_client):
    response = await async_client.post(
        "/api/v1/auth/login",
        json={"email": "rajesh.sharma@mospi.gov.in", "password": "password123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "access_token" in data["data"]
    assert "refresh_token" in data["data"]
    assert data["data"]["user"]["email"] == "rajesh.sharma@mospi.gov.in"


@pytest.mark.asyncio
async def test_login_invalid_password(async_client):
    response = await async_client.post(
        "/api/v1/auth/login",
        json={"email": "rajesh.sharma@mospi.gov.in", "password": "wrongpassword"},
    )
    assert response.status_code == 401
    data = response.json()
    assert data["success"] is False
    assert data["error"]["code"] == "UNAUTHORIZED"


@pytest.mark.asyncio
async def test_get_me(async_client):
    # Login first
    login_res = await async_client.post(
        "/api/v1/auth/login",
        json={"email": "rajesh.sharma@mospi.gov.in", "password": "password123"},
    )
    token = login_res.json()["data"]["access_token"]

    response = await async_client.get(
        "/api/v1/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["email"] == "rajesh.sharma@mospi.gov.in"
    assert data["data"]["role"] == "LEARNER"
