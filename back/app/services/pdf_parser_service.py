from dataclasses import dataclass

import fitz


@dataclass
class ParsedPdf:
    pages: list[dict]
    empty_pages: list[int]
    ocr_pages: list[int]


def parse_pdf_bytes(content: bytes) -> ParsedPdf:
    pages: list[dict] = []
    empty_pages: list[int] = []
    with fitz.open(stream=content, filetype="pdf") as document:
        for index, page in enumerate(document, start=1):
            text = page.get_text("text").strip()
            if not text:
                empty_pages.append(index)
            pages.append({"page": index, "text": text})
    return ParsedPdf(pages=pages, empty_pages=empty_pages, ocr_pages=[])
