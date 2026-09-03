import pytest


@pytest.mark.asyncio
async def test_workforce_heatmap_and_predictive(async_client):
    # Login as Learner
    login_res = await async_client.post(
        "/api/v1/auth/login",
        json={"email": "rajesh.sharma@mospi.gov.in", "password": "password123"},
    )
    token = login_res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Get Heatmap
    heatmap_res = await async_client.get("/api/v1/workforce/heatmap", headers=headers)
    assert heatmap_res.status_code == 200
    heatmap = heatmap_res.json()["data"]
    assert len(heatmap) >= 1
    assert "department" in heatmap[0]
    assert "scores" in heatmap[0]

    # 2. Get Predictive Skill Demand
    predictive_res = await async_client.get("/api/v1/workforce/skill-demand", headers=headers)
    assert predictive_res.status_code == 200
    predictive = predictive_res.json()["data"]
    assert len(predictive) >= 1
    assert "projectedGrowth" in predictive[0]

    # 3. Get Analytics Overview
    overview_res = await async_client.get("/api/v1/analytics/overview", headers=headers)
    assert overview_res.status_code == 200
    assert overview_res.json()["data"]["totalLearners"] > 0


@pytest.mark.asyncio
async def test_admin_access_control(async_client):
    # Login as Admin
    login_res = await async_client.post(
        "/api/v1/auth/login",
        json={"email": "vandana.sengupta@gov.in", "password": "password123"},
    )
    token = login_res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    users_res = await async_client.get("/api/v1/admin/users", headers=headers)
    assert users_res.status_code == 200
    assert len(users_res.json()["data"]) >= 2
