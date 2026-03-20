# Angular Performance — Best Practices

## Change Detection

- Use `ChangeDetectionStrategy.OnPush` on **every** component.
- Use signals for all component state — they work optimally with OnPush.
- Never mutate objects/arrays — always create new references.

```typescript
// Good: immutable update
this.items.update(items => [...items, newItem]);

// Bad: mutation (won't trigger change detection)
this.items().push(newItem);
```

## Lazy Loading

- Lazy-load all feature routes with `loadComponent` / `loadChildren`.
- Use `@defer` blocks for below-the-fold or conditionally visible content.

```html
@defer (on viewport) {
  <app-heavy-chart [data]="chartData()" />
} @placeholder {
  <div class="chart-skeleton"></div>
}
```

### `@defer` Triggers
- `on viewport` — loads when element enters viewport.
- `on idle` — loads when browser is idle.
- `on interaction` — loads on user interaction (click, focus).
- `on hover` — loads on mouse hover.
- `when condition` — loads when expression is true.

## Template Performance

### Use `@for` with `track`

```html
@for (item of items(); track item.id) {
  <app-item-card [item]="item" />
} @empty {
  <p>No items found</p>
}
```

- Always use `track` with a unique identifier, never `track $index` unless the list is static.
- `track` is mandatory in Angular's new control flow — it replaces `trackBy`.

### Use `@if` instead of `*ngIf`

```html
@if (isLoaded()) {
  <app-content [data]="data()" />
} @else {
  <app-spinner />
}
```

## Signal Best Practices for Performance

```typescript
// Computed signals are cached — only re-evaluated when dependencies change
readonly filteredItems = computed(() =>
  this.items().filter(item => item.category === this.selectedCategory())
);

// Use toSignal() to convert observables — avoids async pipe overhead
private readonly route = inject(ActivatedRoute);
readonly id = toSignal(this.route.paramMap.pipe(map(p => p.get('id')!)));
```

## Image Optimization

```html
<img ngSrc="exercise.jpg" width="400" height="300" priority />
```

- Use `NgOptimizedImage` directive (`ngSrc` instead of `src`).
- Always provide `width` and `height` attributes.
- Add `priority` to above-the-fold images (LCP candidates).

## HTTP & Data Fetching

- Use `resource()` or `rxResource()` for data that depends on signals.
- Implement HTTP caching via interceptors, not in services.

```typescript
readonly exerciseId = input.required<string>();
readonly exercise = rxResource({
  request: () => this.exerciseId(),
  loader: ({ request: id }) => this.http.get<Exercise>(`/api/exercises/${id}`),
});
```

## What NOT To Do

- Do not use `Default` change detection strategy.
- Do not call functions in templates — use `computed()` signals instead.
- Do not subscribe in `ngOnInit` just to assign values — use `toSignal()`.
- Do not import large libraries eagerly — lazy-load with `@defer` or dynamic imports.
- Do not use `*ngFor` or `*ngIf` — use the built-in control flow (`@for`, `@if`).
