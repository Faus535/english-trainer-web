# RxJS in Angular — Best Practices

## General Rule

Prefer **signals** over RxJS for synchronous state. Use RxJS only for:
- HTTP requests (Angular HttpClient returns observables).
- Event streams (WebSockets, real-time data).
- Complex async coordination (debounce, race conditions, retry).

## Converting Between Signals and Observables

```typescript
import { toSignal, toObservable } from '@angular/core/rxjs-interop';

// Observable → Signal (use in components for template binding)
readonly data = toSignal(this.service.getData(), { initialValue: [] });

// Signal → Observable (use when you need RxJS operators)
readonly search$ = toObservable(this.searchTerm);
```

## Common Patterns

### Debounced Search

```typescript
private readonly searchTerm = signal('');
private readonly destroyRef = inject(DestroyRef);

readonly results = toSignal(
  toObservable(this.searchTerm).pipe(
    debounceTime(300),
    distinctUntilChanged(),
    filter(term => term.length >= 2),
    switchMap(term => this.searchService.search(term)),
  ),
  { initialValue: [] }
);
```

### HTTP with Error Handling

```typescript
loadExercise(id: string): Observable<Exercise> {
  return this.http.get<Exercise>(`/api/exercises/${id}`).pipe(
    retry({ count: 2, delay: 1000 }),
    catchError(error => {
      console.error('Failed to load exercise:', error);
      return EMPTY;
    }),
  );
}
```

### Combining Multiple Streams

```typescript
// Use combineLatest when you need latest values from multiple sources
readonly dashboard = toSignal(
  combineLatest([
    this.exerciseService.getRecent(),
    this.statsService.getSummary(),
  ]).pipe(
    map(([exercises, stats]) => ({ exercises, stats })),
  ),
);
```

## Operators to Prefer

| Scenario             | Operator         |
|----------------------|------------------|
| HTTP / cancel prev   | `switchMap`      |
| Queue sequential     | `concatMap`      |
| Fire-and-forget      | `mergeMap`       |
| Ignore until done    | `exhaustMap`     |
| Delay emissions      | `debounceTime`   |
| Skip duplicates      | `distinctUntilChanged` |
| Auto-unsubscribe     | `takeUntilDestroyed` |

## Unsubscription

Always use `takeUntilDestroyed()` for imperative subscriptions.

```typescript
private readonly destroyRef = inject(DestroyRef);

ngOnInit(): void {
  this.ws.messages$
    .pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe(msg => this.handleMessage(msg));
}
```

- `toSignal()` handles unsubscription automatically.
- `async` pipe handles unsubscription automatically.
- `takeUntilDestroyed()` is the preferred manual approach.

## What NOT To Do

- Do not use `BehaviorSubject` for component state — use `signal()`.
- Do not nest `.subscribe()` calls — use higher-order operators.
- Do not use `.subscribe()` just to assign a value — use `toSignal()`.
- Do not forget to handle errors in HTTP streams — use `catchError`.
- Do not use `tap()` for state mutations — use it only for side effects (logging).
- Do not use `firstValueFrom` / `lastValueFrom` unless in a test or one-shot context.
- Do not create custom Subjects in components — signals replace this pattern.
