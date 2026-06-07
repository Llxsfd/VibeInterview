## Why

The repository currently contains only a minimal FastAPI and Next.js skeleton, while the product requirements call for a complete personal smart interview platform. This change turns the documented requirements into a working, testable full-stack application with PostgreSQL-backed data, secure user isolation, PDF knowledge ingestion, RAG-style Q&A, practice, interviews, voice workflows, reports, and a polished glassmorphism UI.

## What Changes

- Build a FastAPI backend with modular routers, SQLAlchemy models, PostgreSQL connection management, authentication, seeded mock data, and API tests.
- Build a Next.js App Router frontend with a dashboard-first experience, glassmorphism styling, ambient backgrounds, smooth transitions, and user workflows for all MVP areas.
- Add PostgreSQL schema creation, indexes, pgvector extension bootstrap where available, and local mock data seeding.
- Add PDF ingestion services for text extraction, cleaning, section recognition, chunking, mock embedding, and quality reports.
- Add RAG-style chat with user-scoped retrieval, source citations, low-confidence handling, and retrieval debug visibility.
- Add knowledge points, generated practice questions, answer records, mistake book, interview sessions, scoring, reports, speech placeholders, and study plans.
- Add automated backend and frontend verification commands and keep `DEVELOPMENT_LOG.md` updated after each completed module commit.

## Capabilities

### New Capabilities
- `account-security`: User registration, login, JWT sessions, profile updates, password hashing, and user-scoped access.
- `document-ingestion`: PDF upload, local file storage, parsing, cleaning, chunking, embedding records, document status, deletion, reindexing, and chunk previews.
- `rag-chat`: User-scoped chat sessions, hybrid retrieval, citations, retrieved chunk visibility, and low-confidence responses.
- `learning-practice`: Knowledge point extraction/listing, question generation, answer evaluation, records, and mistake book management.
- `interview-reporting`: Interview creation, interview turns, text answers, scoring, follow-up questions, finishing, and report generation.
- `speech-study-plan`: Browser recording workflow support, ASR/TTS API placeholders, audio records, voice metrics, and personalized study plans.
- `frontend-experience`: Next.js pages, components, data fetching, glassmorphism design system, transitions, and responsive desktop-first UX.
- `platform-operations`: Database bootstrap, indexes, seed data, environment examples, Docker Compose, startup guide, and automated tests.

### Modified Capabilities
- None. This repository has no existing OpenSpec specs.

## Impact

- Backend: `back/app/**`, `back/tests/**`, `back/requirements.txt`, environment examples, database bootstrap scripts.
- Frontend: `front/src/app/**`, `front/src/components/**`, `front/src/lib/**`, Tailwind configuration, package dependencies.
- Infrastructure: PostgreSQL database creation support, optional pgvector extension, Redis/Docker Compose scaffolding, storage directories.
- Documentation: OpenSpec artifacts, `DEVELOPMENT_LOG.md`, startup and verification guidance.
