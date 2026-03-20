# Angular Routing — Best Practices

## Route Configuration

- Define routes in dedicated `*.routes.ts` files.
- Always lazy-load feature routes with `loadChildren` or `loadComponent`.
- Never import feature components eagerly in the main routes file.

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard'),
  },
  {
    path: 'exercises',
    loadChildren: () => import('./features/exercises/exercises.routes'),
  },
  { path: '**', loadComponent: () => import('./shared/not-found/not-found') },
];
```

## Feature Routes

```typescript
// features/exercises/exercises.routes.ts
import { Routes } from '@angular/router';

export default [
  {
    path: '',
    loadComponent: () => import('./exercises-layout'),
    children: [
      { path: '', loadComponent: () => import('./exercises-list/exercises-list') },
      { path: ':id', loadComponent: () => import('./exercise-detail/exercise-detail') },
      { path: ':id/practice', loadComponent: () => import('./exercise-practice/exercise-practice') },
    ],
  },
] satisfies Routes;
```

## Route Guards (Functional)

Always use functional guards, never class-based guards.

```typescript
// guards/auth.guard.ts
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};

// Usage in routes
{ path: 'admin', canActivate: [authGuard], loadComponent: () => import('./admin') }
```

## Route Resolvers (Functional)

```typescript
export const exerciseResolver: ResolveFn<Exercise> = (route) => {
  const service = inject(ExerciseService);
  const id = route.paramMap.get('id')!;
  return service.getById(id);
};

// Usage
{ path: ':id', resolve: { exercise: exerciseResolver }, loadComponent: () => import('./detail') }
```

## Accessing Route Data in Components

```typescript
export class ExerciseDetail {
  private readonly route = inject(ActivatedRoute);

  // Signal-based route params
  readonly exerciseId = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id')!))
  );

  // Resolved data
  readonly exercise = toSignal(
    this.route.data.pipe(map(data => data['exercise'] as Exercise))
  );
}
```

## Navigation

```typescript
// Programmatic navigation
private readonly router = inject(Router);

navigateToDetail(id: string): void {
  this.router.navigate(['/exercises', id]);
}

// Template navigation
<a [routerLink]="['/exercises', exercise().id]">View</a>
```

## Rules

- Use `satisfies Routes` for type safety in feature route files.
- Export feature routes as `export default [...]` for cleaner lazy loading.
- Keep route nesting max 3 levels deep.
- Use layout components for shared UI across sibling routes.
- Use `withComponentInputBinding()` in `provideRouter` to bind route params to inputs.
- Use `title` property on routes for document title management.
