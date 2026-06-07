from io import BytesIO
import sys
from pathlib import Path

import fitz
from fastapi.testclient import TestClient

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.db.session import Base, engine
from app.main import app
from app.models import *  # noqa: F403


def make_pdf() -> bytes:
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text((72, 72), "OS Notes\nA thread is the basic unit of CPU scheduling.", fontsize=12)
    buffer = BytesIO()
    doc.save(buffer)
    doc.close()
    return buffer.getvalue()


def main() -> None:
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    client = TestClient(app)
    register = client.post(
        "/api/v1/auth/register",
        json={"username": "smoke", "email": "smoke@example.com", "password": "StrongPass123"},
    )
    assert register.status_code == 201, register.text
    headers = {"Authorization": f"Bearer {register.json()['access_token']}"}

    upload = client.post(
        "/api/v1/documents/upload",
        headers=headers,
        data={"subject": "操作系统"},
        files={"file": ("smoke.pdf", make_pdf(), "application/pdf")},
    )
    assert upload.status_code == 201, upload.text

    chat_session = client.post("/api/v1/chat/sessions", headers=headers, json={"title": "smoke", "subject": "操作系统"})
    assert chat_session.status_code == 201, chat_session.text
    answer = client.post(
        f"/api/v1/chat/sessions/{chat_session.json()['id']}/messages",
        headers=headers,
        json={"question": "What is CPU scheduling?", "top_k": 3},
    )
    assert answer.status_code == 201, answer.text

    extract = client.post("/api/v1/knowledge-points/extract", headers=headers, json={"subject": "操作系统"})
    assert extract.status_code == 201, extract.text
    interview = client.post(
        "/api/v1/interviews",
        headers=headers,
        json={"mode": "subject", "subject": "操作系统", "question_count": 1},
    )
    assert interview.status_code == 201, interview.text
    plan = client.post("/api/v1/study-plans/generate", headers=headers, json={"plan_days": 3})
    assert plan.status_code == 201, plan.text
    print("smoke api ok")


if __name__ == "__main__":
    main()
