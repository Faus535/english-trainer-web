# Angular Testing — Best Practices

## Stack

- **Test runner**: Vitest (configured in this project).
- **Test utilities**: `@angular/core/testing` (`TestBed`).
- **No Karma, no Jasmine** — use Vitest `describe`, `it`, `expect`.

## Component Testing

```typescript
import { TestBed } from '@angular/core/testing';
import { ExerciseCard } from './exercise-card';

describe('ExerciseCard', () => {
  it('should display the exercise title', async () => {
    const fixture = TestBed.createComponent(ExerciseCard);
    fixture.componentRef.setInput('title', 'Present Simple');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Present Simple');
  });

  it('should emit selected event on click', async () => {
    const fixture = TestBed.createComponent(ExerciseCard);
    fixture.componentRef.setInput('title', 'Verbs');
    fixture.detectChanges();

    const spy = vi.fn();
    fixture.componentInstance.selected.subscribe(spy);

    const button = fixture.nativeElement.querySelector('button');
    button.click();

    expect(spy).toHaveBeenCalledWith('Verbs');
  });
});
```

## Service Testing

```typescript
import { TestBed } from '@angular/core/testing';
import { ExerciseService } from './exercise.service';

describe('ExerciseService', () => {
  let service: ExerciseService;

  beforeEach(() => {
    service = TestBed.inject(ExerciseService);
  });

  it('should start with empty items', () => {
    expect(service.items()).toEqual([]);
  });

  it('should add an item', () => {
    service.addItem({ id: '1', title: 'Test' });
    expect(service.items()).toHaveLength(1);
  });
});
```

## HTTP Testing

```typescript
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should fetch exercises', () => {
    const mockData = [{ id: '1', title: 'Test' }];
    service.getExercises().subscribe(result => {
      expect(result).toEqual(mockData);
    });

    const req = httpMock.expectOne('/api/exercises');
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });
});
```

## Rules

- Use `TestBed.createComponent()` for component tests.
- Set inputs via `fixture.componentRef.setInput()`, never by assigning properties.
- Call `fixture.detectChanges()` after setting inputs.
- Use `vi.fn()` for spies (Vitest), not `jasmine.createSpy`.
- Mock services with `{ provide: Service, useValue: mockService }` in `TestBed`.
- Test behavior, not implementation — assert on DOM output and emitted events.
- Keep tests flat — avoid `beforeEach` chains deeper than 1 level.
- Name test files `*.spec.ts` next to the file they test.

## What NOT To Do

- Do not test private methods — test through the public API.
- Do not use `fixture.debugElement` when `fixture.nativeElement` works.
- Do not use `async/await` with `fakeAsync` — they don't mix.
- Do not snapshot-test component HTML — it creates brittle tests.
- Do not mock signals — test with real signal values.
