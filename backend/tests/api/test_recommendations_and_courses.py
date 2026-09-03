import pytest


@pytest.mark.asyncio
async def test_get_courses_and_recommendations(async_client):
    # 1. Login
    login_res = await async_client.post(
        "/api/v1/auth/login",
        json={"email": "rajesh.sharma@mospi.gov.in", "password": "password123"},
    )
    token = login_res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get Courses
    courses_res = await async_client.get("/api/v1/courses", headers=headers)
    assert courses_res.status_code == 200
    courses = courses_res.json()["data"]
    assert len(courses) >= 2

    # 3. Get Recommendations (Verify 7-factor explainability structure)
    rec_res = await async_client.get("/api/v1/recommendations", headers=headers)
    assert rec_res.status_code == 200
    recs = rec_res.json()["data"]
    assert len(recs) >= 1
    assert recs[0]["whyRecommended"] is not None
    assert len(recs[0]["whyRecommended"]["factors"]) == 7

    # 4. Enroll in a course
    enroll_res = await async_client.post(f"/api/v1/courses/crs-001/enroll", headers=headers)
    assert enroll_res.status_code == 200
    assert enroll_res.json()["data"]["status"] == "In Progress"

    # 5. Get Personalized Learning Path
    path_res = await async_client.get("/api/v1/learning/path", headers=headers)
    assert path_res.status_code == 200
    path = path_res.json()["data"]
    assert "steps" in path
    assert len(path["steps"]) >= 1
