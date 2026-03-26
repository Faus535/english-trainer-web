# Plan Templates

## Backend Plan Template

Write `plans/<slug>-backend.md` in the backend project root following this structure:

```markdown
# Backend Plan: [Feature Name]

> Generated: [YYYY-MM-DD]
> Request: [original request summary]

## Analysis

[What already exists in the backend relevant to this feature. Mention specific files, classes, endpoints.]

## Phases

### Phase 1: [Phase Name]

**Goal**: [What this phase achieves]

**Files to create/modify**:

- `path/to/File.java` — [what and why]

**Details**:

- [Step-by-step implementation instructions]
- [Class names, method signatures, Value Objects]
- [Architectural patterns to follow]

**Acceptance criteria**:

- [ ] [Specific testable criterion]

### Phase N: [...]

## API Contract

### `METHOD /api/path`

- **Request body**: [JSON example]
- **Response body**: [JSON example]
- **Status codes**: [list]
- **Auth**: [required/optional]

## Database Changes

[Flyway migrations, table structures, relationships]

## Testing Strategy

[Unit, integration, E2E tests to write]
```

## Frontend Plan Template

Write `plans/<slug>-frontend.md` in `/home/faustinoolivas/dev/proyectos/carmen/english-trainer-web/` following this structure:

```markdown
# Frontend Plan: [Feature Name]

> Generated: [YYYY-MM-DD]
> Request: [original request summary]

## Analysis

[What already exists in the frontend. Mention specific files, components, services.]

## Phases

### Phase 1: [Phase Name]

**Goal**: [What this phase achieves]

**Files to create/modify**:

- `path/to/file.ts` — [what and why]

**Details**:

- [Step-by-step implementation instructions]
- [Component names, service methods, signal patterns]
- [Angular conventions to follow]

**Acceptance criteria**:

- [ ] [Specific testable criterion]

### Phase N: [...]

## API Integration

[Backend endpoints consumed, request/response examples]

## UI/UX Details

[Component hierarchy, user flow, interactions, responsive behavior]

## Testing Strategy

[Vitest tests to write]
```
