import pytest


@pytest.mark.asyncio
async def test_ai_quiz_generator(async_client):
    # 1. Login
    login_res = await async_client.post(
        "/api/v1/auth/login",
        json={"email": "rajesh.sharma@mospi.gov.in", "password": "password123"},
    )
    token = login_res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Generate Grounded Quiz
    quiz_res = await async_client.post(
        "/api/v1/quiz/generate",
        headers=headers,
        json={
            "documentName": "NSSO_78th_Round_Manual.pdf",
            "numberOfQuestions": 2,
            "difficulty": "Medium",
            "competency": "Survey Design & Sampling Methodology",
        },
    )
    assert quiz_res.status_code == 200
    quiz_data = quiz_res.json()["data"]
    assert "questions" in quiz_data
    assert len(quiz_data["questions"]) >= 1
    assert "sourceReference" in quiz_data["questions"][0]


@pytest.mark.asyncio
async def test_ai_learning_assistant_chat(async_client):
    login_res = await async_client.post(
        "/api/v1/auth/login",
        json={"email": "rajesh.sharma@mospi.gov.in", "password": "password123"},
    )
    token = login_res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    chat_res = await async_client.post(
        "/api/v1/assistant/chat",
        headers=headers,
        json={"message": "What is the primary sampling unit in rural sector surveys?"},
    )
    assert chat_res.status_code == 200
    chat_data = chat_res.json()["data"]
    assert "reply" in chat_data
    assert len(chat_data["reply"]) > 10
