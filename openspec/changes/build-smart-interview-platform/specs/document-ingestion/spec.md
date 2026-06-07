## ADDED Requirements

### Requirement: PDF upload and document records
The system SHALL allow authenticated users to upload one or more PDF files, SHALL reject non-PDF files and oversized files, SHALL store files outside public frontend assets, and SHALL create document records with status and metadata.

#### Scenario: Upload PDF
- **WHEN** an authenticated user uploads a valid PDF with subject, difficulty, tags, and notes
- **THEN** the system stores the file, creates a user-owned document, and returns the document status

#### Scenario: Reject unsafe upload
- **WHEN** an authenticated user uploads a non-PDF file
- **THEN** the system rejects the upload and does not create document or chunk records

### Requirement: PDF parsing and chunking
The system SHALL parse text PDF pages, preserve page numbers, clean text, detect common chapter/section titles, split content into ordered chunks, and build embedding text containing subject, chapter, section, and body.

#### Scenario: Ingest document text
- **WHEN** a document is indexed
- **THEN** the system creates ordered chunks with content, embedding text, subject, chapter, section, page range, keywords, and metadata

### Requirement: Embedding persistence
The system SHALL create embedding records for chunks, SHALL bootstrap the pgvector extension where available, and SHALL retain a deterministic fallback embedding representation for local testing.

#### Scenario: Store chunk embedding
- **WHEN** a chunk is created
- **THEN** the system stores a user-owned embedding record linked to that chunk

### Requirement: Document lifecycle
The system SHALL support listing, filtering, details, chunk preview, reindexing, and deletion of user-owned documents, and SHALL delete related chunks and embeddings when a document is deleted.

#### Scenario: Delete document
- **WHEN** an authenticated user deletes one of their documents
- **THEN** the document, related chunks, and related embeddings are removed and no longer participate in retrieval

### Requirement: Ingestion quality report
The system SHALL expose page count, chunk count, average chunk length, empty pages, OCR pages, and failure reason for a document.

#### Scenario: View quality report
- **WHEN** an authenticated user opens a document detail view
- **THEN** the system returns ingestion status and quality report fields for that document
