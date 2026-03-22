# Angular Animations — Best Practices

## CSS-Only Approach

This project uses CSS transitions and `@keyframes` — not `@angular/animations`. Keep it that way unless a use case requires dynamic animation parameters.

## Transitions

Use `transition` for hover, focus, and state changes.

```scss
.btn {
  background: var(--primary);
  transition: all 200ms var(--ease);

  &:hover {
    background: var(--primary-hover);
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
```

### Rules

- Use the global easing variable: `var(--ease)` (`cubic-bezier(0.4, 0, 0.2, 1)`).
- Duration: `200ms` for micro-interactions, `300ms` for state changes, `500ms` for entrances.
- Prefer `transform` and `opacity` — they are GPU-accelerated and don't trigger layout.
- Never animate `width`, `height`, `top`, `left` — use `transform: translate/scale` instead.
- Use `all` for transitions only when few properties change. Be specific when possible.

## Keyframe Animations

Define `@keyframes` at the bottom of the SCSS file where they are used.

```scss
.mic-btn--recording {
  animation: pulse 1.5s infinite;
}

.skeleton {
  animation: shimmer 1.5s infinite;
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes shimmer {
  0%,
  100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.8;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
```

### Common Animation Patterns

| Pattern     | Use case                          | Duration        | Timing         |
| ----------- | --------------------------------- | --------------- | -------------- |
| `pulse`     | Recording indicator, active state | `1.5s infinite` | ease (default) |
| `shimmer`   | Loading skeletons                 | `1.5s infinite` | ease (default) |
| `spin`      | Loading spinner                   | `1s infinite`   | `linear`       |
| `bounce-in` | Success/celebration entrance      | `0.5s`          | `var(--ease)`  |
| `ring`      | Focus ring expansion              | `1.5s infinite` | ease (default) |

### Rules

- `infinite` for ongoing states (recording, loading).
- Single-play for entrance animations (bounce-in, fade-in).
- Use `linear` only for rotation (spin). All others use easing.
- Keep animations under 2 seconds — longer feels sluggish.

## State-Based Animation with Classes

Toggle CSS classes to animate between component states.

```scss
.mic-btn {
  transition: all 300ms var(--ease);
  position: relative;

  // Ring effect with pseudo-element
  &::before {
    content: '';
    position: absolute;
    inset: -0.25rem;
    border-radius: var(--r-full);
    border: 2px solid transparent;
    transition: all 300ms var(--ease);
  }

  &--recording {
    background: var(--error);
    animation: pulse 1.5s infinite;

    &::before {
      border-color: var(--error);
      animation: ring 1.5s infinite;
    }
  }

  &--sending {
    background: var(--surface-1);
    color: var(--text-3);

    app-icon {
      animation: spin 1s linear infinite;
    }
  }

  &--speaking {
    background: var(--success);

    app-icon {
      animation: pulse-icon 1s infinite;
    }
  }
}
```

### Rules

- Use BEM modifier classes for states: `--recording`, `--sending`, `--speaking`.
- Apply via `[class.mic-btn--recording]="status() === 'recording'"` in templates.
- Pseudo-elements (`::before`, `::after`) for decorative effects (rings, glows).
- Scope `app-icon` animation selectors inside the parent state class.

## Loading Skeletons

```scss
.skeleton-container {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-2);
}

.skeleton {
  background: var(--surface-1);
  border-radius: var(--r-md);
  animation: shimmer 1.5s infinite;

  &--avatar {
    width: 2rem;
    height: 2rem;
    border-radius: var(--r-full);
  }
  &--line {
    height: 1rem;
  }
  &--long {
    width: 80%;
  }
  &--medium {
    width: 60%;
  }
  &--short {
    width: 40%;
  }
}
```

### Rules

- Match the skeleton layout to the content it replaces.
- Use `var(--surface-1)` background — not grey.
- Shimmer with opacity, not gradient translate (simpler, performs better).
- Add `aria-label` to the skeleton container for accessibility.

## What NOT To Do

- Do not use `@angular/animations` unless you need dynamic values (runtime-calculated pixels, etc.).
- Do not animate `margin`, `padding`, `width`, `height` — use `transform` and `opacity`.
- Do not use `animation-delay` for stagger effects on more than 5 items — performance degrades.
- Do not use `!important` on animation properties.
- Do not create animations longer than 2 seconds.
- Do not auto-play distracting animations (flashing, bouncing) without user trigger.
- Do not animate `box-shadow` — use `filter: drop-shadow()` or pseudo-element opacity instead.
