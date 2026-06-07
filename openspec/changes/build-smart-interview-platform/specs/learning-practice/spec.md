## ADDED Requirements

### Requirement: Knowledge points
The system SHALL extract and store user-owned knowledge points from chunks, including subject, summary, difficulty, keywords, source chunks, and mastery score.

#### Scenario: Extract knowledge points
- **WHEN** an authenticated user requests extraction from indexed material
- **THEN** the system creates knowledge points linked to source chunks

### Requirement: Question generation
The system SHALL generate user-owned questions from knowledge points or chunks with type, stem, options, answer, explanation, difficulty, and source chunks.

#### Scenario: Generate practice questions
- **WHEN** a user generates questions for a knowledge point
- **THEN** the system creates practice questions tied to that user and source material

### Requirement: Answer evaluation
The system SHALL evaluate choice and boolean answers automatically, SHALL score short answers with a deterministic rubric fallback, and SHALL store answer records with feedback.

#### Scenario: Submit answer
- **WHEN** a user submits an answer to a question
- **THEN** the system records correctness, score, and feedback

### Requirement: Mistake book
The system SHALL add incorrect or low-score answers to a mistake book and SHALL allow users to list, review, and remove their mistakes.

#### Scenario: Incorrect answer creates mistake
- **WHEN** a user answers a question incorrectly
- **THEN** the system creates or updates a mistake book entry for that user
