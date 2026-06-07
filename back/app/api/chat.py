from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db import get_db
from app.models import ChatMessage, ChatSession, User
from app.schemas import ChatAnswerRead, ChatQuestionCreate, ChatSessionCreate, ChatSessionRead, RetrievedChunkRead
from app.services.rag_service import build_answer
from app.services.retriever_service import retrieve_chunks

router = APIRouter(prefix="/chat", tags=["chat"])


def get_user_session(db: Session, user: User, session_id: str) -> ChatSession:
    session = db.scalar(select(ChatSession).where(ChatSession.id == session_id, ChatSession.user_id == user.id))
    if not session:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat session not found")
    return session


@router.post("/sessions", response_model=ChatSessionRead, status_code=status.HTTP_201_CREATED)
def create_session(
    payload: ChatSessionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = ChatSession(
        user_id=current_user.id,
        title=payload.title,
        subject=payload.subject,
        document_scope=payload.document_scope,
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("/sessions", response_model=list[ChatSessionRead])
def list_sessions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return list(db.scalars(select(ChatSession).where(ChatSession.user_id == current_user.id).order_by(ChatSession.updated_at.desc())))


@router.get("/sessions/{session_id}", response_model=ChatSessionRead)
def read_session(session_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return get_user_session(db, current_user, session_id)


@router.post("/sessions/{session_id}/messages", response_model=ChatAnswerRead, status_code=status.HTTP_201_CREATED)
def ask_question(
    session_id: str,
    payload: ChatQuestionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    session = get_user_session(db, current_user, session_id)
    db.add(ChatMessage(session_id=session.id, user_id=current_user.id, role="user", content=payload.question))

    retrieved = retrieve_chunks(
        db,
        current_user,
        payload.question,
        subject=session.subject,
        document_scope=session.document_scope,
        top_k=payload.top_k,
    )
    answer_payload = build_answer(payload.question, retrieved)
    assistant = ChatMessage(
        session_id=session.id,
        user_id=current_user.id,
        role="assistant",
        content=answer_payload["answer"],
        retrieved_chunks=answer_payload["retrieved_chunks"],
    )
    db.add(assistant)
    db.commit()
    db.refresh(assistant)

    return ChatAnswerRead(
        message_id=assistant.id,
        answer=answer_payload["answer"],
        interview_answer=answer_payload["interview_answer"],
        follow_up_questions=answer_payload["follow_up_questions"],
        citations=answer_payload["citations"],
    )


@router.get("/messages/{message_id}/retrieved-chunks", response_model=list[RetrievedChunkRead])
def read_retrieved_chunks(
    message_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    message = db.scalar(select(ChatMessage).where(ChatMessage.id == message_id, ChatMessage.user_id == current_user.id))
    if not message:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Chat message not found")
    return message.retrieved_chunks
