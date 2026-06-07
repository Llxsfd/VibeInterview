## ADDED Requirements

### Requirement: Speech recording workflow
The frontend SHALL support microphone permission request, recording state, stop/re-record actions, editable transcript state, and privacy notice for voice data.

#### Scenario: Record answer
- **WHEN** a user records an interview answer in a supported browser
- **THEN** the UI shows recording status, lets the user stop recording, and presents editable transcript text before submission

### Requirement: ASR and TTS API placeholders
The backend SHALL provide authenticated ASR and TTS endpoints that store audio metadata, protect user-owned audio records, and return deterministic local fallback results when no model provider key is configured.

#### Scenario: ASR fallback
- **WHEN** a user uploads an audio file without configured ASR provider credentials
- **THEN** the system stores the audio metadata and returns a clear fallback transcript message

### Requirement: Personalized study plans
The system SHALL generate study plans from profile goals, weak knowledge points, mistakes, and interview reports, and SHALL allow users to update daily task completion.

#### Scenario: Generate plan
- **WHEN** a user requests a study plan
- **THEN** the system creates daily tasks covering knowledge review, practice questions, and mock interview actions
