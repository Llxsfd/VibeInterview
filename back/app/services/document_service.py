from pathlib import Path

from fastapi import HTTPException, UploadFile, status
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models import ChunkEmbedding, Document, DocumentChunk, User
from app.services.chunk_service import split_pages_into_chunks
from app.services.pdf_parser_service import parse_pdf_bytes


def parse_tags(tags: str | None) -> list[str]:
    if not tags:
        return []
    return [tag.strip() for tag in tags.split(",") if tag.strip()]


def validate_pdf_upload(file: UploadFile, content: bytes) -> None:
    is_pdf_name = (file.filename or "").lower().endswith(".pdf")
    is_pdf_type = file.content_type in {"application/pdf", "application/x-pdf"}
    if not is_pdf_name or not is_pdf_type:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only PDF files are allowed")
    if len(content) > settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="PDF file is too large")


def create_indexed_document(
    db: Session,
    user: User,
    file: UploadFile,
    content: bytes,
    subject: str,
    difficulty: str | None = None,
    tags: str | None = None,
    note: str | None = None,
) -> Document:
    validate_pdf_upload(file, content)
    document = Document(
        user_id=user.id,
        title=Path(file.filename or "document.pdf").stem,
        file_name=file.filename or "document.pdf",
        file_path="pending",
        file_size=len(content),
        subject=subject,
        difficulty=difficulty,
        tags=parse_tags(tags),
        status="parsing",
        quality_report={"note": note} if note else {},
    )
    db.add(document)
    db.flush()

    storage_path = settings.STORAGE_DIR / "documents" / user.id
    storage_path.mkdir(parents=True, exist_ok=True)
    file_path = storage_path / f"{document.id}.pdf"
    file_path.write_bytes(content)
    document.file_path = str(file_path)

    parsed = parse_pdf_bytes(content)
    chunks = split_pages_into_chunks(parsed.pages, subject=subject)
    for chunk in chunks:
        db_chunk = DocumentChunk(
            user_id=user.id,
            document_id=document.id,
            chunk_index=chunk["chunk_index"],
            content=chunk["content"],
            embedding_text=chunk["embedding_text"],
            subject=chunk["subject"],
            chapter=chunk["chapter"],
            section=chunk["section"],
            page_start=chunk["page_start"],
            page_end=chunk["page_end"],
            keywords=chunk["keywords"],
            extra_metadata=chunk["metadata"],
        )
        db.add(db_chunk)
        db.flush()
        db.add(ChunkEmbedding(user_id=user.id, chunk_id=db_chunk.id, embedding=chunk["embedding"]))

    avg_length = int(sum(len(chunk["content"]) for chunk in chunks) / len(chunks)) if chunks else 0
    document.page_count = len(parsed.pages)
    document.chunk_count = len(chunks)
    document.status = "indexed" if chunks else "failed"
    document.failure_reason = None if chunks else "No extractable text chunks"
    document.quality_report = {
        **document.quality_report,
        "page_count": len(parsed.pages),
        "chunk_count": len(chunks),
        "avg_chunk_length": avg_length,
        "empty_pages": parsed.empty_pages,
        "ocr_pages": parsed.ocr_pages,
    }
    db.commit()
    db.refresh(document)
    return document


def get_user_document(db: Session, user: User, document_id: str) -> Document:
    document = db.scalar(select(Document).where(Document.id == document_id, Document.user_id == user.id))
    if not document:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")
    return document


def delete_document(db: Session, user: User, document_id: str) -> None:
    document = get_user_document(db, user, document_id)
    chunk_ids = [
        row[0]
        for row in db.execute(select(DocumentChunk.id).where(DocumentChunk.document_id == document.id, DocumentChunk.user_id == user.id))
    ]
    if chunk_ids:
        db.execute(delete(ChunkEmbedding).where(ChunkEmbedding.chunk_id.in_(chunk_ids), ChunkEmbedding.user_id == user.id))
    db.execute(delete(DocumentChunk).where(DocumentChunk.document_id == document.id, DocumentChunk.user_id == user.id))
    try:
        Path(document.file_path).unlink(missing_ok=True)
    except OSError:
        pass
    db.delete(document)
    db.commit()
