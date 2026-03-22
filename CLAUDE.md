# english-trainer-web

Angular 21 frontend application. Stack: Angular 21, TypeScript 5.9, SCSS, Vitest, Signals.

## Architecture

- **Framework**: Angular 21 (standalone components, signal-based)
- **Styling**: SCSS with component scoping
- **Testing**: Vitest + Angular TestBed
- **State Management**: Signals (`signal`, `computed`, `effect`)
- **Forms**: Reactive Forms only
- **Routing**: Lazy-loaded feature routes

## Angular Skills (MUST READ before generating code)

Before creating or modifying any Angular code, you MUST load and follow the relevant skills:

| Skill          | Path                                         | When to load                                          |
| -------------- | -------------------------------------------- | ----------------------------------------------------- |
| Components     | `.claude/skills/angular/components.md`       | Creating/editing components                           |
| Services       | `.claude/skills/angular/services.md`         | Creating/editing services, DI                         |
| Routing        | `.claude/skills/angular/routing.md`          | Adding routes, guards, resolvers                      |
| Forms          | `.claude/skills/angular/forms.md`            | Creating/editing forms                                |
| Testing        | `.claude/skills/angular/testing.md`          | Writing tests                                         |
| Styling        | `.claude/skills/angular/styling.md`          | Writing SCSS styles                                   |
| Architecture   | `.claude/skills/angular/architecture.md`     | Creating features, project structure                  |
| Performance    | `.claude/skills/angular/performance.md`      | Performance-sensitive code                            |
| RxJS           | `.claude/skills/angular/rxjs.md`             | Using observables, HTTP                               |
| Templates      | `.claude/skills/angular/templates.md`        | Writing HTML templates                                |
| Error Handling | `.claude/skills/angular/error-handling.md`   | Handling errors, notifications, interceptors          |
| Security       | `.claude/skills/angular/security.md`         | Auth tokens, sanitization, environments               |
| Accessibility  | `.claude/skills/angular/accessibility.md`    | ARIA, focus, contrast, keyboard navigation            |
| State Mgmt     | `.claude/skills/angular/state-management.md` | Facade pattern, state machines, multi-signal services |
| Browser APIs   | `.claude/skills/angular/browser-apis.md`     | Web Speech API, NgZone, feature detection             |
| PWA/Offline    | `.claude/skills/angular/pwa-offline.md`      | Service Worker, offline queue, caching                |
| Animations     | `.claude/skills/angular/animations.md`       | CSS transitions, keyframes, skeletons                 |
| Storage        | `.claude/skills/angular/storage.md`          | localStorage, sessionStorage, persistence             |

**Workflow**: When asked to create a feature, read ALL relevant skills first, then generate code that complies with every rule.

## Key Rules (Summary)

- Standalone components only (no NgModules)
- `ChangeDetectionStrategy.OnPush` on every component
- `inject()` function, never constructor injection
- Signal-based inputs (`input()`, `input.required()`), outputs (`output()`), and state (`signal()`)
- New control flow (`@if`, `@for`, `@switch`), never structural directives
- Reactive Forms only, never template-driven
- Lazy-load all feature routes
- Vitest for testing, never Karma/Jasmine
- SCSS with `:host` display, CSS custom properties for theming
- `rem` units, never `px`

## Commands

| Command         | Description           |
| --------------- | --------------------- |
| `npm start`     | Start dev server      |
| `npm run build` | Production build      |
| `npm test`      | Run tests with Vitest |
