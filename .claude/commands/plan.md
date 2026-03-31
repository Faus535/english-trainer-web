---
description: Analyze both projects with multiple parallel agents and generate detailed implementation plans
argument-hint: <feature description>
allowed-tools: Read, Glob, Grep, Write, Agent, Bash, AskUserQuestion
---

<!--
PURPOSE: Multi-agent analysis and phased implementation plan generation
USAGE: /plan <feature description in natural language>
OUTPUT: .ai/plans/YYYY_MM_DD-semantic-name-backend.md and/or .ai/plans/YYYY_MM_DD-semantic-name-frontend.md
ARCHITECTURE: 7-step pipeline
  Step 0: Load Project Snapshots (read-only, requires .ai/project-snapshot.md to exist)
  Step 1: Context Gathering & Slug
  Step 1.5: Scope Detector (haiku)
  Step 2: Public Contracts & Phases Proposal (interactive, user approval required)
  Step 3: Specialists (sonnet, parallel)
  Step 4: Writers (opus, parallel) — absorbs synthesis, coordination, and validation
  Step 5: Git Branch Preparation
-->

**Request**: $ARGUMENTS

Before each layer, read the corresponding reference file for agent prompts.

---

## Step 0 — Load Project Snapshots (read-only)

Read the project snapshots (index + references). This step ONLY reads — it never generates or updates snapshots.

**0a. Backend snapshot**: Read `.ai/project-snapshot.md` (index) in the backend project.

- If it exists → store as `BACKEND_SNAPSHOT`
- If it does NOT exist → **STOP**. Tell the user:
  ```
  No project snapshot found. Run /analyze first to generate it.
  ```
  Do NOT proceed.
- Also read the relevant `.ai/snapshot-references/*.md` files (modules.md, endpoints.md, database.md, cross-cutting.md) for detailed context.

**0b. Frontend snapshot**: Read `.ai/project-snapshot.md` (index) in the frontend project (if the project exists).

- If it exists → store as `FRONTEND_SNAPSHOT`
- If it does NOT exist → continue without it (frontend snapshot is optional)
- Also read relevant `.ai/snapshot-references/*.md` files if they exist.

**0c. Staleness check**: Read the `Last updated` timestamp from each snapshot. If older than 7 days, warn the user:

```
Project snapshot is X days old. Consider running /analyze to refresh it before planning.
Continue anyway? (y/n)
```

Store `BACKEND_SNAPSHOT` + `FRONTEND_SNAPSHOT` + relevant references as `PROJECT_ANALYSIS`.

Show a brief summary (5 lines) of the project state and proceed to Step 1.

---

## Step 1 — Context Gathering & Slug

**1a. Slug**: Generate a date-prefixed semantic name from the feature description.

- Format: `YYYY_MM_DD-semantic_name` (e.g., `2026_03_26-user-vocabulary-export`)
- `.ai/plans/<slug>-backend.md` (backend plan)
- `.ai/plans/<slug>-frontend.md` (frontend plan)
- Ensure `.ai/plans/` directories exist. Never overwrite — append numeric suffix if file exists.

**1b. Existing plans**: Read ALL `.ai/plans/*.md` in both projects. Extract: feature name, date, decisions log, phase status, API contracts. Store as `EXISTING_PLANS_CONTEXT`. If none: `"No existing plans found."`.

**1c. Git context**: Run and store as `GIT_CONTEXT`:

```bash
git -C /home/faustinoolivas/dev/proyectos/carmen/english-trainer-api log --oneline -20
git -C /home/faustinoolivas/dev/proyectos/carmen/english-trainer-web log --oneline -20
git -C /home/faustinoolivas/dev/proyectos/carmen/english-trainer-api status --short
git -C /home/faustinoolivas/dev/proyectos/carmen/english-trainer-web status --short
```

**1d. Skills consultation**: Read CLAUDE.md and consult relevant s2-backend skills to understand architecture and conventions:

- **s2-backend:architecture** — Package structure
- **s2-backend:domain-design** — Domain patterns (Aggregates, VOs, Events)
- **s2-backend:persistence** — Persistence (Entities, Repositories, Flyway)
- **s2-backend:api-design** — Controllers, validation
- **s2-backend:error-handling** — Exceptions and ControllerAdvice
- **s2-backend:testing** — Testing strategy
- **s2-backend:modulith-usecases** — Use Cases with @Service
- **s2-backend:security** — Authentication and authorization
- **s2-backend:logging** — Logging and health checks

Read the `SKILL.md` and key `references/*.md` files of the skills most relevant to the feature.

---

## Step 1.5 — Scope Detector (haiku)

Launch 1 **haiku** agent. Read prompt from: `.claude/commands/plan-references/layer0-scope.md`

Replace `$ARGUMENTS` with the feature request. Store result as `SCOPE` (`BACKEND_ONLY` | `FRONTEND_ONLY` | `FULL_STACK`).

---

## Step 2 — Public Contracts & Phases Proposal (interactive)

**IMPORTANT**: This step requires user approval before proceeding to the analysis pipeline. Do NOT continue to Step 3 until the user explicitly approves.

Based on the feature request, SCOPE, `PROJECT_ANALYSIS`, and context gathered, propose to the user:

**2a. Public Contracts** — The external-facing contracts this feature will introduce or modify:

- **Application services (Use Cases)**: to add, modify, or remove, with method signatures
- **Domain events**: to add, modify, or remove, with their attributes
- **Test suites**: to add, modify, or remove, with test cases within each
- **Database schemas**: to add, modify, or remove, with tables and columns
- **REST endpoints**: to add, modify, or remove, with HTTP methods and paths

