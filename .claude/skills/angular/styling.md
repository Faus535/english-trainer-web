# Angular Styling — Best Practices

## SCSS Component Styles

- Use `styleUrl` (singular) pointing to an SCSS file.
- Component styles are scoped by default via Angular's view encapsulation.
- Never use `ViewEncapsulation.None` — it leaks styles globally.

## File Structure

```
feature-name/
  feature-name.ts
  feature-name.html
  feature-name.scss
```

## Component SCSS Pattern

```scss
// feature-name.scss
:host {
  display: block; // Always set host display
}

.header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
}

.actions {
  display: flex;
  gap: 0.25rem;
}
```

## Rules

- Always set `display` on `:host` — Angular components are `inline` by default.
- Use `:host` for component-level styles, not a wrapping div.
- Use `:host(.modifier)` for conditional host styling based on classes.
- Use CSS custom properties (variables) for theming, not SCSS variables.
- Use `rem` for spacing and font sizes, not `px`.
- Use CSS Grid and Flexbox for layout — never floats.
- Use `gap` instead of margins between flex/grid children.

## Global Styles

```scss
// styles.scss — global entry point
@use 'styles/variables';
@use 'styles/reset';
@use 'styles/typography';
@use 'styles/utilities';
```

- Place global styles in `src/styles/` directory with `@use` imports.
- Define CSS custom properties in `:root` for theming.
- Keep global styles minimal — prefer component-scoped styles.

## Theming with CSS Custom Properties

```scss
// styles/_variables.scss
:root {
  --color-primary: #3b82f6;
  --color-error: #ef4444;
  --color-surface: #ffffff;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --radius-md: 0.5rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
}
```

```scss
// Component usage
.card {
  background: var(--color-surface);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}
```

## Responsive Design

- Use `min-width` media queries (mobile-first approach).
- Define breakpoints as SCSS variables or CSS custom properties.
- Use container queries (`@container`) for component-level responsiveness.

```scss
:host {
  display: block;
  container-type: inline-size;
}

.grid {
  display: grid;
  grid-template-columns: 1fr;

  @container (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

## What NOT To Do

- Do not use `::ng-deep` — it is deprecated.
- Do not use inline styles in templates.
- Do not use `!important`.
- Do not import global SCSS files in component stylesheets.
- Do not use element selectors (e.g., `div`, `p`) — use class selectors.
- Do not hardcode colors — use CSS custom properties.
