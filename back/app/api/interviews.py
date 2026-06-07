from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db import get_db
from app.models import DocumentChunk, InterviewSession, InterviewTurn, User
from app.schemas import InterviewAnswerRequest, InterviewCreateRequest

router = APIRouter(prefix="/interviews", tags=["interviews"])


def turn_dict(turn: InterviewTurn) -> dict:
    return {
        "id": turn.id,
        "question": turn.question,
        "user_answer": turn.user_answer,
        "reference_answer": turn.reference_answer,
        "rubric": turn.rubric,
        "score": turn.score,
        "feedback": turn.feedback,
        "follow_up_question": turn.follow_up_question,
        "source_chunk_ids": turn.source_chunk_ids,
    }


def session_dict(session: InterviewSession, db: Session) -> dict:
    turns = list(db.scalars(select(InterviewTurn).where(InterviewTurn.session_id == session.id).order_by(InterviewTurn.created_at)))
    return {
        "id": session.id,
        "mode": session.mode,
        "subject": session.subject,
        "difficulty": session.difficulty,
        "status": session.status,
        "total_score": session.total_score,
        "turns": [turn_dict(turn) for turn in turns],
    }


def get_session(db: Session, user: User, session_id: str) -> InterviewSession:
    session = db.scalar(select(InterviewSession).where(InterviewSession.id == session_id, InterviewSession.user_id == user.id))
    if not session:
        raise HTTPException(status_code=404, detail="Interview not found")
    return session


@router.post("", status_code=201)
def create_interview(payload: InterviewCreateRequest, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    query = select(DocumentChunk).where(DocumentChunk.user_id == current_user.id)
    if payload.subject:
        query = query.where(DocumentChunk.subject == payload.subject)
    if payload.document_scope:
        query = query.where(DocumentChunk.document_id.in_(payload.document_scope))
    chunks = list(db.scalars(query.limit(payload.question_count)))
    if not chunks:
        raise HTTPException(status_code=400, detail="No indexed chunks available for interview")

    session = InterviewSession(
        user_id=current_user.id,
        mode=payload.mode,
        subject=payload.subject,
        document_scope=payload.document_scope,
        target_role=payload.target_role,
        difficulty=payload.difficulty,
    )
    db.add(session)
    db.flush()
    for chunk in chunks:
        keyword = chunk.keywords[0] if chunk.keywords else chunk.subject
        db.add(
            InterviewTurn(
                session_id=session.id,
                user_id=current_user.id,
                question=f"请解释 {keyword}，并结合资料说明它的面试考点。",
                reference_answer=chunk.content,
                rubric={"coverage": 6, "accuracy": 3, "clarity": 1},
                source_chunk_ids=[chunk.id],
            )
        )
    db.commit()
    db.refresh(session)
    return session_dict(session, db)


@router.get("")
def list_interviews(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    sessions = db.scalars(select(InterviewSession).where(InterviewSession.user_id == current_user.id))
    return [session_dict(item, db) for item in sessions]


@router.get("/{session_id}")
def read_interview(session_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return session_dict(get_session(db, current_user, session_id), db)


@router.post("/{session_id}/answer")
def answer_interview(
    session_id: str,
    payload: InterviewAnswerRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    get_session(db, current_user, session_id)
    turn = db.scalar(
        select(InterviewTurn).where(
            InterviewTurn.id == payload.turn_id,
            InterviewTurn.session_id == session_id,
            InterviewTurn.user_id == current_user.id,
        )
    )
    if not turn:
        raise HTTPException(status_code=404, detail="Interview turn not found")
    answer_terms = set(payload.user_answer.lower().split())
    reference_terms = set(turn.reference_answer.lower().split())
    overlap = answer_terms & reference_terms
    score = round(min(10.0, max(1.0, len(overlap) / max(len(reference_terms), 1) * 10)), 2)
    turn.user_answer = payload.user_answer
    turn.answer_duration_seconds = payload.answer_duration_seconds
    turn.score = score
    turn.feedback = "回答覆盖了资料中的关键点。" if score >= 5 else "回答偏少，需要补充资料中的关键概念。"
    turn.follow_up_question = "如果面试官继续追问，你会如何举例说明这个知识点？"
    db.commit()
    db.refresh(turn)
    return turn_dict(turn)


@router.post("/{session_id}/finish")
def finish_interview(session_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    session = get_session(db, current_user, session_id)
    turns = list(db.scalars(select(InterviewTurn).where(InterviewTurn.session_id == session.id)))
    scored = [turn.score or 0 for turn in turns]
    session.total_score = round(sum(scored) / len(scored), 2) if scored else 0
    session.status = "finished"
    session.finished_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(session)
    return session_dict(session, db)


@router.get("/{session_id}/report")
def interview_report(session_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    session = get_session(db, current_user, session_id)
    turns = list(db.scalars(select(InterviewTurn).where(InterviewTurn.session_id == session.id)))
    weak_points = [turn.question for turn in turns if (turn.score or 0) < 6]
    return {
        "session_id": session.id,
        "total_score": session.total_score or 0,
        "turns": [turn_dict(turn) for turn in turns],
        "weak_points": weak_points,
        "recommendations": ["复习本场引用的 chunk", "补齐回答中的定义、场景和对比点"],
    }
