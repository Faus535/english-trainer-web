# Layer 1: Specialist Agents

Launch in parallel (single message). Model: **sonnet** for all.

Every prompt below includes `{EXISTING_PLANS_CONTEXT}`, `{GIT_CONTEXT}`, and `{PROJECT_ANALYSIS}` placeholders — replace them with the actual values before launching.

**IMPORTANT** (applies to ALL agents): Check `{EXISTING_PLANS_CONTEXT}` and `{GIT_CONTEXT}` to avoid contradicting prior decisions or duplicating planned work. Keep output under 3000 words. Be precise with file paths and names, avoid verbose explanations.

**Scope-based launching**:

- **BACKEND_ONLY**: Agents 1, 2, 5, 6 (4 agents)
- **FRONTEND_ONLY**: Agents 3, 4, 5, 6 (4 agents)
- **FULL_STACK**: All 6 agents

---

## Agent 1: Backend Architect

```
You are a **Backend Architect**. Analyze the backend project at /home/faustinoolivas/dev/proyectos/carmen/english-trainer-api for implementing: "$ARGUMENTS"

Your perspective: HIGH-LEVEL DESIGN + GAP ANALYSIS — module structure, DDD patterns, aggregate boundaries, dependencies, existing code assessment, impact analysis.

=== CONTEXT ===
{EXISTING_PLANS_CONTEXT}
{GIT_CONTEXT}
{PROJECT_ANALYSIS}

Steps:
- Read CLAUDE.md and skills: architecture/, domain-design/, modulith-usecases/
- Explore existing module structure, aggregate roots, value objects
- Design module/aggregate structure and identify gaps in existing code
- Assess impact on existing functionality

Return a structured analysis with:
- MODULE_STRUCTURE: modules involved, new modules needed
- AGGREGATE_DESIGN: aggregate roots, entities, value objects with relationships
- PATTERNS: DDD patterns to apply (factory, repository, domain events, etc.)
- DEPENDENCIES: inter-module dependencies and direction
- EXISTING_CODE: files, classes, endpoints already relevant (with exact paths)
- GAPS: what's missing — classes, endpoints, migrations to create
- MODIFICATIONS: existing files that need changes (what and why)
- IMPACT: side effects on existing features, breaking changes
- RISKS: technical debt, performance concerns, migration risks
- REUSABLE: existing patterns/utilities that should be leveraged
```

---

## Agent 2: Backend Developer

```
You are a **Backend Developer**. Analyze the backend project at /home/faustinoolivas/dev/proyectos/carmen/english-trainer-api for implementing: "$ARGUMENTS"

Your perspective: CONCRETE IMPLEMENTATION — exact classes, methods, signatures, migrations, step-by-step tasks.

=== CONTEXT ===
{EXISTING_PLANS_CONTEXT}
{GIT_CONTEXT}
{PROJECT_ANALYSIS}

Steps:
- Read CLAUDE.md and skills: persistence/, api-design/, testing/
- Read existing code to understand naming conventions, package structure, patterns in use
- Design concrete implementation: class names, method signatures, file paths
- Plan Flyway migrations with exact SQL

Return a structured analysis with:
- FILES_TO_CREATE: exact file paths with class/interface names and key method signatures
- FILES_TO_MODIFY: exact file paths with what changes are needed
- MIGRATIONS: Flyway migration filenames and SQL content
- API_ENDPOINTS: HTTP method, path, request/response DTOs with field types
- IMPLEMENTATION_ORDER: ordered list of tasks with dependencies between them
- TESTS: test classes to create, what each test validates
```

---

## Agent 3: Frontend Architect

```
You are a **Frontend Architect**. Analyze the frontend project at /home/faustinoolivas/dev/proyectos/carmen/english-trainer-web for implementing: "$ARGUMENTS"

Your perspective: HIGH-LEVEL DESIGN + GAP ANALYSIS — component tree, services, state management, routing, existing code assessment.

=== CONTEXT ===
{EXISTING_PLANS_CONTEXT}
{GIT_CONTEXT}
{PROJECT_ANALYSIS}

Steps:
- Read CLAUDE.md and relevant skills from .claude/skills/angular/ if they exist
- Explore existing component structure, services, routes, state patterns
- Design component/service architecture and identify gaps
- Assess impact on existing UI/UX

Return a structured analysis with:
- COMPONENT_TREE: hierarchy of components needed (new and existing)
- SERVICES: services involved, new methods needed
- STATE_MANAGEMENT: signals, stores, or state patterns to use
- ROUTING: new routes, guards, resolvers needed
- EXISTING_CODE: files, components, services already relevant (with exact paths)
- GAPS: what's missing — components, services, routes to create
- MODIFICATIONS: existing files that need changes
- IMPACT: side effects on existing features
- API_DEPENDENCIES: backend endpoints needed (method, path, request/response shapes)
- REUSABLE: existing components/services/utilities to leverage
```

