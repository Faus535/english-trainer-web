# Angular Services & Dependency Injection — Best Practices

## Service Declaration

```typescript
import { Injectable, inject, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FeatureService {
  private readonly http = inject(HttpClient);

  // State as private signals
  private readonly _items = signal<Item[]>([]);
  private readonly _loading = signal(false);

  // Public readonly access
  readonly items = this._items.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly count = computed(() => this._items().length);
}
```

## Rules

- Always use `providedIn: 'root'` for singleton services (default).
- Use `inject()` function, never constructor injection.
- Keep services focused — one responsibility per service.
- Expose state as `signal.asReadonly()`, never expose writable signals.
- Use `computed()` for derived state within services.

## State Management with Signals

```typescript
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly _items = signal<CartItem[]>([]);

  readonly items = this._items.asReadonly();
  readonly total = computed(() =>
    this._items().reduce((sum, item) => sum + item.price * item.qty, 0)
  );
  readonly isEmpty = computed(() => this._items().length === 0);

  addItem(item: CartItem): void {
    this._items.update(items => [...items, item]);
  }

  removeItem(id: string): void {
    this._items.update(items => items.filter(i => i.id !== id));
  }

  clear(): void {
    this._items.set([]);
  }
}
```

## HTTP Services

```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api';

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.baseUrl}/items`);
  }

  createItem(dto: CreateItemDto): Observable<Item> {
    return this.http.post<Item>(`${this.baseUrl}/items`, dto);
  }
}
```

- Return `Observable` from HTTP methods — let the consumer decide how to handle it.
- Use `resource()` or `rxResource()` in components to bridge HTTP to signals.
- Never call `.subscribe()` inside a service unless managing a long-lived stream.
- Type all HTTP responses explicitly — never use `any`.

## Dependency Injection Patterns

- Use `InjectionToken` for configuration and non-class dependencies.
- Use `providedIn: 'root'` unless the service must be scoped to a component tree.
- For feature-scoped services, provide in the route config `providers` array.

```typescript
export const FEATURE_ROUTES: Routes = [
  {
    path: '',
    providers: [FeatureScopedService],
    component: FeatureLayout,
    children: [...]
  }
];
```

## What NOT To Do

- Do not store UI state (form values, toggle states) in global services — keep it local.
- Do not create "God services" that handle multiple domains.
- Do not use `BehaviorSubject` for state — use signals instead.
- Do not create abstract base services — prefer composition with `inject()`.
- Do not manually unsubscribe in services — use `DestroyRef` if scoped.
