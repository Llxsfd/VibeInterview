from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db import get_db
from app.models import DocumentChunk, KnowledgePoint, MistakeBook, Question, User, UserQuestionRecord
from app.schemas import AnswerSubmitRequest, KnowledgeExtractRequest, QuestionGenerateRequest

knowledge_router = APIRouter(prefix="/knowledge-points", tags=["knowledge-points"])
questions_router = APIRouter(prefix="/questions", tags=["questions"])
mistakes_router = APIRouter(prefix="/mistakes", tags=["mistakes"])


def _kp_dict(item: KnowledgePoint) -> dict:
    return {
        "id": item.id,
        "name": item.name,
        "subject": item.subject,
        "summary": item.summary,
        "difficulty": item.difficulty,
        "keywords": item.keywords,
        "source_chunk_ids": item.source_chunk_ids,
        "mastery_score": item.mastery_score,
    }


def _question_dict(item: Question) -> dict:
    return {
        "id": item.id,
        "type": item.type,
        "subject": item.subject,
        "knowledge_point_id": item.knowledge_point_id,
        "difficulty": item.difficulty,
        "stem": item.stem,
        "options": item.options,
        "answer": item.answer,
        "explanation": item.explanation,
        "source_chunk_ids": item.source_chunk_ids,
    }


@knowledge_router.post("/extract", status_code=status.HTTP_201_CREATED)
def extract_knowledge_points(
    payload: KnowledgeExtractRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    query = select(DocumentChunk).where(DocumentChunk.user_id == current_user.id)
    if payload.subject:
        query = query.where(DocumentChunk.subject == payload.subject)
    chunks = list(db.scalars(query.order_by(DocumentChunk.chunk_index).limit(8)))
    created: list[KnowledgePoint] = []
    for chunk in chunks:
        name = chunk.keywords[0] if chunk.keywords else chunk.section or chunk.chapter or chunk.subject
        existing = db.scalar(
            select(KnowledgePoint).where(
                KnowledgePoint.user_id == current_user.id,
                KnowledgePoint.name == name,
                KnowledgePoint.subject == chunk.subject,
            )
        )
        if existing:
            created.append(existing)
            continue
        kp = KnowledgePoint(
            user_id=current_user.id,
            name=name,
            subject=chunk.subject,
            summary=chunk.content[:180],
            difficulty="中等",
            keywords=chunk.keywords,
            source_chunk_ids=[chunk.id],
            mastery_score=0.25,
        )
        db.add(kp)
        created.append(kp)
    db.commit()
    for item in created:
        db.refresh(item)
    return [_kp_dict(item) for item in created]


@knowledge_router.get("")
def list_knowledge_points(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.scalars(select(KnowledgePoint).where(KnowledgePoint.user_id == current_user.id))
    return [_kp_dict(item) for item in items]


@questions_router.post("/generate", status_code=status.HTTP_201_CREATED)
def generate_questions(
    payload: QuestionGenerateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    kp = None
    if payload.knowledge_point_id:
        kp = db.scalar(select(KnowledgePoint).where(KnowledgePoint.id == payload.knowledge_point_id, KnowledgePoint.user_id == current_user.id))
        if not kp:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Knowledge point not found")
    chunks = []
    if kp and kp.source_chunk_ids:
        chunks = list(db.scalars(select(DocumentChunk).where(DocumentChunk.id.in_(kp.source_chunk_ids), DocumentChunk.user_id == current_user.id)))
    if not chunks:
        chunks = list(db.scalars(select(DocumentChunk).where(DocumentChunk.user_id == current_user.id).limit(payload.count)))

    questions: list[Question] = []
    for index, chunk in enumerate(chunks[: payload.count]):
        answer = chunk.keywords[0] if chunk.keywords else chunk.subject
        question = Question(
            user_id=current_user.id,
            type=payload.type,
            subject=chunk.subject,
            knowledge_point_id=kp.id if kp else None,
            difficulty="中等",
            stem=f"以下哪一项最能概括资料中的考点：{answer}？",
            options=[answer, "无关概念", "随机选项", "以上都不对"],
            answer=answer,
            explanation=f"资料片段指出：{chunk.content[:160]}",
            source_chunk_ids=[chunk.id],
        )
        db.add(question)
        questions.append(question)
    db.commit()
    for item in questions:
        db.refresh(item)
    return [_question_dict(item) for item in questions]


@questions_router.get("")
def list_questions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    items = db.scalars(select(Question).where(Question.user_id == current_user.id))
    return [_question_dict(item) for item in items]


@questions_router.post("/{question_id}/answer", status_code=status.HTTP_201_CREATED)
def answer_question(
    question_id: str,
    payload: AnswerSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    question = db.scalar(select(Question).where(Question.id == question_id, Question.user_id == current_user.id))
    if not question:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Question not found")
    is_correct = payload.user_answer.strip().lower() == question.answer.strip().lower()
    score = 1.0 if is_correct else 0.0
    feedback = "回答正确。" if is_correct else f"回答不完整，正确答案应包含：{question.answer}"
    record = UserQuestionRecord(
        user_id=current_user.id,
        question_id=question.id,
        user_answer=payload.user_answer,
        is_correct=is_correct,
        score=score,
        feedback=feedback,
    )
    db.add(record)
    if not is_correct:
        db.add(
            MistakeBook(
                user_id=current_user.id,
                question_id=question.id,
                knowledge_point_id=question.knowledge_point_id,
                user_answer=payload.user_answer,
                correct_answer=question.answer,
                mistake_reason=feedback,
                next_review_time=datetime.now(timezone.utc) + timedelta(days=1),
            )
        )
    db.commit()
    db.refresh(record)
    return {"id": record.id, "question_id": question.id, "is_correct": is_correct, "score": score, "feedback": feedback}


@mistakes_router.get("")
def list_mistakes(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    mistakes = db.scalars(select(MistakeBook).where(MistakeBook.user_id == current_user.id))
    return [
        {
            "id": item.id,
            "question_id": item.question_id,
            "knowledge_point_id": item.knowledge_point_id,
            "user_answer": item.user_answer,
            "correct_answer": item.correct_answer,
            "mistake_reason": item.mistake_reason,
            "review_count": item.review_count,
        }
        for item in mistakes
    ]


@mistakes_router.post("/{mistake_id}/review")
def review_mistake(mistake_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    mistake = db.scalar(select(MistakeBook).where(MistakeBook.id == mistake_id, MistakeBook.user_id == current_user.id))
    if not mistake:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mistake not found")
    mistake.review_count += 1
    mistake.next_review_time = datetime.now(timezone.utc) + timedelta(days=3)
    db.commit()
    db.refresh(mistake)
    return {"id": mistake.id, "review_count": mistake.review_count}


@mistakes_router.delete("/{mistake_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_mistake(mistake_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    mistake = db.scalar(select(MistakeBook).where(MistakeBook.id == mistake_id, MistakeBook.user_id == current_user.id))
    if not mistake:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Mistake not found")
    db.delete(mistake)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
