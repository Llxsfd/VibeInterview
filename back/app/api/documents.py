from fastapi import APIRouter, Depends, File, Form, Response, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db import get_db
from app.models import Document, DocumentChunk, User
from app.schemas import DocumentChunkRead, DocumentRead
from app.services.document_service import create_indexed_document, delete_document, get_user_document

router = APIRouter(prefix="/documents", tags=["documents"])


@router.post("/upload", response_model=DocumentRead, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    subject: str = Form(...),
    difficulty: str | None = Form(default=None),
    tags: str | None = Form(default=None),
    note: str | None = Form(default=None),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    content = await file.read()
    return create_indexed_document(db, current_user, file, content, subject, difficulty, tags, note)


@router.get("", response_model=list[DocumentRead])
def list_documents(
    subject: str | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = select(Document).where(Document.user_id == current_user.id).order_by(Document.created_at.desc())
    if subject:
        query = query.where(Document.subject == subject)
    return list(db.scalars(query))


@router.get("/{document_id}", response_model=DocumentRead)
def read_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return get_user_document(db, current_user, document_id)


@router.get("/{document_id}/chunks", response_model=list[DocumentChunkRead])
def list_document_chunks(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    document = get_user_document(db, current_user, document_id)
    return list(
        db.scalars(
            select(DocumentChunk)
            .where(DocumentChunk.document_id == document.id, DocumentChunk.user_id == current_user.id)
            .order_by(DocumentChunk.chunk_index)
        )
    )


@router.post("/{document_id}/reindex", response_model=DocumentRead)
def reindex_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    document = get_user_document(db, current_user, document_id)
    return document


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_document(
    document_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    delete_document(db, current_user, document_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
