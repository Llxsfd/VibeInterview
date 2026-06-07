## ADDED Requirements

### Requirement: Chat sessions
The system SHALL allow authenticated users to create, list, inspect, and continue chat sessions with optional subject and document scope.

#### Scenario: Create chat session
- **WHEN** an authenticated user creates a chat session
- **THEN** the system stores the session and returns it with empty message history

### Requirement: User-scoped retrieval
The system SHALL retrieve only chunks owned by the authenticated user, SHALL support subject and document filters, SHALL combine keyword and vector-like signals, SHALL deduplicate chunks, and SHALL rank the final context.

#### Scenario: Retrieve scoped chunks
- **WHEN** a user asks a question with a subject filter
- **THEN** the system returns only matching chunks owned by that user

### Requirement: Low-confidence refusal
The system SHALL avoid fabricated answers when retrieval confidence is insufficient and SHALL tell users that their materials do not contain enough evidence.

#### Scenario: Insufficient material
- **WHEN** retrieval returns no relevant chunks
- **THEN** the assistant answer states that the uploaded materials are insufficient and suggests uploading relevant material or rephrasing

### Requirement: Cited answers and debug visibility
The system SHALL save user and assistant messages, SHALL include cited document, chapter, section, page, and score information, and SHALL expose retrieved chunks for a message.

#### Scenario: Answer with citations
- **WHEN** a user sends a question that matches indexed chunks
- **THEN** the assistant response includes a concise answer, interview-style answer, follow-up questions, and source citations
