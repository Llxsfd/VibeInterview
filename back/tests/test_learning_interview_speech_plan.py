from io import BytesIO

import fitz
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def headers_for(username: str, email: str) -> dict[str, str]:
    response = client.post(
        "/api/v1/auth/register",
        json={"username": username, "email": email, "password": "StrongPass123"},
    )
    return {"Authorization": f"Bearer {response.json()['access_token']}"}


def pdf_bytes() -> bytes:
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text(
        (72, 72),
        "Database Notes\n1.1 Index\n"
        "A B+ tree index speeds up range queries. A transaction should preserve atomicity and isolation.",
        fontsize=12,
    )
    buffer = BytesIO()
    doc.save(buffer)
    doc.close()
    return buffer.getvalue()


def upload_document(headers: dict[str, str]) -> str:
    response = client.post(
        "/api/v1/documents/upload",
        headers=headers,
        data={"subject": "数据库"},
        files={"file": ("db.pdf", pdf_bytes(), "application/pdf")},
    )
    assert response.status_code == 201
    return response.json()["id"]


def test_learning_question_and_mistake_flow():
    headers = headers_for("learn", "learn@example.com")
    upload_document(headers)

    extract = client.post("/api/v1/knowledge-points/extract", headers=headers, json={"subject": "数据库"})
    assert extract.status_code == 201
    knowledge_point = extract.json()[0]
    assert knowledge_point["subject"] == "数据库"

    generate = client.post(
        "/api/v1/questions/generate",
        headers=headers,
        json={"knowledge_point_id": knowledge_point["id"], "count": 1, "type": "single_choice"},
    )
    assert generate.status_code == 201
    question = generate.json()[0]
    assert question["source_chunk_ids"]

    answer = client.post(f"/api/v1/questions/{question['id']}/answer", headers=headers, json={"user_answer": "wrong"})
    assert answer.status_code == 201
    assert answer.json()["score"] < 1

    mistakes = client.get("/api/v1/mistakes", headers=headers)
    assert mistakes.status_code == 200
    assert mistakes.json()[0]["question_id"] == question["id"]


def test_interview_scoring_and_report_flow():
    headers = headers_for("interview", "interview@example.com")
    upload_document(headers)
    client.post("/api/v1/knowledge-points/extract", headers=headers, json={"subject": "数据库"})

    created = client.post(
        "/api/v1/interviews",
        headers=headers,
        json={"mode": "subject", "subject": "数据库", "difficulty": "中等", "question_count": 1},
    )
    assert created.status_code == 201
    session = created.json()
    turn = session["turns"][0]

    scored = client.post(
        f"/api/v1/interviews/{session['id']}/answer",
        headers=headers,
        json={"turn_id": turn["id"], "user_answer": "B+ tree index speeds up range queries.", "answer_duration_seconds": 18},
    )
    assert scored.status_code == 200
    assert scored.json()["score"] > 0
    assert scored.json()["follow_up_question"]

    finished = client.post(f"/api/v1/interviews/{session['id']}/finish", headers=headers)
    assert finished.status_code == 200
    assert finished.json()["status"] == "finished"

    report = client.get(f"/api/v1/interviews/{session['id']}/report", headers=headers)
    assert report.status_code == 200
    assert report.json()["total_score"] >= 0
    assert report.json()["recommendations"]


def test_speech_fallback_and_study_plan_flow():
    headers = headers_for("voice", "voice@example.com")
    upload_document(headers)

    asr = client.post(
        "/api/v1/speech/asr",
        headers=headers,
        data={"duration_seconds": 3},
        files={"file": ("answer.webm", b"fake-audio", "audio/webm")},
    )
    assert asr.status_code == 201
    assert "未配置" in asr.json()["transcript"]

    tts = client.post("/api/v1/speech/tts", headers=headers, json={"text": "请解释 B+ 树索引"})
    assert tts.status_code == 200
    assert tts.json()["provider"] == "local-fallback"

    plan = client.post("/api/v1/study-plans/generate", headers=headers, json={"plan_days": 7})
    assert plan.status_code == 201
    first_task_id = plan.json()["plan_content"]["days"][0]["tasks"][0]["id"]

    updated = client.put(f"/api/v1/study-plans/{plan.json()['id']}/tasks/{first_task_id}", headers=headers)
    assert updated.status_code == 200
    assert updated.json()["plan_content"]["days"][0]["tasks"][0]["done"] is True

    delete_audio = client.delete(f"/api/v1/speech/audios/{asr.json()['audio_id']}", headers=headers)
    assert delete_audio.status_code == 204
