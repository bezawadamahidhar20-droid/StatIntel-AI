import pytest


@pytest.mark.asyncio
async def test_assessments_and_closed_loop_feedback(async_client):
    # 1. Login
    login_res = await async_client.post(
        "/api/v1/auth/login",
        json={"email": "rajesh.sharma@mospi.gov.in", "password": "password123"},
    )
    token = login_res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get Assessments list
    asmts_res = await async_client.get("/api/v1/assessments", headers=headers)
    assert asmts_res.status_code == 200
    asmts = asmts_res.json()["data"]
    assert len(asmts) >= 1

    # 3. Get Initial Skill Gaps
    gaps_before_res = await async_client.get("/api/v1/skill-gaps", headers=headers)
    assert gaps_before_res.status_code == 200

    # 4. Submit Assessment Attempt (all correct answers)
    submit_res = await async_client.post(
        f"/api/v1/assessments/asmt-001/submit",
        headers=headers,
        json={"answers": [1, 1, 1], "timeSpentSeconds": 120},
    )
    assert submit_res.status_code == 200
    result_data = submit_res.json()["data"]
    assert result_data["accuracy"] == 100.0
    assert result_data["competencyGain"] > 0

    # 5. Verify Competency Digital Twin updated!
    twin_res = await async_client.get("/api/v1/users/me/competency-twin", headers=headers)
    assert twin_res.status_code == 200
    twin_data = twin_res.json()["data"]
    assert twin_data["overallCompetency"] > 0

    # 6. Verify Skill Gaps recalculated!
    gaps_after_res = await async_client.get("/api/v1/skill-gaps", headers=headers)
    assert gaps_after_res.status_code == 200
