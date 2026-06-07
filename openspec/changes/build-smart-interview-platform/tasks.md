## 1. Planning and Project Baseline

- [x] 1.1 Validate OpenSpec artifacts for `build-smart-interview-platform`
- [x] 1.2 Commit OpenSpec proposal, specs, design, and task plan
- [x] 1.3 Install/update backend and frontend dependencies required by the documented stack
- [x] 1.4 Run baseline backend and frontend checks and record any pre-existing failures

## 2. Backend Foundation, Database, and Auth

- [x] 2.1 Add backend configuration for PostgreSQL, JWT, storage, model providers, upload limits, and CORS
- [x] 2.2 Add SQLAlchemy database session, declarative base, and model registry
- [x] 2.3 Implement ORM models, relationships, indexes, JSON metadata, and pgvector bootstrap attempt
- [x] 2.4 Add database bootstrap and seed script using local PostgreSQL credentials
- [x] 2.5 Write failing auth/profile API tests
- [x] 2.6 Implement password hashing, JWT helpers, auth dependencies, register/login/me/profile APIs
- [x] 2.7 Run backend auth/profile tests and commit the verified module
- [x] 2.8 Append backend foundation/auth entry to `DEVELOPMENT_LOG.md`

## 3. Document Ingestion Module

- [x] 3.1 Write failing tests for PDF validation, text cleaning, heading detection, chunking, and user-scoped document APIs
- [x] 3.2 Implement document schemas, parser, cleaner, chunker, deterministic embedding service, and quality report
- [x] 3.3 Implement document upload/list/detail/chunks/reindex/delete APIs with file safety checks
- [x] 3.4 Run document tests and API smoke requests, then commit the verified module
- [x] 3.5 Append document ingestion entry to `DEVELOPMENT_LOG.md`

## 4. RAG Chat Module

- [x] 4.1 Write failing tests for scoped retrieval, low-confidence refusal, cited answers, and retrieved-chunk debug API
- [x] 4.2 Implement chat schemas, retrieval service, deterministic RAG answer service, and chat routers
- [x] 4.3 Run RAG chat tests and API smoke requests, then commit the verified module
- [x] 4.4 Append RAG chat entry to `DEVELOPMENT_LOG.md`

## 5. Learning, Practice, Mistake, Interview, Speech, and Study APIs

- [x] 5.1 Write failing tests for knowledge point extraction, question generation, answer evaluation, and mistake book updates
- [x] 5.2 Implement knowledge point, question, answer record, and mistake APIs
- [x] 5.3 Write failing tests for interview creation, answer scoring, finishing, and report generation
- [x] 5.4 Implement interview session, turn, score, follow-up, and report APIs
- [x] 5.5 Write failing tests for ASR/TTS fallback, audio delete, study plan generation, and task completion updates
- [x] 5.6 Implement speech and study-plan APIs with protected storage and deterministic fallbacks
- [x] 5.7 Run module tests and API smoke requests, then commit each verified API group
- [x] 5.8 Append learning/interview/speech/study entries to `DEVELOPMENT_LOG.md`

## 6. Frontend Experience

- [x] 6.1 Add frontend dependencies for query caching, forms, validation, state, and motion
- [x] 6.2 Implement API client, auth/session store, query provider, route guards, and shared app shell
- [x] 6.3 Implement login/register/profile pages with polished form states
- [x] 6.4 Implement dashboard, documents, document detail, and chat pages
- [x] 6.5 Implement knowledge points, questions, mistakes, study plan pages
- [x] 6.6 Implement interview list/new/detail/report pages with text and voice-answer UI states
- [x] 6.7 Apply glassmorphism design system, ambient backgrounds, responsive layout, and smooth transitions globally
- [x] 6.8 Run frontend lint/build and browser visual verification, then commit verified frontend groups
- [ ] 6.9 Append frontend experience entries to `DEVELOPMENT_LOG.md`

## 7. Operations and Final Verification

- [ ] 7.1 Add `.env.example`, Docker Compose, storage directories, and startup guide updates
- [ ] 7.2 Run database bootstrap against local PostgreSQL if reachable and record result
- [ ] 7.3 Run full backend test suite
- [ ] 7.4 Run full frontend lint/build suite
- [ ] 7.5 Run end-to-end API smoke script for the main user journey
- [ ] 7.6 Validate OpenSpec change status
- [ ] 7.7 Commit operations/final verification documentation
