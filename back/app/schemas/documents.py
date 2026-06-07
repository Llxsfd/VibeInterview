from pydantic import BaseModel, ConfigDict


class DocumentRead(BaseModel):
    id: str
    title: str
    file_name: str
    file_size: int
    subject: str
    difficulty: str | None
    tags: list
    status: str
    page_count: int
    chunk_count: int
    quality_report: dict
    failure_reason: str | None

    model_config = ConfigDict(from_attributes=True)


class DocumentChunkRead(BaseModel):
    id: str
    document_id: str
    chunk_index: int
    content: str
    subject: str
    chapter: str | None
    section: str | None
    page_start: int
    page_end: int
    keywords: list

    model_config = ConfigDict(from_attributes=True)
