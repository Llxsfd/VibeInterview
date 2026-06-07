from app.services.embedding_service import deterministic_embedding
from app.services.text_cleaner_service import clean_text, detect_heading, extract_keywords


def _split_long_text(text: str, chunk_size: int, chunk_overlap: int) -> list[str]:
    if len(text) <= chunk_size:
        return [text]
    parts = []
    start = 0
    while start < len(text):
        end = min(len(text), start + chunk_size)
        parts.append(text[start:end])
        if end == len(text):
            break
        start = max(0, end - chunk_overlap)
    return parts


def split_pages_into_chunks(
    pages: list[dict],
    subject: str,
    chunk_size: int = 700,
    chunk_overlap: int = 100,
    min_chunk_length: int = 20,
) -> list[dict]:
    chunks: list[dict] = []
    chapter: str | None = None
    section: str | None = None
    chunk_index = 0

    for page in pages:
        page_number = int(page["page"])
        cleaned = clean_text(page.get("text", ""))
        buffer: list[str] = []

        for line in cleaned.splitlines():
            heading = detect_heading(line)
            if heading:
                if buffer:
                    chunk_index = _append_chunks(
                        chunks, buffer, subject, chapter, section, page_number, chunk_index, chunk_size, chunk_overlap, min_chunk_length
                    )
                    buffer = []
                heading_type, title = heading
                if heading_type == "chapter":
                    chapter = title
                    section = None
                else:
                    section = title
                continue
            buffer.append(line)

        if buffer:
            chunk_index = _append_chunks(
                chunks, buffer, subject, chapter, section, page_number, chunk_index, chunk_size, chunk_overlap, min_chunk_length
            )

    return chunks


def _append_chunks(
    chunks: list[dict],
    lines: list[str],
    subject: str,
    chapter: str | None,
    section: str | None,
    page_number: int,
    chunk_index: int,
    chunk_size: int,
    chunk_overlap: int,
    min_chunk_length: int,
) -> int:
    content = "\n".join(lines).strip()
    if len(content) < min_chunk_length:
        return chunk_index

    for part in _split_long_text(content, chunk_size, chunk_overlap):
        embedding_text = "\n".join(
            [
                f"科目：{subject}",
                f"章节：{chapter or ''}",
                f"小节：{section or ''}",
                f"正文：{part}",
            ]
        )
        chunks.append(
            {
                "chunk_index": chunk_index,
                "content": part,
                "embedding_text": embedding_text,
                "subject": subject,
                "chapter": chapter,
                "section": section,
                "page_start": page_number,
                "page_end": page_number,
                "keywords": extract_keywords(part),
                "embedding": deterministic_embedding(embedding_text),
                "metadata": {"source": "pdf_parser"},
            }
        )
        chunk_index += 1
    return chunk_index
