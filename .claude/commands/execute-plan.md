---
description: Execute a plan file phase by phase, then update snapshots, commit, push, and deploy
argument-hint: <path to plan .md file>
allowed-tools: Read, Glob, Grep, Write, Edit, Agent, Bash, AskUserQuestion
---

<!--
PURPOSE: Execute an implementation plan file, phase by phase
USAGE: /execute-plan .ai/plans/2026_03_26-feature-name-backend.md
OUTPUT: Implemented code, committed, pushed, and deployed
-->

**Plan file**: $ARGUMENTS

---

## Step 0 — Load & Validate Plan

**0a. Read the plan file**: Read the file at the path provided in `$ARGUMENTS`.

- If the file does not exist → **STOP** and tell the user the file was not found.

**0b. Parse phases**: Extract all phases from the plan. For each phase identify:

- Phase number and name
- Goal
- Files to create/modify
- Implementation details
- Acceptance criteria (checkboxes)

**0c. Load project snapshot**: Read `.ai/project-snapshot.md` to understand the current project state.

- If it doesn't exist, warn the user but continue (the plan itself has enough context).

**0d. Check plan status**: Look for checked `[x]` checkboxes in the plan to determine which phases are already completed. Resume from the first incomplete phase.

Show to the user:

```
Plan: <plan file name>
Total phases: N
Completed: X
Remaining: Y (starting from Phase Z)
```

---

## Step 1 — Execute Phases (sequential loop)

For each incomplete phase, execute this cycle:

### 1a. Announce phase

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Phase N: <Phase Name>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Goal: <phase goal>
```

### 1b. Read relevant skills

Before writing code, read ONLY the skills relevant to this phase's content:

Skill mapping (read based on what the phase touches):

- Domain classes (aggregates, VOs, events, exceptions) → domain-design/
- Persistence (entities, repositories, migrations) → persistence/
- Controllers, endpoints, DTOs → api-design/
- Error handling, ControllerAdvice → error-handling/
- Tests → testing/
- Use cases, services → modulith-usecases/
- Auth, security, JWT → security/
- Logging, health → logging/
- Package structure, new module → architecture/

Read `SKILL.md` + key `references/*.md` from `.claude/plugins/s2-backend/skills/<skill>/` for each matched skill.
Do NOT read all skills — only those matching the phase content.

For **frontend plans**: Read relevant skills from `.claude/skills/angular/` if they exist.

### 1c. Implement

Execute all actions listed in the phase:

- Create/modify files as specified
- Follow the architecture conventions from the skills
- Write tests as specified in the phase (this is mandatory — never skip tests)

### 1d. Verify

Run the verification cycle — this is **non-negotiable**:

**For backend plans**:

```bash
./gradlew compileJava compileTestJava
./gradlew test
```

**For frontend plans**:

```bash
npm run build
npm test
```

- If compilation/build fails → fix the errors and retry
- If tests fail → fix the failing tests and retry
- Do NOT proceed to the next phase until both pass

### 1e. Update plan file

Mark the completed actions as done in the plan file by changing `- [ ]` to `- [x]` for each completed item.

### 1f. Commit the phase

```bash
git add <specific files created/modified in this phase>
git commit -m "<descriptive message for this phase>"
```

Use a descriptive commit message that matches the phase goal. Do NOT use `--amend`.

### 1g. Proceed to next phase

Move to the next incomplete phase and repeat from 1a.

---

## Step 2 — Run /revisar

After ALL phases are completed, run the `/revisar` skill to validate architecture, naming conventions, and code quality across the entire implementation.

- If issues are found → fix them and commit the fixes
- If no issues → proceed

---

## Step 3 — Push & Deploy

**3a. Push to GitHub**:

```bash
git push origin HEAD
```

**3b. Deploy to Railway**:

```bash
railway up --detach
```

**3c. Delete plan file**:
Remove the plan `.md` file that was executed, since it is now fully completed:

```bash
rm <plan file path>
git add <plan file path>
git commit -m "Remove completed plan file"
```

**3d. Final output**:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Plan execution complete
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Plan: <plan file name>
Phases completed: N/N
Commits: <list of commit hashes and messages>
Pushed to: <branch name>
Deployed to: Railway
```

---

## Rules

### Execution

- Execute phases **sequentially** — never skip ahead
- **NEVER skip tests** — every phase must include and pass its tests
- **NEVER proceed** to the next phase if compilation or tests fail
- Always commit after each phase, not at the end
- Use specific file paths in `git add`, never `git add -A` or `git add .`

### Error handling

- If a phase fails to compile after 3 attempts → stop and ask the user for help
- If tests fail after 3 attempts → stop and show the failing test output to the user
- If the plan file references files or patterns that don't exist → adapt to the current codebase, don't blindly follow outdated instructions

### Skills consultation

- Only read skills that match the phase content (see mapping in Step 1b)
- Never read all skills for every phase
- Follow the patterns from the skills strictly (naming, structure, testing patterns)

### Plan file updates

- Always update the plan file checkboxes as you complete actions
- This allows resuming execution if the process is interrupted
- Use `/execute-plan <same-file>` to resume from where it left off

### Commit messages

- One commit per phase
- Message format: descriptive, matching the phase goal
- End with: `Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>`
