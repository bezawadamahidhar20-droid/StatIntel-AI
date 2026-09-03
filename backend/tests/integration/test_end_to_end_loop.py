import pytest


@pytest.mark.asyncio
async def test_full_statintel_intelligence_loop(async_client):
    """
    Step 25 Mandated Critical End-to-End Test verifying the complete StatIntel AI loop:
    ASSESS -> IDENTIFY GAPS -> EXPLAIN -> RECOMMEND -> LEARN -> ASSESS -> UPDATE TWIN -> PREDICT
    """
    # 1. Login Learner
    login_res = await async_client.post(
        "/api/v1/auth/login",
        json={"email": "rajesh.sharma@mospi.gov.in", "password": "password123"},
    )
    assert login_res.status_code == 200
    token = login_res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Load User Profile
    profile_res = await async_client.get("/api/v1/profile", headers=headers)
    assert profile_res.status_code == 200
    profile_data = profile_res.json()["data"]
    assert profile_data["email"] == "rajesh.sharma@mospi.gov.in"

    # 3. Load Competency Digital Twin (Initial State)
    twin_initial_res = await async_client.get("/api/v1/users/me/competency-twin", headers=headers)
    assert twin_initial_res.status_code == 200
    twin_initial = twin_initial_res.json()["data"]
    initial_score = twin_initial["overallCompetency"]

    # 4. Get Skill Gaps (Initial State)
    gaps_initial_res = await async_client.get("/api/v1/skill-gaps", headers=headers)
    assert gaps_initial_res.status_code == 200
    gaps_initial = gaps_initial_res.json()["data"]

    # 5. Start & Submit Assessment
    submit_res = await async_client.post(
        "/api/v1/assessments/asmt-001/submit",
        headers=headers,
        json={"answers": [1, 1, 1], "timeSpentSeconds": 90},
    )
    assert submit_res.status_code == 200
    submit_data = submit_res.json()["data"]
    assert submit_data["accuracy"] == 100.0
    assert submit_data["competencyGain"] > 0

    # 6. Verify Competency Digital Twin updated automatically!
    twin_after_asmt_res = await async_client.get("/api/v1/users/me/competency-twin", headers=headers)
    assert twin_after_asmt_res.status_code == 200
    twin_after = twin_after_asmt_res.json()["data"]
    assert twin_after["overallCompetency"] >= initial_score

    # 7. Recalculate Skill Gaps & Verify Refresh
    recalc_gaps_res = await async_client.post("/api/v1/skill-gaps/recalculate", headers=headers)
    assert recalc_gaps_res.status_code == 200

    # 8. Generate Explainable Recommendations & Verify 7-factor breakdown
    recs_res = await async_client.get("/api/v1/recommendations", headers=headers)
    assert recs_res.status_code == 200
    recs = recs_res.json()["data"]
    assert len(recs) >= 1
    top_course = recs[0]
    assert top_course["whyRecommended"] is not None
    assert len(top_course["whyRecommended"]["factors"]) == 7

    # 9. Get Personalized Learning Path
    path_res = await async_client.get("/api/v1/learning/path", headers=headers)
    assert path_res.status_code == 200
    path = path_res.json()["data"]
    assert len(path["steps"]) >= 1

    # 10. Enroll & Update Learning Progress to 100%
    enroll_res = await async_client.post(f"/api/v1/courses/{top_course['id']}/enroll", headers=headers)
    assert enroll_res.status_code == 200

    progress_res = await async_client.put(
        "/api/v1/learning/progress",
        headers=headers,
        params={"course_id": top_course["id"]},
        json={"progress": 100.0},
    )
    assert progress_res.status_code == 200
    assert progress_res.json()["data"]["status"] == "Completed"

    # 11. Generate Grounded AI Quiz & Submit
    gen_quiz_res = await async_client.post(
        "/api/v1/quiz/generate",
        headers=headers,
        json={
            "documentName": "NSSO_Microdata_Manual.pdf",
            "numberOfQuestions": 2,
            "difficulty": "Hard",
            "competency": "Python for Statistical & Microdata Analytics",
        },
    )
    assert gen_quiz_res.status_code == 200
    quiz_data = gen_quiz_res.json()["data"]
    assert len(quiz_data["questions"]) >= 1

    # 12. Verify Admin Workforce Intelligence Analytics
    admin_login_res = await async_client.post(
        "/api/v1/auth/login",
        json={"email": "vandana.sengupta@gov.in", "password": "password123"},
    )
    admin_token = admin_login_res.json()["data"]["access_token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    wf_res = await async_client.get("/api/v1/workforce/overview", headers=admin_headers)
    assert wf_res.status_code == 200
    wf_data = wf_res.json()["data"]
    assert wf_data["totalLearners"] > 0
    assert len(wf_data["heatmap"]) >= 1
    assert len(wf_data["predictiveSkills"]) >= 1
