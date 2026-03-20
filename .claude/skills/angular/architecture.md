# Angular Project Architecture — Best Practices

## Project Structure

```
src/
  app/
    app.ts                    # Root component
    app.config.ts             # Application providers
    app.routes.ts             # Top-level routes (lazy only)
    core/                     # Singleton services, guards, interceptors
      interceptors/
        auth.interceptor.ts
      guards/
        auth.guard.ts
      services/
        auth.service.ts
    shared/                   # Reusable components, pipes, directives
      components/
        button/button.ts
      pipes/
        truncate.pipe.ts
      directives/
        click-outside.directive.ts
    features/                 # Feature modules (lazy-loaded)
      dashboard/
        dashboard.ts
        dashboard.routes.ts
      exercises/
        exercises.routes.ts
        exercises-list/
          exercises-list.ts
          exercises-list.html
          exercises-list.scss
          exercises-list.spec.ts
        exercise-detail/
        shared/               # Feature-specific shared components
          exercise-card/
    models/                   # Shared interfaces and types
      exercise.model.ts
      user.model.ts
  styles/                     # Global SCSS files
    _variables.scss
    _reset.scss
```

## Key Principles

### Feature-based Organization
- Group files by feature, not by type.
- Each feature folder contains its own routes, components, and services.
- Features are lazy-loaded via the router.

### Core vs Shared vs Features
- **Core**: Singleton services, guards, interceptors — imported once at root.
- **Shared**: Reusable, stateless UI components, pipes, directives.
- **Features**: Business logic organized by domain. Each feature is self-contained.

### Barrel Exports
- Use `index.ts` barrel files only in `shared/` for public API.
- Do NOT create barrel files in features — use direct imports.

## File Naming Conventions

| Type         | File Name                  | Class Name        |
|--------------|----------------------------|-------------------|
| Component    | `feature-name.ts`          | `FeatureName`     |
| Service      | `feature.service.ts`       | `FeatureService`  |
| Guard        | `auth.guard.ts`            | `authGuard` (fn)  |
| Interceptor  | `auth.interceptor.ts`      | `authInterceptor` |
| Pipe         | `truncate.pipe.ts`         | `TruncatePipe`    |
| Directive    | `highlight.directive.ts`   | `HighlightDirective` |
| Model        | `exercise.model.ts`        | `Exercise` (interface) |
| Routes       | `feature.routes.ts`        | `export default Routes[]` |
| Spec         | `feature-name.spec.ts`     | —                 |

## Rules

- No circular dependencies between features — use shared services or events.
- Features never import from other features directly.
- Shared components must be stateless (no injected services with state).
- Keep the `app.routes.ts` file lean — only top-level lazy routes.
- Maximum 3 levels of folder nesting inside a feature.
- One component/service/pipe per file.
- Models are plain TypeScript interfaces, not classes.

## Provider Configuration

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
```
