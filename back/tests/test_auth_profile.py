from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def register_user(username: str = "alice", email: str = "alice@example.com", password: str = "StrongPass123"):
    return client.post(
        "/api/v1/auth/register",
        json={"username": username, "email": email, "password": password},
    )


def test_register_creates_token_and_profile():
    response = register_user()

    assert response.status_code == 201
    payload = response.json()
    assert payload["access_token"]
    assert payload["token_type"] == "bearer"
    assert payload["user"]["username"] == "alice"
    assert payload["user"]["email"] == "alice@example.com"
    assert payload["profile"]["target_role"] == "Java 后端"


def test_register_rejects_duplicate_email():
    first = register_user("bob", "bob@example.com")
    second = register_user("bobby", "bob@example.com")

    assert first.status_code == 201
    assert second.status_code == 409
    assert "already" in second.json()["detail"].lower()


def test_login_and_me_profile_update():
    register_user("carol", "carol@example.com")
    login = client.post(
        "/api/v1/auth/login",
        json={"account": "carol@example.com", "password": "StrongPass123"},
    )

    assert login.status_code == 200
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    me = client.get("/api/v1/users/me", headers=headers)
    assert me.status_code == 200
    assert me.json()["email"] == "carol@example.com"

    update = client.put(
        "/api/v1/users/profile",
        headers=headers,
        json={
            "target_role": "C++ 后端",
            "target_level": "高级",
            "preparation_days": 30,
            "current_level": "冲刺",
        },
    )
    assert update.status_code == 200
    assert update.json()["target_role"] == "C++ 后端"
    assert update.json()["preparation_days"] == 30


def test_protected_endpoint_requires_token():
    response = client.get("/api/v1/users/me")

    assert response.status_code == 401
