from io import BytesIO

import fitz
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def register_headers(username: str = "chatuser", email: str = "chat@example.com") -> dict[str, str]:
    response = client.post(
        "/api/v1/auth/register",
        json={"username": username, "email": email, "password": "StrongPass123"},
    )
    return {"Authorization": f"Bearer {response.json()['access_token']}"}


def make_rag_pdf() -> bytes:
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text(
        (72, 72),
        "Operating System Notes\n1.1 Process and Thread\n"
        "A process owns resources. A thread is the basic unit of CPU scheduling. "
        "Thread switching is lighter than process switching.",
        fontsize=12,
    )
    buffer = BytesIO()
    doc.save(buffer)
    doc.close()
    return buffer.getvalue()


def upload_notes(headers: dict[str, str]) -> str:
    response = client.post(
        "/api/v1/documents/upload",
        headers=headers,
        data={"subject": "操作系统"},
        files={"file": ("os-notes.pdf", make_rag_pdf(), "application/pdf")},
    )
    assert response.status_code == 201
    return response.json()["id"]


def test_chat_answer_returns_citations_and_debug_chunks():
    headers = register_headers()
    upload_notes(headers)
    session = client.post(
        "/api/v1/chat/sessions",
        headers=headers,
        json={"title": "操作系统问答", "subject": "操作系统"},
    )
    assert session.status_code == 201

    message = client.post(
        f"/api/v1/chat/sessions/{session.json()['id']}/messages",
        headers=headers,
        json={"question": "What is the basic unit of CPU scheduling?", "top_k": 3},
    )

    assert message.status_code == 201
    payload = message.json()
    assert "CPU scheduling" in payload["answer"]
    assert payload["citations"][0]["document_name"] == "os-notes.pdf"
    assert payload["citations"][0]["score"] > 0

    debug = client.get(f"/api/v1/chat/messages/{payload['message_id']}/retrieved-chunks", headers=headers)
    assert debug.status_code == 200
    assert debug.json()[0]["document_name"] == "os-notes.pdf"


def test_chat_low_confidence_refuses_to_invent_answer():
    headers = register_headers("lowconf", "lowconf@example.com")
    upload_notes(headers)
    session = client.post(
        "/api/v1/chat/sessions",
        headers=headers,
        json={"title": "低置信度", "subject": "操作系统"},
    )

    response = client.post(
        f"/api/v1/chat/sessions/{session.json()['id']}/messages",
        headers=headers,
        json={"question": "Explain banana quantum pastry protocols", "top_k": 3},
    )

    assert response.status_code == 201
    assert "资料不足" in response.json()["answer"]
    assert response.json()["citations"] == []