If the user doesn't provide contracts, suggest them based on the task description. Use `PROJECT_ANALYSIS` to ensure proposals are consistent with existing modules, naming conventions, and patterns.

**2b. Implementation Phases** — Proposed vertical slices:

- Each phase must be a **vertical slice** delivering end-to-end functionality
- Avoid creating the controller in one phase and the use case in another
- **MANDATORY**: Each phase MUST include its corresponding tests (unit and/or integration). NEVER propose a phase without tests.
- Each phase must be independently committable without breaking the build
- Don't mix responsibilities in the same phase

Present the contracts and phases to the user and ask for approval. Adjust based on feedback. Only proceed to Step 3 once approved.

---

## Step 3 — Specialists (parallel, conditional)

Read agent prompts from: `.claude/commands/plan-references/layer1-specialists.md`

Launch in parallel based on SCOPE:

- **BACKEND_ONLY**: Agents 1, 2, 5, 6 (4 agents, model: sonnet)
- **FRONTEND_ONLY**: Agents 3, 4, 5, 6 (4 agents, model: sonnet)
- **FULL_STACK**: All 6 agents (model: sonnet)

Replace `{EXISTING_PLANS_CONTEXT}`, `{GIT_CONTEXT}`, and `$ARGUMENTS` in each prompt.
Also inject `{PROJECT_ANALYSIS}` and the approved public contracts and phases from Step 2 as `{APPROVED_CONTRACTS}` and `{APPROVED_PHASES}` so specialists can focus their analysis.

---

## Step 4 — Writers (parallel, conditional)

Read agent prompts from: `.claude/commands/plan-references/layer4-writers.md`

Launch Writers in parallel based on SCOPE:

- **BACKEND_ONLY** or **FULL_STACK** with backend work → Launch Backend Writer
- **FRONTEND_ONLY** or **FULL_STACK** with frontend work → Launch Frontend Writer

**Output injection**: Insert each specialist's full text output verbatim into the `[Insert ... here]` placeholders. Use `SCOPE` from Step 1.5 to determine which writers to launch.

If a specialist was not launched: `"N/A — agent not launched (scope: {SCOPE})"`. If a specialist failed: `"AGENT FAILED — no output available"`.

Model: **opus** for all writers.

---

## Step 5 — Git Branch Preparation & Next Steps

**5a. Git status check**: Verify there are no uncommitted changes (`git status`). If there are, warn the user and ask them to resolve before continuing.

**5b. Update base branch**:

```bash
git checkout develop && git pull origin develop
```

If `develop` doesn't exist, use `master`/`main`.

**5c. Branch creation**: Suggest a branch name following the convention `feature/#TICKET_brief-description` (e.g., `feature/#PROJ-123_create-user-module`). Ask the user for the final name. Create the branch:

```bash
git checkout -b <branch-name>
```

**5d. Final output**: **CRITICAL: Do NOT execute the plan and do NOT ask the user if they want to execute it.** The conversation MUST end here. The user needs to run `/clear` first to free context window space before execution. Show:

```
Plan saved:
  - .ai/plans/<slug>-backend.md (if applicable)
  - .ai/plans/<slug>-frontend.md (if applicable)
Branch: <branch-name> created from <base-branch>

To start execution, run:
  /clear
  /execute-plan .ai/plans/<slug>-backend.md
```

---

## Rules

### Pipeline execution

- Write ALL content in **English**
- Execute steps sequentially: 0 → 1 → 1.5 → 2 (wait for approval) → 3 → 4 → 5
- **Step 0 presents a summary** of the project analysis to the user before continuing
- **Step 2 is a gate**: do NOT proceed to Step 3 until the user approves contracts and phases
- Within each layer, launch all agents in a **single message** (parallel)
- Read the reference file for each layer BEFORE constructing agent prompts

### Model assignment

| Step | Model  | Agents                                       |
| ---- | ------ | -------------------------------------------- |
| 0    | —      | Read snapshots (read-only, stops if missing) |
| 1    | —      | Context gathering (no agent)                 |
| 1.5  | haiku  | Scope Detector                               |
| 2    | —      | Interactive (no agent)                       |
| 3    | sonnet | 6 specialists                                |
| 4    | opus   | 1-2 writers                                  |
| 5    | —      | Git operations (no agent)                    |

### Token limits

| Layer       | Max words |
| ----------- | --------- |
| Specialists | 3000      |
| Writers     | unlimited |

### Fallback on agent failure

- Specialist fails → Writer works with remaining specialist outputs, flags gap in plan RISKS section

### Phase quality rules (enforced by Writers)

- Each phase must be a **vertical slice** delivering end-to-end functionality
- **MANDATORY**: Each phase MUST include its corresponding tests (unit and/or integration). NEVER create a phase without tests.
- **MANDATORY**: Each phase must end with a verification cycle: compile, run tests, human review, commit. This is non-negotiable.
- Each phase must be independently committable without breaking the build
- Don't mix responsibilities in the same phase
- **The last phase MUST include running `/revisar`** to validate architecture, naming conventions, and code quality across the entire plan.

### Content rules

- Be extremely detailed: file paths, class names, method signatures
- Each phase must be independently executable
- Never mix frontend and backend in the same plan file
- Include API contract in both plans
- Order phases by dependency: backend first when frontend depends on it
- Skip plan file when zero phases for that project
- Never overwrite existing plans — append numeric suffix
- Cross-cutting concerns must be integrated into phases, not separate appendices
- Plan files go in `.ai/plans/` with date-prefixed naming: `YYYY_MM_DD-semantic_name-backend.md`
