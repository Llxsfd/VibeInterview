## ADDED Requirements

### Requirement: Secure user registration
The system SHALL allow a new user to register with username, email, and password, SHALL reject duplicate username or email values, SHALL enforce minimum password strength, SHALL store only a password hash, and SHALL create a learning profile for the user.

#### Scenario: Successful registration
- **WHEN** a visitor submits a unique username, unique email, and strong password
- **THEN** the system creates the user, creates the default profile, and returns an access token with user summary data

#### Scenario: Duplicate account rejected
- **WHEN** a visitor submits an email or username that already belongs to another user
- **THEN** the system rejects the request without changing the existing account

### Requirement: Authenticated sessions
The system SHALL allow registered users to log in with username or email plus password, SHALL return a JWT access token on success, and SHALL reject invalid credentials.

#### Scenario: Successful login
- **WHEN** a registered user submits valid credentials
- **THEN** the system returns a valid bearer token and the user's profile data

#### Scenario: Invalid login
- **WHEN** a user submits an unknown account or wrong password
- **THEN** the system returns an authentication error and no token

### Requirement: User data isolation
The system SHALL require authentication for protected APIs and SHALL filter user-owned records by the authenticated user's ID.

#### Scenario: Protected endpoint filters data
- **WHEN** an authenticated user lists documents, chats, interviews, mistakes, or study plans
- **THEN** the response contains only records owned by that user

### Requirement: Profile management
The system SHALL allow an authenticated user to view and update target role, target level, preparation days, current level, progress, and mastery summary.

#### Scenario: Update profile
- **WHEN** an authenticated user updates learning profile fields
- **THEN** the system persists the changes and returns the updated profile
