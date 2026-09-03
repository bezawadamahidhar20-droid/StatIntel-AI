import pytest
from httpx import AsyncClient


import pytest_asyncio


@pytest_asyncio.fixture

async def auth_headers(async_client: AsyncClient):
    learner_login = await async_client.post(
        "/api/v1/auth/login",
        json={"email": "rajesh.sharma@mospi.gov.in", "password": "password123"},
    )
    learner_token = learner_login.json()["data"]["access_token"]
    learner_h = {"Authorization": f"Bearer {learner_token}"}

    admin_login = await async_client.post(
        "/api/v1/auth/login",
        json={"email": "vandana.sengupta@gov.in", "password": "password123"},
    )
    admin_token = admin_login.json()["data"]["access_token"]
    admin_h = {"Authorization": f"Bearer {admin_token}"}

    return {"learner": learner_h, "admin": admin_h}


@pytest.mark.asyncio
async def test_auth_attacks_and_invalid_tokens(async_client: AsyncClient):
    # 1. Missing token
    resp = await async_client.get("/api/v1/profile")
    assert resp.status_code == 401

    # 2. Malformed token
    resp = await async_client.get(
        "/api/v1/profile",
        headers={"Authorization": "Bearer not-a-valid-jwt-token"},
    )
    assert resp.status_code == 401

    # 3. Invalid credentials
    resp = await async_client.post(
        "/api/v1/auth/login",
        json={"email": "rajesh.sharma@mospi.gov.in", "password": "wrongpassword!"},
    )
    assert resp.status_code == 401

    # 4. Duplicate registration
    resp = await async_client.post(
        "/api/v1/auth/register",
        json={
            "employee_id": "MOSPI-ISS-2019-042",
            "email": "rajesh.sharma@mospi.gov.in",
            "password": "password123",
            "full_name": "Rajesh Duplicate",
            "designation": "SSO",
        },
    )
    assert resp.status_code == 400


@pytest.mark.asyncio
async def test_rbac_privilege_escalation(async_client: AsyncClient, auth_headers: dict):
    learner_headers = auth_headers["learner"]
    admin_headers = auth_headers["admin"]

    # Learner attempting admin routes must receive 403 Forbidden
    resp = await async_client.get("/api/v1/admin/users", headers=learner_headers)
    assert resp.status_code == 403

    resp = await async_client.get("/api/v1/workforce/overview", headers=learner_headers)
    assert resp.status_code == 403

    resp = await async_client.post("/api/v1/admin/demo-reset", headers=learner_headers)
    assert resp.status_code == 403

    # Admin accessing admin routes must succeed with 200 OK
    resp = await async_client.get("/api/v1/admin/users", headers=admin_headers)
    assert resp.status_code == 200

    resp = await async_client.get("/api/v1/workforce/overview", headers=admin_headers)
    assert resp.status_code == 200


@pytest.mark.asyncio
async def test_input_boundary_validation(async_client: AsyncClient, auth_headers: dict):
    learner_headers = auth_headers["learner"]

    # 1. Progress < 0
    resp = await async_client.put(
        "/api/v1/learning/progress?course_id=crs-01",
        headers=learner_headers,
        json={"progress": -10.0},
    )
    assert resp.status_code == 422

    # 2. Progress > 100
    resp = await async_client.put(
        "/api/v1/learning/progress?course_id=crs-01",
        headers=learner_headers,
        json={"progress": 150.0},
    )
    assert resp.status_code == 422

    # 3. Negative experience in profile
    resp = await async_client.put(
        "/api/v1/profile",
        headers=learner_headers,
        json={"years_of_experience": -5},
    )
    assert resp.status_code == 422

    # 4. Invalid email format
    resp = await async_client.post(
        "/api/v1/auth/login",
        json={"email": "invalid-email-format", "password": "password123"},
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_file_upload_security(async_client: AsyncClient, auth_headers: dict):
    learner_headers = auth_headers["learner"]

    # 1. Path traversal attempt in filename
    traversal_file = {"file": ("../../etc/passwd.pdf", b"%PDF-1.4 sample content", "application/pdf")}
    resp = await async_client.post("/api/v1/quiz/upload", headers=learner_headers, files=traversal_file)
    assert resp.status_code == 400
    assert "Path traversal" in resp.json()["detail"]

    # 2. Dangerous executable extension disguised as pdf
    dangerous_file = {"file": ("malicious_doc.pdf.exe", b"MZ fake executable content", "application/octet-stream")}
    resp = await async_client.post("/api/v1/quiz/upload", headers=learner_headers, files=dangerous_file)
    assert resp.status_code == 400
    assert "Executable extension" in resp.json()["detail"]

    # 3. Unsupported extension
    unsupported_file = {"file": ("dataset.csv", b"col1,col2\n1,2", "text/csv")}
    resp = await async_client.post("/api/v1/quiz/upload", headers=learner_headers, files=unsupported_file)
    assert resp.status_code == 400
    assert "Unsupported file format" in resp.json()["detail"]

    # 4. Empty file (0 bytes)
    empty_file = {"file": ("empty.pdf", b"", "application/pdf")}
    resp = await async_client.post("/api/v1/quiz/upload", headers=learner_headers, files=empty_file)
    assert resp.status_code == 400
    assert "empty" in resp.json()["detail"].lower()

    # 5. Spoofed PDF with invalid header
    spoofed_file = {"file": ("fake.pdf", b"NOT_A_REAL_PDF_HEADER_CONTENT", "application/pdf")}
    resp = await async_client.post("/api/v1/quiz/upload", headers=learner_headers, files=spoofed_file)
    assert resp.status_code == 422
    assert "Corrupted or spoofed PDF" in resp.json()["detail"]

    # 6. Valid TXT document upload
    valid_txt = {"file": ("mospi_guideline.txt", b"NSSO 78th Round survey sampling design and allocation.", "text/plain")}
    resp = await async_client.post("/api/v1/quiz/upload", headers=learner_headers, files=valid_txt)
    assert resp.status_code == 200
    assert resp.json()["success"] is True


@pytest.mark.asyncio
async def test_concurrency_and_demo_reset(async_client: AsyncClient, auth_headers: dict):
    learner_headers = auth_headers["learner"]
    admin_headers = auth_headers["admin"]

    # Repeated course enrollment is idempotent
    resp1 = await async_client.post("/api/v1/courses/crs-001/enroll", headers=learner_headers)
    assert resp1.status_code == 200

    resp2 = await async_client.post("/api/v1/courses/crs-001/enroll", headers=learner_headers)
    assert resp2.status_code == 200


    # Demo reset endpoint restores initial state
    reset_resp = await async_client.post("/api/v1/admin/demo-reset", headers=admin_headers)
    assert reset_resp.status_code == 200
    assert reset_resp.json()["success"] is True
    assert "usr-10492" in reset_resp.json()["data"]["targetUser"]
