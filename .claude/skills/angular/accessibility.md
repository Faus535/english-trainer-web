# Angular Accessibility (a11y) — Best Practices

## ARIA Attributes

### Navigation

```html
<!-- Shell bottom nav -->
<nav aria-label="Navegacion principal">
  @for (tab of tabs(); track tab.path) {
  <a
    [routerLink]="tab.path"
    routerLinkActive="active"
    [attr.aria-current]="isActive(tab.path) ? 'page' : null"
    [attr.aria-label]="tab.label"
  >
    <app-icon [name]="tab.icon" aria-hidden="true" />
    <span>{{ tab.label }}</span>
  </a>
  }
</nav>
```

### Icons

Decorative icons must be hidden from assistive technology.

```html
<!-- Decorative icon (next to text) — hide from screen readers -->
<button>
  <app-icon name="play" aria-hidden="true" />
  <span>Reproducir</span>
</button>

<!-- Icon-only button — needs aria-label -->
<button aria-label="Reproducir audio" (click)="play()">
  <app-icon name="play" aria-hidden="true" />
</button>
```

### Interactive Elements

```html
<!-- Buttons with icons need labels -->
<button aria-label="Cerrar" (click)="close()">
  <app-icon name="x" aria-hidden="true" />
</button>

<!-- Toggle buttons need aria-pressed -->
<button [attr.aria-pressed]="isActive()" (click)="toggle()">
  {{ isActive() ? 'Activo' : 'Inactivo' }}
</button>

<!-- Expandable sections -->
<button [attr.aria-expanded]="isOpen()" [attr.aria-controls]="'panel-' + id()" (click)="toggle()">
  {{ title() }}
</button>
<div [id]="'panel-' + id()" [attr.aria-hidden]="!isOpen()" role="region">
  <ng-content />
</div>
```

## Focus Management

### Route Changes

Move focus to the main content area after navigation.

```typescript
// shell.ts or app.ts
private readonly router = inject(Router);

constructor() {
  this.router.events.pipe(
    filter(e => e instanceof NavigationEnd),
    takeUntilDestroyed(),
  ).subscribe(() => {
    const main = document.querySelector<HTMLElement>('main, [role="main"]');
    main?.focus();
  });
}
```

```html
<!-- Main content must be focusable -->
<main tabindex="-1">
  <router-outlet />
</main>
```

### Modals and Dialogs

Trap focus inside modals and restore focus when closing.

```typescript
// Use CDK A11yModule for focus trapping
import { A11yModule } from '@angular/cdk/a11y';

@Component({
  imports: [A11yModule],
  template: `
    <div
      cdkTrapFocus
      cdkTrapFocusAutoCapture
      role="dialog"
      aria-modal="true"
      [attr.aria-label]="title()"
    >
      <ng-content />
    </div>
  `,
})
export class Dialog {}
```

### Keyboard Navigation in Study Sessions

Ensure all interactive blocks are reachable via keyboard.

```html
@for (block of blocks(); track block.id) {
<div
  class="block"
  tabindex="0"
  role="button"
  (keydown.enter)="selectBlock(block)"
  (keydown.space)="selectBlock(block); $event.preventDefault()"
  (click)="selectBlock(block)"
>
  {{ block.content }}
</div>
}
```

## Color Contrast

### Minimum Ratios (WCAG AA)

- **Normal text**: 4.5:1 contrast ratio minimum.
- **Large text** (18px+ or 14px+ bold): 3:1 minimum.
- **Interactive elements** (buttons, links, inputs): 3:1 against adjacent colors.

### Verify Dark Theme Colors

```scss
// Verify these pairs meet 4.5:1 ratio:
// --text-primary (#f4f4f5) on --surface-0 (#09090b) → OK
// --text-muted on --surface-0 → CHECK (may be too low)
// --color-success on --surface-1 → CHECK

// Use tools: WebAIM Contrast Checker, axe DevTools, Lighthouse
```

### Do Not Use Color Alone

```html
<!-- Bad: relies on color alone -->
<span [class.text-red]="hasError()">Status</span>

<!-- Good: color + icon + text -->
@if (hasError()) {
<span class="error">
  <app-icon name="alert-circle" aria-hidden="true" />
  Error: {{ errorMessage() }}
</span>
}
```

## Form Accessibility

```html
<!-- Always associate labels with controls -->
<label for="email">Correo electronico</label>
<input
  id="email"
  formControlName="email"
  type="email"
  [attr.aria-invalid]="form.controls.email.invalid && form.controls.email.touched"
  [attr.aria-describedby]="form.controls.email.errors ? 'email-error' : null"
/>
@if (form.controls.email.hasError('required') && form.controls.email.touched) {
<span id="email-error" role="alert" class="error">El correo es obligatorio.</span>
}
```

## Live Regions

Announce dynamic content changes to screen readers.

```html
<!-- For score updates, streak changes, XP gains -->
<div aria-live="polite" class="sr-only">{{ announcement() }}</div>
```

```scss
// Screen reader only utility
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

## Rules

- Every image must have `alt` text (empty `alt=""` for decorative images).
- Every icon-only button must have `aria-label`.
- Decorative icons use `aria-hidden="true"`.
- Navigation landmarks use `aria-label` to distinguish them.
- Active navigation items use `aria-current="page"`.
- Focus must move to main content after route changes.
- Modals must trap focus and use `role="dialog"` + `aria-modal="true"`.
- Form inputs must have associated `<label>` elements.
- Error messages must use `role="alert"` for immediate announcement.
- Dynamic content updates use `aria-live="polite"`.
- Touch targets must be at least 44x44px.
- Test with keyboard-only navigation (Tab, Enter, Space, Escape, Arrow keys).

## What NOT To Do

- Do not use `tabindex` values greater than 0 — it breaks natural tab order.
- Do not remove focus outlines without providing an alternative indicator.
- Do not rely on color alone to convey information.
- Do not use `aria-hidden="true"` on focusable elements.
- Do not auto-play audio without user interaction.
- Do not use placeholder text as the only label for inputs.
- Do not create custom widgets without full keyboard support.
