from app.services.retriever_service import RetrievedChunk


def build_answer(question: str, retrieved: list[RetrievedChunk]) -> dict:
    if not retrieved or retrieved[0].score < 0.15:
        return {
            "answer": "资料不足：当前上传资料中没有检索到足够相关的内容。建议上传相关资料，或换一种更贴近资料原文的提问方式。",
            "interview_answer": "",
            "follow_up_questions": [],
            "citations": [],
            "retrieved_chunks": [],
        }

    contexts = [item.chunk.content for item in retrieved]
    answer = f"基于你的资料，{question} 的答案可以概括为：{contexts[0]}"
    interview_answer = f"面试回答可以说：{contexts[0]}"
    follow_up_questions = [
        "这个知识点在实际面试中常见的追问是什么？",
        "它和相邻概念有什么区别？",
    ]
    citations = [
        {
            "chunk_id": item.chunk.id,
            "document_id": item.document.id,
            "document_name": item.document.file_name,
            "chapter": item.chunk.chapter,
            "section": item.chunk.section,
            "page_start": item.chunk.page_start,
            "page_end": item.chunk.page_end,
            "score": item.score,
        }
        for item in retrieved
    ]
    return {
        "answer": answer,
        "interview_answer": interview_answer,
        "follow_up_questions": follow_up_questions,
        "citations": citations,
        "retrieved_chunks": citations,
    }
