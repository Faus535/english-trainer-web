---
description: Analyze both projects with multiple parallel agents and generate detailed implementation plans
argument-hint: <feature description>
allowed-tools: Read, Glob, Grep, Write, Agent, Bash
---

<!--
PURPOSE: Multi-agent analysis and phased implementation plan generation
USAGE: /plan <feature description in natural language>
EXAMPLES:
  /plan Add a button to export vocabulary as PDF
  /plan Create user settings page with notification preferences
OUTPUT: plans/<slug>-backend.md and/or plans/<slug>-frontend.md
-->

Analyze the requested feature using **multiple parallel agents**, consolidate findings, resolve conflicts, and generate detailed phased plans.

**Request**: $ARGUMENTS

## Step 0 — Derive plan file name

Generate a short kebab-case slug from the feature description (3-5 words max). Examples:

- "Add a button to export vocabulary as PDF" → `export-vocabulary-pdf`
- "Fix optimistic locking errors" → `fix-optimistic-locking`
- "Create user settings page" → `user-settings-page`

Plan files:

- **Backend**: `plans/<slug>-backend.md` (in backend root)
- **Frontend**: `plans/<slug>-frontend.md` (in frontend root)

Ensure the `plans/` directory exists in each project root before writing.

## Step 1 — Multi-agent parallel analysis

Launch the following agents **in parallel** using the Agent tool. Each agent must read the relevant skills and code before producing its analysis.

### Agent 1: Backend Analysis

```
Analyze the backend project at /home/faustinoolivas/dev/proyectos/carmen/english-trainer-api for implementing: "$ARGUMENTS"

Steps:
1. Read CLAUDE.md for architecture conventions
2. Read relevant skills from .claude/plugins/s2-backend/skills/ (domain-design, persistence, api-design, modulith-usecases, etc.)
3. Explore existing modules, entities, controllers, services related to this feature
4. Identify what already exists and what needs to be created/modified

Return a structured analysis with:
- EXISTING: files, classes, endpoints already relevant
- PROPOSED: new classes, endpoints, migrations needed (with exact paths and signatures)
- DEPENDENCIES: what the frontend will need from the backend (API contract)
- RISKS: potential issues, breaking changes, performance concerns
- PHASES: suggested implementation order with acceptance criteria
```

### Agent 2: Frontend Analysis

```
Analyze the frontend project at /home/faustinoolivas/dev/proyectos/carmen/english-trainer-web for implementing: "$ARGUMENTS"

Steps:
1. Read CLAUDE.md for architecture conventions
2. Read relevant skills from .claude/skills/angular/ (components, services, state management, etc.)
3. Explore existing features, components, services, routes related to this feature
4. Identify what already exists and what needs to be created/modified

Return a structured analysis with:
- EXISTING: files, components, services already relevant
- PROPOSED: new components, services, routes needed (with exact paths and selectors)
- DEPENDENCIES: what it needs from the backend (endpoints, DTOs)
- RISKS: potential issues, UX edge cases, responsive concerns
- PHASES: suggested implementation order with acceptance criteria
```

### Agent 3: Data & Schema Analysis

```
Analyze the database and data model for implementing: "$ARGUMENTS"

Project: /home/faustinoolivas/dev/proyectos/carmen/english-trainer-api

Steps:
1. Read existing Flyway migrations in src/main/resources/db/migration/
2. Read existing domain entities and Value Objects related to the feature
3. Read the persistence skill at .claude/plugins/s2-backend/skills/persistence/
4. Analyze current table structures, relationships, and constraints

Return a structured analysis with:
- EXISTING_SCHEMA: current tables, columns, relationships relevant to this feature
- PROPOSED_MIGRATIONS: new tables, columns, indexes, constraints needed
- DATA_FLOW: how data moves from API → Domain → Persistence and back
- RISKS: migration risks, data integrity concerns, backwards compatibility
- MIGRATION_ORDER: suggested order for Flyway migrations
```

### Agent 4: UX & Integration Analysis

```
Analyze the user experience and cross-cutting concerns for implementing: "$ARGUMENTS"

Projects:
- Backend: /home/faustinoolivas/dev/proyectos/carmen/english-trainer-api
- Frontend: /home/faustinoolivas/dev/proyectos/carmen/english-trainer-web

Steps:
1. Review existing user flows in the frontend that relate to this feature
2. Check authentication/authorization patterns (read security skill at backend .claude/plugins/s2-backend/skills/security/)
3. Check error handling patterns (read error-handling skill)
4. Analyze how similar features are already implemented end-to-end

Return a structured analysis with:
- USER_FLOWS: step-by-step user interactions for this feature
- AUTH_REQUIREMENTS: what auth/permissions are needed
- ERROR_SCENARIOS: what can go wrong and how to handle each case
- INTEGRATION_POINTS: where frontend and backend connect, edge cases
- CONSISTENCY: patterns from existing features that should be followed
```

## Step 2 — Consolidate and debate

After all agents complete, review their outputs together:

1. **Identify conflicts**: Where agents disagree on approach, naming, or structure
2. **Resolve conflicts**: Choose the best approach based on existing codebase patterns and skill conventions
3. **Cross-validate dependencies**: Ensure backend API contract matches what frontend expects
4. **Merge phases**: Create a unified timeline where backend phases come before frontend phases that depend on them
5. **Document decisions**: Note any significant trade-offs or alternative approaches considered

Write a brief summary of key decisions and conflicts resolved before generating the final plans.

## Step 3 — Generate plans

Read the templates in [plan-references/templates.md](plan-references/templates.md), then generate **only the plans that have actual development work**:

- `plans/<slug>-backend.md` — in backend project root `/home/faustinoolivas/dev/proyectos/carmen/english-trainer-api/`.
- `plans/<slug>-frontend.md` — in frontend project root `/home/faustinoolivas/dev/proyectos/carmen/english-trainer-web/`.

Each plan must include a **Decisions Log** section at the top summarizing the multi-agent analysis:

```markdown
## Decisions Log

| Topic | Decision | Alternatives Considered | Why |
| ----- | -------- | ----------------------- | --- |
| ...   | ...      | ...                     | ... |
```

## Rules

- Write ALL content in **English**
- Launch ALL 4 agents in parallel (single message with multiple Agent tool calls)
- Be extremely detailed: file paths, class names, method signatures, component selectors
- Each phase must be independently executable
- **Never mix** frontend and backend concerns in the same plan file
- Include the API contract in both backend and frontend plans
- Order phases by dependency: backend first when frontend depends on it
- **Skip** generating a plan file when there are zero phases for that project
- **Never overwrite** an existing plan — if file exists, append a numeric suffix
