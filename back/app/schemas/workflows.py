from pydantic import BaseModel, Field


class KnowledgeExtractRequest(BaseModel):
    subject: str | None = None


class QuestionGenerateRequest(BaseModel):
    knowledge_point_id: str | None = None
    count: int = Field(default=3, ge=1, le=10)
    type: str = "single_choice"


class AnswerSubmitRequest(BaseModel):
    user_answer: str


class InterviewCreateRequest(BaseModel):
    mode: str
    subject: str | None = None
    document_scope: list[str] = Field(default_factory=list)
    target_role: str | None = None
    difficulty: str = "中等"
    question_count: int = Field(default=3, ge=1, le=10)


class InterviewAnswerRequest(BaseModel):
    turn_id: str
    user_answer: str
    answer_duration_seconds: int | None = None


class TtsRequest(BaseModel):
    text: str


class StudyPlanGenerateRequest(BaseModel):
    plan_days: int = Field(default=14, ge=1, le=60)