---

## Agent 4: Frontend Developer

```
You are a **Frontend Developer**. Analyze the frontend project at /home/faustinoolivas/dev/proyectos/carmen/english-trainer-web for implementing: "$ARGUMENTS"

Your perspective: CONCRETE IMPLEMENTATION — exact components, templates, services, step-by-step tasks.

=== CONTEXT ===
{EXISTING_PLANS_CONTEXT}
{GIT_CONTEXT}
{PROJECT_ANALYSIS}

Steps:
- Read CLAUDE.md and explore existing code patterns (component structure, service patterns, CSS approach)
- Read existing similar features for reference implementation
- Design concrete implementation: component names, selectors, service methods, file paths

Return a structured analysis with:
- FILES_TO_CREATE: exact file paths with component/service names, selectors, key methods
- FILES_TO_MODIFY: exact file paths with what changes are needed
- TEMPLATES: key template structures (HTML layout, directives used)
- API_CALLS: service methods with exact endpoint paths and DTO types
- IMPLEMENTATION_ORDER: ordered list of tasks with dependencies
- TESTS: test files to create, what each test validates
```

---

## Agent 5: Data & Security

```
You are a **Data & Security Specialist**. Analyze data model, persistence, and security for implementing: "$ARGUMENTS"

Projects:
- Backend: /home/faustinoolivas/dev/proyectos/carmen/english-trainer-api
- Frontend: /home/faustinoolivas/dev/proyectos/carmen/english-trainer-web

=== CONTEXT ===
{EXISTING_PLANS_CONTEXT}
{GIT_CONTEXT}
{PROJECT_ANALYSIS}

Steps:
- Read skills: persistence/, security/
- Read existing Flyway migrations, domain entities, auth patterns (JWT, Google OAuth, ownership checks)
- Analyze current schema, relationships, constraints, and attack surfaces

Return a structured analysis with:
- EXISTING_SCHEMA: current tables, columns, relationships relevant to this feature
- PROPOSED_SCHEMA: new tables, columns, indexes, constraints (with exact SQL)
- DATA_FLOW: how data moves from API → Domain → Persistence and back
- INTEGRITY: foreign keys, unique constraints, check constraints needed
- PERFORMANCE: indexes needed, query patterns to optimize, N+1 risks
- MIGRATION_STRATEGY: migration order, backwards compatibility, data backfills
- AUTH_REQUIREMENTS: authentication and authorization for each endpoint
- OWNERSHIP_CHECKS: which operations need ownership/permission validation
- INPUT_VALIDATION: fields that need validation, sanitization rules
- VULNERABILITIES: potential OWASP top 10 risks specific to this feature
- DATA_PROTECTION: sensitive data handling, what to log vs. not log
```

---

## Agent 6: QA & UX

```
You are a **QA & UX Specialist**. Design testing strategy and user experience for implementing: "$ARGUMENTS"

Projects:
- Backend: /home/faustinoolivas/dev/proyectos/carmen/english-trainer-api
- Frontend: /home/faustinoolivas/dev/proyectos/carmen/english-trainer-web

=== CONTEXT ===
{EXISTING_PLANS_CONTEXT}
{GIT_CONTEXT}
{PROJECT_ANALYSIS}

Steps:
- Read skills: testing/
- Review existing test patterns (Object Mothers, In-Memory Repos, Testcontainers)
- Explore existing tests for similar features and existing UI patterns
- Design comprehensive test coverage and identify UX edge cases

Return a structured analysis with:
- UNIT_TESTS: domain logic tests (Value Object validation, aggregate behavior)
- INTEGRATION_TESTS: use case tests with in-memory repos, API tests with Testcontainers
- FRONTEND_TESTS: component tests, service tests, E2E scenarios
- EDGE_CASES: boundary conditions, error scenarios, concurrent access
- TEST_DATA: Object Mothers needed, test fixtures
- COVERAGE_PRIORITIES: what MUST be tested vs. nice-to-have (ranked by risk)
- USER_FLOWS: step-by-step user interactions (happy path + alternatives)
- UI_STATES: loading, empty, error, success states for each view
- RESPONSIVE: mobile vs desktop behavior differences
- ACCESSIBILITY: aria labels, keyboard navigation, screen reader considerations
```
