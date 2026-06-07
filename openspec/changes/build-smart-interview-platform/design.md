## Context

The project has a small FastAPI skeleton in `back/` and a small Next.js skeleton in `front/`. The requirement and technology documents require a PostgreSQL-centered personal knowledge platform with RAG, interview, speech, and study workflows. The first deliverable must be locally runnable and testable, with deterministic mock AI behavior when external model keys are not configured.

The UI must feel like a modern learning and interview cockpit: glassmorphism surfaces, ambient background light, restrained fluid gradients, smooth transitions, and dense but readable task-focused pages.

## Goals / Non-Goals

**Goals:**
- Provide a complete full-stack MVP that lets a user register, log in, manage profile, upload/index documents, ask cited questions, practice, run mock interviews, view reports, manage mistakes, and generate study plans.
- Keep every user-owned query filtered by `user_id`.
- Store secrets only in backend environment variables or backend-owned persistence.
- Support local PostgreSQL bootstrap with mock data and deterministic service fallbacks.
- Add tests and per-module commits/log entries as modules become verified.

**Non-Goals:**
- Real-time video interview, independent admin backend, shared organization workspaces, production-grade OCR deployment, and private model hosting.
- Guaranteeing live third-party LLM/ASR/TTS calls without user-supplied provider credentials.

## Decisions

### Backend architecture

Use FastAPI routers by capability under `back/app/api/`, SQLAlchemy ORM models under `back/app/models/`, Pydantic schemas under `back/app/schemas/`, and domain services under `back/app/services/`. This matches the requested stack and keeps AI/RAG/PDF logic replaceable.

Alternative considered: one monolithic FastAPI file. It is faster initially but would make the many required workflows hard to test and maintain.

### Database and bootstrap

Use PostgreSQL as the target database with SQLAlchemy `create_all` bootstrap for this development phase, plus explicit index creation in models and a `scripts/bootstrap_db.py` command that can create the database if the local admin connection is reachable. The bootstrap attempts `CREATE EXTENSION IF NOT EXISTS vector`; if the local installation lacks pgvector, embedding data is still stored as JSON metadata so local tests continue to run.

Alternative considered: require Alembic migrations before any feature work. Alembic remains part of the stack direction, but `create_all` plus explicit bootstrap is better for getting the MVP runnable quickly.

### AI and retrieval strategy

Implement deterministic local AI fallbacks:
- Embeddings use a stable hash/token vector representation.
- Retrieval combines keyword overlap and simple vector-like score.
- RAG answers are composed from retrieved chunks with citations.
- Question generation, interview scoring, reports, ASR, and TTS use rubric-based fallback behavior.

Provider adapters read only backend env/config and can later call DeepSeek/Qwen/OpenAI/Whisper. This avoids storing model keys in frontend code.

### PDF ingestion

Use PyMuPDF when available to parse PDFs. If parsing cannot extract text, return a clear failure or fallback mock in tests. Clean text, identify headings with regex rules from the requirements, split by paragraph and length, then store chunk metadata and quality reports.

### Frontend architecture

Use Next.js App Router with a shared authenticated app shell, typed fetch helpers, reusable glass components, and page-specific workflows. The first screen is the product dashboard, not a marketing landing page. Login/register remain separate routes.

The visual direction is "translucent interview cockpit": dark neutral base, cool cyan and warm coral accents, blurred panels, thin borders, crisp typography, animated loading/hover states, and stable dimensions for repeated cards and controls.

### Testing and verification

Backend tests use pytest and FastAPI TestClient against an isolated SQLite database for service/API behavior, while production/local runtime uses PostgreSQL. Frontend verification uses TypeScript/Next build and lint where available. API smoke scripts exercise registration, login, document, chat, practice, interview, speech, and study-plan flows.

## Risks / Trade-offs

- [Risk] Local PostgreSQL server or pgvector may be absent from the machine. → Mitigation: bootstrap reports the exact failure, tests use SQLite, and runtime config remains PostgreSQL-first.
- [Risk] Deterministic mock AI is less capable than real LLM/ASR/TTS. → Mitigation: provider abstraction keeps keys server-side and makes real providers pluggable later.
- [Risk] Full platform scope is large. → Mitigation: deliver in independently verified modules with commits and development log entries.
- [Risk] Rich visual design can hurt readability. → Mitigation: keep operational pages dense, high contrast, and consistent; validate with local browser screenshots after major frontend work.

## Migration Plan

1. Commit OpenSpec planning artifacts.
2. Add backend settings, models, database bootstrap, seed data, and auth tests.
3. Add user/profile APIs and commit.
4. Add document ingestion services/APIs and commit.
5. Add RAG chat APIs and commit.
6. Add learning, practice, mistake, interview, speech, and plan APIs with tests and commits.
7. Add frontend shell and pages with glassmorphism UX and commit per workflow group.
8. Add Docker Compose/startup docs and run final verification.
