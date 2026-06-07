from io import BytesIO

import fitz
from fastapi.testclient import TestClient

from app.main import app
from app.services.chunk_service import split_pages_into_chunks
from app.services.text_cleaner_service import clean_text, detect_heading


client = TestClient(app)


def auth_headers() -> dict[str, str]:
    response = client.post(
        "/api/v1/auth/register",
        json={"username": "docuser", "email": "docuser@example.com", "password": "StrongPass123"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def make_pdf_bytes() -> bytes:
    doc = fitz.open()
    page = doc.new_page()
    page.insert_text(
        (72, 72),
        "第一章 操作系统\n1.1 进程与线程\n进程是资源分配的基本单位，线程是 CPU 调度的基本单位。\n"
        "线程共享进程资源，切换开销更小，适合高并发任务。",
        fontsize=12,
    )
    buffer = BytesIO()
    doc.save(buffer)
    doc.close()
    return buffer.getvalue()


def test_clean_text_and_heading_detection():
    text = "  第一章  操作系统  \n\n\n  23  \n进程   是资源分配的基本单位。 "

    cleaned = clean_text(text)

    assert "23" not in cleaned
    assert "第一章 操作系统" in cleaned
    assert "进程 是资源分配的基本单位。" in cleaned
    assert detect_heading("第一章 操作系统") == ("chapter", "第一章 操作系统")
    assert detect_heading("1.1 进程与线程") == ("section", "1.1 进程与线程")


def test_split_pages_into_chunks_preserves_metadata():
    pages = [
        {
            "page": 1,
            "text": "第一章 操作系统\n1.1 进程与线程\n进程是资源分配的基本单位，线程是 CPU 调度的基本单位。",
        }
    ]

    chunks = split_pages_into_chunks(pages, subject="操作系统", chunk_size=80, chunk_overlap=10)

    assert len(chunks) == 1
    assert chunks[0]["chapter"] == "第一章 操作系统"
    assert chunks[0]["section"] == "1.1 进程与线程"
    assert chunks[0]["page_start"] == 1
    assert chunks[0]["embedding_text"].startswith("科目：操作系统")
    assert "进程" in chunks[0]["keywords"]


def test_upload_pdf_indexes_document_and_chunks():
    headers = auth_headers()

    response = client.post(
        "/api/v1/documents/upload",
        headers=headers,
        data={"subject": "操作系统", "difficulty": "中等", "tags": "进程,线程"},
        files={"file": ("os.pdf", make_pdf_bytes(), "application/pdf")},
    )

    assert response.status_code == 201
    document = response.json()
    assert document["status"] == "indexed"
    assert document["subject"] == "操作系统"
    assert document["chunk_count"] >= 1
    assert document["quality_report"]["page_count"] == 1

    chunks = client.get(f"/api/v1/documents/{document['id']}/chunks", headers=headers)
    assert chunks.status_code == 200
    assert chunks.json()[0]["page_start"] == 1


def test_upload_rejects_non_pdf():
    response = client.post(
        "/api/v1/documents/upload",
        headers=auth_headers(),
        data={"subject": "数据库"},
        files={"file": ("notes.txt", b"not a pdf", "text/plain")},
    )

    assert response.status_code == 400
    assert "PDF" in response.json()["detail"]


def test_delete_document_removes_chunks():
    headers = auth_headers()
    upload = client.post(
        "/api/v1/documents/upload",
        headers=headers,
        data={"subject": "操作系统"},
        files={"file": ("os.pdf", make_pdf_bytes(), "application/pdf")},
    )
    document_id = upload.json()["id"]

    delete_response = client.delete(f"/api/v1/documents/{document_id}", headers=headers)
    chunks = client.get(f"/api/v1/documents/{document_id}/chunks", headers=headers)

    assert delete_response.status_code == 204
    assert chunks.status_code == 404
