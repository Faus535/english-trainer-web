# Angular Forms — Best Practices

## Reactive Forms Only

Always use Reactive Forms. Never use template-driven forms (`ngModel`).

## Form Setup

```typescript
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-exercise-form',
  imports: [ReactiveFormsModule],
  templateUrl: './exercise-form.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExerciseForm {
  private readonly fb = inject(FormBuilder);

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    difficulty: ['beginner' as Difficulty, Validators.required],
    tags: this.fb.nonNullable.array<string>([]),
  });

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const value = this.form.getRawValue(); // Typed!
    // handle submission
  }
}
```

## Template

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <label for="title">Title</label>
  <input id="title" formControlName="title" />
  @if (form.controls.title.hasError('required') && form.controls.title.touched) {
    <span class="error">Title is required</span>
  }

  <select formControlName="difficulty">
    @for (level of difficulties; track level) {
      <option [value]="level">{{ level }}</option>
    }
  </select>

  <button type="submit" [disabled]="form.invalid">Save</button>
</form>
```

## Rules

- Always use `fb.nonNullable.group()` for strict typing and non-null defaults.
- Use `getRawValue()` to get typed form values (includes disabled controls).
- Call `markAllAsTouched()` before showing validation errors on submit.
- Never access form values via `.value` — use `getRawValue()` for type safety.
- Show validation errors only when the field is `touched` or `dirty`.

## Custom Validators

```typescript
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minArrayLength(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const arr = control.value as unknown[];
    return arr.length >= min ? null : { minArrayLength: { min, actual: arr.length } };
  };
}
```

## Async Validators

```typescript
export function uniqueTitle(service: ExerciseService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    return service.checkTitle(control.value).pipe(
      map(exists => exists ? { titleTaken: true } : null),
      catchError(() => of(null)),
    );
  };
}
```

## Dynamic Form Arrays

```typescript
readonly tagsArray = this.form.controls.tags;

addTag(tag: string): void {
  this.tagsArray.push(this.fb.nonNullable.control(tag));
}

removeTag(index: number): void {
  this.tagsArray.removeAt(index);
}
```

## What NOT To Do

- Do not use `ngModel` or `FormsModule` — always use `ReactiveFormsModule`.
- Do not subscribe to `valueChanges` without `takeUntilDestroyed()`.
- Do not create deeply nested form groups (max 2 levels).
- Do not use dynamic key access on form controls — use `.controls.fieldName`.
- Do not put business logic in validators — keep them pure.
