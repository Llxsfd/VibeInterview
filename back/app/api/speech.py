from pathlib import Path

from fastapi import APIRouter, Depends, File, Form, Response, UploadFile, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.config import settings
from app.db import get_db
from app.models import InterviewAnswerAudio, User
from app.schemas import TtsRequest

router = APIRouter(prefix="/speech", tags=["speech"])


@router.post("/asr", status_code=status.HTTP_201_CREATED)
async def asr(
    file: UploadFile = File(...),
    duration_seconds: int = Form(default=0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    content = await file.read()
    audio = InterviewAnswerAudio(
        user_id=current_user.id,
        audio_url="pending",
        duration_seconds=duration_seconds,
        file_size=len(content),
        transcript="未配置 ASR 服务，当前返回本地 fallback 转写结果。",
    )
    db.add(audio)
    db.flush()
    storage = settings.STORAGE_DIR / "audios" / current_user.id
    storage.mkdir(parents=True, exist_ok=True)
    path = storage / f"{audio.id}-{file.filename or 'answer.webm'}"
    path.write_bytes(content)
    audio.audio_url = str(path)
    db.commit()
    db.refresh(audio)
    return {"audio_id": audio.id, "transcript": audio.transcript, "duration_seconds": audio.duration_seconds}


@router.post("/tts")
def tts(payload: TtsRequest, current_user: User = Depends(get_current_user)):
    return {"provider": "local-fallback", "text": payload.text, "audio_url": None}


@router.delete("/audios/{audio_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_audio(audio_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    audio = db.scalar(select(InterviewAnswerAudio).where(InterviewAnswerAudio.id == audio_id, InterviewAnswerAudio.user_id == current_user.id))
    if audio:
        try:
            Path(audio.audio_url).unlink(missing_ok=True)
        except OSError:
            pass
        db.delete(audio)
        db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
