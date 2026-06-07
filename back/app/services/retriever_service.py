import re
from dataclasses import dataclass

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models import Document, DocumentChunk, User


@dataclass
class RetrievedChunk:
    chunk: DocumentChunk
    document: Document
    score: float


def tokenize(text: str) -> set[str]:
    tokens = re.findall(r"[A-Za-z][A-Za-z0-9+#-]*|[\u4e00-\u9fff]{2,8}", text.lower())
    return {token for token in tokens if len(token) > 1}


def retrieve_chunks(
    db: Session,
    user: User,
    question: str,
    subject: str | None = None,
    document_scope: list[str] | None = None,
    top_k: int = 5,
) -> list[RetrievedChunk]:
    query_tokens = tokenize(question)
    if not query_tokens:
        return []

    query = (
        select(DocumentChunk, Document)
        .join(Document, Document.id == DocumentChunk.document_id)
        .where(DocumentChunk.user_id == user.id, Document.user_id == user.id, Document.status == "indexed")
    )
    if subject:
        query = query.where(DocumentChunk.subject == subject)
    if document_scope:
        query = query.where(DocumentChunk.document_id.in_(document_scope))

    results: list[RetrievedChunk] = []
    for chunk, document in db.execute(query):
        chunk_tokens = tokenize(" ".join([chunk.content, " ".join(chunk.keywords), chunk.subject, chunk.chapter or "", chunk.section or ""]))
        overlap = query_tokens & chunk_tokens
        if not overlap:
            continue
        score = len(overlap) / max(len(query_tokens), 1)
        results.append(RetrievedChunk(chunk=chunk, document=document, score=round(score, 4)))

    results.sort(key=lambda item: item.score, reverse=True)
    return results[:top_k]
