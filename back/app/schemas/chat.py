from pydantic import BaseModel, ConfigDict, Field


class ChatSessionCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    subject: str | None = None
    document_scope: list[str] = Field(default_factory=list)


class ChatSessionRead(BaseModel):
    id: str
    title: str
    subject: str | None
    document_scope: list

    model_config = ConfigDict(from_attributes=True)


class ChatQuestionCreate(BaseModel):
    question: str = Field(min_length=1)
    top_k: int = Field(default=5, ge=1, le=8)


class ChatAnswerRead(BaseModel):
    message_id: str
    answer: str
    interview_answer: str
    follow_up_questions: list[str]
    citations: list[dict]


class RetrievedChunkRead(BaseModel):
    chunk_id: str
    document_id: str
    document_name: str
    chapter: str | None
    section: str | None
    page_start: int
    page_end: int
    score: float
