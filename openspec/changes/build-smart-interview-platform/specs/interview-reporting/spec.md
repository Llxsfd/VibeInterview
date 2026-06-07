## ADDED Requirements

### Requirement: Interview creation
The system SHALL allow users to create interview sessions by mode, subject, document scope, target role, difficulty, and question count.

#### Scenario: Create interview
- **WHEN** a user creates an interview session
- **THEN** the system stores the session and generates initial turns from user-owned material

### Requirement: Interview answering and scoring
The system SHALL accept text answers, record duration, score answers against reference points, provide feedback, identify missing points, and generate follow-up questions.

#### Scenario: Score interview answer
- **WHEN** a user submits an answer for an interview turn
- **THEN** the system stores the answer, score, feedback, follow-up question, and answer duration

### Requirement: Finish interview and report
The system SHALL finish an interview manually or when all turns are answered, SHALL compute total score, SHALL identify weak knowledge points, and SHALL generate a report with recommendations.

#### Scenario: Generate report
- **WHEN** a user finishes an interview
- **THEN** the system returns total score, per-turn scores, weak points, review suggestions, and cited material
