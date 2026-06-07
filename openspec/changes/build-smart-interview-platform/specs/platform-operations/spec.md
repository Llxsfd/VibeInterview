## ADDED Requirements

### Requirement: Database bootstrap
The system SHALL support local PostgreSQL database creation using the documented `postgres` user and `llx123123` password, SHALL create tables and indexes, SHALL attempt to enable pgvector, and SHALL seed mock data for testing.

#### Scenario: Bootstrap local database
- **WHEN** the bootstrap command runs against a reachable PostgreSQL server
- **THEN** the database, extension attempt, tables, indexes, and seed records are created

### Requirement: Environment and secrets
The system SHALL provide safe environment examples and SHALL keep model provider keys and secrets outside frontend code and committed files.

#### Scenario: Configure secrets
- **WHEN** a developer configures model provider credentials
- **THEN** credentials are read from backend environment variables or protected backend storage

### Requirement: Automated verification
The system SHALL include backend API/service tests and frontend build/lint checks that cover the developed modules.

#### Scenario: Run tests
- **WHEN** the verification commands are executed
- **THEN** backend tests and frontend checks complete with no failures for implemented modules

### Requirement: Deployment scaffolding
The system SHALL provide Docker Compose scaffolding for frontend, backend, PostgreSQL, Redis, and worker processes.

#### Scenario: Start services
- **WHEN** a developer follows the startup guide
- **THEN** the frontend and backend can be launched locally and target the configured database and API URLs
