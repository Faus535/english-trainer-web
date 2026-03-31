---
description: Analyze both projects (backend & frontend) and generate/update project snapshots
allowed-tools: Read, Glob, Grep, Write, Agent, Bash
---

<!--
PURPOSE: Deep project analysis that generates .ai/project-snapshot.md + .ai/snapshot-references/ in each project
USAGE: /analyze
OUTPUT:
  Backend:  .ai/project-snapshot.md (index <150 lines) + .ai/snapshot-references/*.md (details)
  Frontend: .ai/project-snapshot.md (index <150 lines) + .ai/snapshot-references/*.md (details)
ARCHITECTURE:
  Step 1: 3 Explore agents (haiku, parallel) scan backend
  Step 2: 1 Explore agent (haiku) scans frontend (if exists)
  Step 3: Main process writes snapshot-references/*.md from agent outputs
  Step 4: Main process generates project-snapshot.md index files
  Step 5: Cross-cutting analysis + git activity (main process)
-->

## Step 0 — Prepare directories

```bash
mkdir -p /home/faustinoolivas/dev/proyectos/carmen/english-trainer-api/.ai/snapshot-references
mkdir -p /home/faustinoolivas/dev/proyectos/carmen/english-trainer-web/.ai/snapshot-references  # only if frontend exists
```

---

## Step 1 — Backend: Launch 3 Explore agents in parallel

Launch **3 agents in parallel** with `model: "haiku"`. Agents only do Glob/Grep — they do NOT write files. Read CLAUDE.md first yourself to know the base package (`com.faus535.englishtrainer`).

**Agent 1 — Domain Layer Scanner**:

```
Scan /home/faustinoolivas/dev/proyectos/carmen/english-trainer-api.
Base package: com.faus535.englishtrainer.

For each module (subdirectory under base package, excluding "shared"), list:
- Java classes in domain/ (aggregates, entities)
- Value Objects (*Id.java, domain/vo/, records)
- Events (*Event.java), Exceptions (*Exception.java), Repos (*Repository.java)

Output ONE LINE per module:
MODULE_NAME | aggregates: A, B | vos: X, Y | events: E | exceptions: Ex | repos: R

Report total module count + names. Use Glob over Read.
```

**Agent 2 — Application & API Layer Scanner**:

```
Scan /home/faustinoolivas/dev/proyectos/carmen/english-trainer-api.
Base package path: src/main/java/com/faus535/englishtrainer.

For each module (excluding "shared"), list:
- Use cases/services in application/ (*UseCase.java, *Service.java)
- Controllers in infrastructure/ (*Controller.java) with HTTP mappings: ControllerName(METHOD path)
- Infrastructure repository implementations

Output ONE LINE per module:
MODULE_NAME | usecases: UC1, UC2 | controllers: Ctrl(GET /path) | infra_repos: Repo

Total counts: use cases, controllers, endpoints. Use Glob+Grep over Read.
```

**Agent 3 — Infrastructure, Config & Tests Scanner**:

```
Scan /home/faustinoolivas/dev/proyectos/carmen/english-trainer-api.

1. SHARED MODULE (shared/): security classes, annotations, exception handlers, utilities
2. CONFIG: @Configuration classes, application*.properties/yml key props, build.gradle dependencies+versions
3. MIGRATIONS: list all Flyway files in db/migration/, latest version
4. TESTS: count by type (integration=@SpringBootTest, rest=unit), Object Mothers (*Mother.java)
5. EVENTS: grep @EventListener/@TransactionalEventListener — list: subscriber | event | module

Output each section labeled. Compact: lists and counts, not prose.
```

---

## Step 2 — Frontend: Launch 1 Explore agent (conditional)

**Only if** `/home/faustinoolivas/dev/proyectos/carmen/english-trainer-web` exists.

**Agent 4 — Frontend Scanner** (model: haiku):

```
Scan /home/faustinoolivas/dev/proyectos/carmen/english-trainer-web.
Read CLAUDE.md/README.md first if they exist.

1. FEATURES: per feature dir — components (*.component.ts), services + public methods, routes
2. STATE: grep signal/computed/effect/BehaviorSubject — list state-managing services
3. API: per HttpClient service — service | method | HTTP verb | endpoint path
4. SHARED: shared components, guards (*.guard.ts), interceptors (*.interceptor.ts)
5. CONFIG: environment vars, key package.json deps+versions, routing structure

Output each section labeled. Compact: tables and lists.
```

---

## Step 3 — Write snapshot-references files

After ALL agents complete, YOU write `snapshot-references/*.md` using agent outputs.

### Backend (`/home/faustinoolivas/dev/proyectos/carmen/english-trainer-api/.ai/snapshot-references/`):

**modules.md** — Combine Agent 1 + Agent 2: one table with Module | Domain (Aggregates, VOs, Events) | Use Cases | Controllers & Endpoints.

**database.md** — From Agent 3: latest migration version + table of all migrations.

**endpoints.md** — From Agent 2: table with Method | Path | Controller | Use Case | Auth.

**testing.md** — From Agent 3: patterns + table of test classes with type.

**config.md** — From Agent 3: security, dependencies table.

**activity.md** — Run `git log --oneline -20` yourself. Recent commits + 3-line active areas summary.

**cross-cutting.md** — From Agent 2 endpoints + Agent 4 API calls: API alignment table, security observations, risks (max 5 bullets).

### Frontend (`/home/faustinoolivas/dev/proyectos/carmen/english-trainer-web/.ai/snapshot-references/`):

Write **features.md**, **state.md**, **api-integration.md**, **shared.md**, **config.md**, **activity.md** from Agent 4 output. Copy cross-cutting.md to frontend too.

---

## Step 4 — Generate index snapshot files

Read all `snapshot-references/*.md` and generate concise index files.

**Backend** → `.ai/project-snapshot.md`:

```markdown
# Project Snapshot: english-trainer-api

> Last updated: YYYY-MM-DD HH:mm
> Generated by: /analyze

## Overview

- **Stack**: [from config.md]
- **Base package**: [from CLAUDE.md]
- **Modules**: [count] — [list]
- **Endpoints**: [count] public + [count] authenticated
- **Tables**: [count], latest migration: [version]
- **Test classes**: [count] unit + [count] integration

## Modules Summary

[One-line per module: name — key aggregates — endpoint count]

## Key Gaps & Risks

[5-10 bullets from cross-cutting.md]

## Active Development

[3-5 bullets from activity.md]

## Reference Files

- [modules.md](snapshot-references/modules.md)
- [database.md](snapshot-references/database.md)
- [endpoints.md](snapshot-references/endpoints.md)
- [testing.md](snapshot-references/testing.md)
- [config.md](snapshot-references/config.md)
- [cross-cutting.md](snapshot-references/cross-cutting.md)
- [activity.md](snapshot-references/activity.md)
```

**Frontend** → `.ai/project-snapshot.md` (only if frontend exists):

```markdown
# Project Snapshot: english-trainer-web

> Last updated: YYYY-MM-DD HH:mm
> Generated by: /analyze

## Overview

- **Stack**: [from config.md]
- **Features**: [count] — [list]
- **API services**: [count], [method count] methods
- **Components**: [count]
- **State pattern**: [1-line]

## Features Summary

[One-line per feature: name — component count — key services]

## Key Gaps & Risks

[5-10 bullets from cross-cutting.md]

## Active Development

[3-5 bullets from activity.md]

## Reference Files

- [features.md](snapshot-references/features.md)
- [state.md](snapshot-references/state.md)
- [api-integration.md](snapshot-references/api-integration.md)
- [shared.md](snapshot-references/shared.md)
- [config.md](snapshot-references/config.md)
- [cross-cutting.md](snapshot-references/cross-cutting.md)
- [activity.md](snapshot-references/activity.md)
```

**CRITICAL**: Each `project-snapshot.md` MUST be under **150 lines**.

---

## Step 5 — Summary

```
Project snapshots updated:
  Backend:  .ai/project-snapshot.md (index) + 7 reference files
  Frontend: .ai/project-snapshot.md (index) + 7 reference files (if applicable)

  Modules: X | Endpoints: Y | Migrations: Z | Tests: W

Key findings:
  - [2-3 lines from cross-cutting analysis]

These snapshots will be used by /plan.
```

---

## Rules

- Write ALL content in **English**
- Agents use `model: "haiku"` — they only do Glob/Grep/Read, NEVER write files
- Agents RETURN structured text — main process writes all files in Step 3
- Launch all agents in a single parallel message (backend + frontend if exists)
- **Tables over prose**: every list must be a markdown table
- `project-snapshot.md` MUST be under **150 lines** — details go in `snapshot-references/`
- Always overwrite existing snapshots and references
- Skip frontend if project doesn't exist
