import re

CHAPTER_PATTERNS = [
    re.compile(r"^(第[一二三四五六七八九十百\d]+章\s+.+)$"),
    re.compile(r"^([一二三四五六七八九十]+、.+)$"),
]
SECTION_PATTERNS = [
    re.compile(r"^(\d+(?:\.\d+)+\s+.+)$"),
    re.compile(r"^(（[一二三四五六七八九十]+）.+)$"),
    re.compile(r"^(\d+、.+)$"),
]


def clean_text(text: str) -> str:
    lines = []
    for raw_line in text.splitlines():
        line = re.sub(r"[ \t]+", " ", raw_line).strip()
        if not line:
            continue
        if re.fullmatch(r"\d{1,4}", line):
            continue
        lines.append(line)
    return "\n".join(lines)


def detect_heading(line: str) -> tuple[str, str] | None:
    normalized = re.sub(r"\s+", " ", line).strip()
    for pattern in CHAPTER_PATTERNS:
        match = pattern.match(normalized)
        if match:
            return "chapter", match.group(1)
    for pattern in SECTION_PATTERNS:
        match = pattern.match(normalized)
        if match:
            return "section", match.group(1)
    return None


def extract_keywords(text: str, limit: int = 8) -> list[str]:
    domain_terms = [
        "进程",
        "线程",
        "调度",
        "资源",
        "CPU",
        "TCP",
        "UDP",
        "索引",
        "事务",
        "死锁",
        "缓存",
    ]
    keywords: list[str] = []
    seen: set[str] = set()
    for term in domain_terms:
        if term in text and term not in seen:
            keywords.append(term)
            seen.add(term)
            if len(keywords) >= limit:
                return keywords

    candidates = re.findall(r"[A-Za-z][A-Za-z0-9+#]{1,20}|[\u4e00-\u9fff]{2,8}", text)
    for candidate in candidates:
        if candidate in seen:
            continue
        seen.add(candidate)
        keywords.append(candidate)
        if len(keywords) >= limit:
            break
    return keywords
