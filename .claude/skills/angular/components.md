# Angular Components — Best Practices

## Component Declaration

- Always use **standalone components** (`standalone: true` is default in Angular 19+).
- Never use `NgModule`-based components.
- Import dependencies directly in the `imports` array of `@Component`.
- Use `signal()` for component state, never class properties with manual change detection.
- Use `computed()` for derived state.
- Use `effect()` only for side effects (logging, localStorage sync), never for state derivation.

## File Naming & Structure

- One component per file. File name: `feature-name.ts` (not `.component.ts`).
- Template: `feature-name.html` (use `templateUrl`, not inline `template` for >3 lines).
- Styles: `feature-name.scss` (use `styleUrl`, not inline `styles`).
- Spec: `feature-name.spec.ts`.
- Keep components under 200 lines. Extract logic into services if larger.

## Component Class

```typescript
import { Component, signal, computed, input, output, inject } from '@angular/core';

@Component({
  selector: 'app-feature-name',
  imports: [DependencyA, DependencyB],
  templateUrl: './feature-name.html',
  styleUrl: './feature-name.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeatureName {
  // 1. Dependency injection
  private readonly service = inject(MyService);

  // 2. Inputs (signal-based)
  readonly title = input.required<string>();
  readonly count = input<number>(0);

  // 3. Outputs
  readonly clicked = output<string>();

  // 4. Internal state (signals)
  protected readonly isOpen = signal(false);

  // 5. Computed state
  protected readonly displayTitle = computed(() => `${this.title()} (${this.count()})`);

  // 6. Methods
  protected toggle(): void {
    this.isOpen.update(v => !v);
  }
}
```

## Rules

- Use `ChangeDetectionStrategy.OnPush` on every component.
- Use `inject()` function, never constructor injection.
- Mark template-used members as `protected`, private logic as `private`.
- Use `input()` / `input.required()` instead of `@Input()`.
- Use `output()` instead of `@Output()` + `EventEmitter`.
- Use `model()` for two-way binding instead of `@Input` + `@Output` pairs.
- Prefix selectors with `app-`.
- Never subscribe to observables in components — use `toSignal()` or `async` pipe.
- Use `DestroyRef` + `takeUntilDestroyed()` if you must subscribe imperatively.

## Template Bindings

```html
<!-- Property binding -->
<div [class.active]="isOpen()">

<!-- Event binding -->
<button (click)="toggle()">Toggle</button>

<!-- Signal interpolation -->
<h1>{{ displayTitle() }}</h1>

<!-- Input forwarding -->
<app-child [data]="items()" (selected)="onSelect($event)" />
```

## What NOT To Do

- Do not use `ngOnInit` for signal initialization — initialize in the field declaration.
- Do not use `ngOnChanges` — use `effect()` or `computed()` reacting to input signals.
- Do not mutate input signals — they are readonly.
- Do not use `ViewChild`/`ContentChild` decorators — use `viewChild()` / `contentChild()` signal queries.
- Do not create "smart" and "dumb" component hierarchies deeper than 2 levels.
