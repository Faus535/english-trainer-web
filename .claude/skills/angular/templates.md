# Angular Templates — Best Practices

## Built-in Control Flow (Angular 17+)

Always use the new control flow syntax. Never use structural directives (`*ngIf`, `*ngFor`, `*ngSwitch`).

### Conditional Rendering

```html
@if (isLoading()) {
  <app-spinner />
} @else if (error()) {
  <app-error-message [message]="error()!" />
} @else {
  <app-content [data]="data()" />
}
```

### List Rendering

```html
@for (exercise of exercises(); track exercise.id) {
  <app-exercise-card
    [exercise]="exercise"
    (selected)="onSelect($event)"
  />
} @empty {
  <p class="empty-state">No exercises found.</p>
}
```

### Switch

```html
@switch (status()) {
  @case ('idle') { <p>Ready to start</p> }
  @case ('loading') { <app-spinner /> }
  @case ('error') { <app-error [message]="errorMsg()" /> }
  @case ('success') { <app-result [data]="result()" /> }
}
```

## Signal Interpolation

Always call signals as functions in templates.

```html
<!-- Correct -->
<h1>{{ title() }}</h1>
<p>Count: {{ items().length }}</p>

<!-- Wrong — missing parentheses -->
<h1>{{ title }}</h1>
```

## Event Handling

```html
<!-- Simple event -->
<button (click)="onSave()">Save</button>

<!-- With event object -->
<input (input)="onSearch($event)" />

<!-- Keyboard events -->
<input (keydown.enter)="onSubmit()" />

<!-- Prevent default -->
<form (submit)="$event.preventDefault(); onSubmit()">
```

## Property and Attribute Binding

```html
<!-- Property binding -->
<input [value]="name()" [disabled]="isDisabled()" />

<!-- Class binding -->
<div [class.active]="isActive()" [class.error]="hasError()">

<!-- Style binding -->
<div [style.width.%]="progress()">

<!-- Attribute binding (for non-DOM properties) -->
<td [attr.colspan]="span()">
```

## Two-Way Binding with model()

```html
<!-- Parent -->
<app-toggle [(value)]="isEnabled" />

<!-- Child component uses model() -->
```

```typescript
// toggle.ts
export class Toggle {
  readonly value = model(false);

  protected toggle(): void {
    this.value.update(v => !v);
  }
}
```

## Template Variables

```html
<!-- Template reference variable -->
<input #searchInput />
<button (click)="onSearch(searchInput.value)">Search</button>

<!-- @let for local variables (Angular 18+) -->
@let fullName = firstName() + ' ' + lastName();
<h2>{{ fullName }}</h2>

@let filtered = items().filter(i => i.active);
<span>{{ filtered.length }} active items</span>
```

## Content Projection

```html
<!-- Single slot -->
<app-card>
  <p>This content is projected</p>
</app-card>

<!-- Named slots -->
<app-card>
  <span card-title>My Title</span>
  <p card-body>My content</p>
</app-card>
```

## Rules

- Never use structural directives (`*ngIf`, `*ngFor`, `*ngSwitch`) — use `@if`, `@for`, `@switch`.
- Always provide `track` in `@for` loops with a unique identifier.
- Never call methods that perform computation in templates — use `computed()` signals.
- Use `@let` to avoid repeated signal calls in templates.
- Keep templates under 80 lines — extract child components if larger.
- Use self-closing tags for components without content: `<app-icon />`.
- Prefer property binding `[prop]` over interpolation `{{ }}` for non-text values.
