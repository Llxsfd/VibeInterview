## ADDED Requirements

### Requirement: Application routes
The frontend SHALL provide routes for login, register, dashboard, documents, document detail, chat, knowledge points, questions, interviews, interview detail, report, mistakes, study plan, and profile.

#### Scenario: Navigate app
- **WHEN** a user opens the app after login
- **THEN** the user can navigate all major workflows from the primary shell without dead-end placeholder pages

### Requirement: Glassmorphism design system
The frontend SHALL use a cohesive glassmorphism visual system with ambient backgrounds, restrained fluid gradients, high signal-to-noise layout, readable typography, and consistent interactive states.

#### Scenario: Render dashboard
- **WHEN** the dashboard renders on desktop
- **THEN** cards, toolbars, navigation, buttons, and panels use translucent surfaces, backdrop blur, smooth hover/focus/loading states, and no incoherent overlap

### Requirement: Smooth transitions
The frontend SHALL animate route-level or section-level state transitions, loading states, hover states, and interactive controls without abrupt DOM jumps.

#### Scenario: Loading data
- **WHEN** a page is loading API data
- **THEN** the UI displays stable skeleton or loading states without layout shift

### Requirement: Secure client configuration
The frontend SHALL NOT embed large-model API keys and SHALL only collect provider settings through protected user/profile configuration or backend environment-driven flows.

#### Scenario: API key handling
- **WHEN** model configuration is needed
- **THEN** the frontend sends settings to backend-owned storage or references backend environment configuration instead of hard-coding secrets
