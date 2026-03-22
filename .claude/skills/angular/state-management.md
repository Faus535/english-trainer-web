# Angular State Management — Best Practices

## Facade Pattern

Split large state into focused sub-services. A single facade delegates to them, keeping the public API stable.

```typescript
@Injectable({ providedIn: 'root' })
export class StateService {
  private readonly profileState = inject(ProfileStateService);
  private readonly activityState = inject(ActivityStateService);

  // Delegate signals
  readonly profile = this.profileState.profile;
  readonly streak = this.activityState.streak;

  // Delegate methods
  getModuleLevel(mod: ModuleName): Level {
    return this.profileState.getModuleLevel(mod);
  }

  recordActivity(): void {
    this.activityState.recordActivity();
  }
}
```

### Rules

- One sub-service per domain (profile, activity, progress, review).
- Facade exposes readonly signals and methods — never internal sub-services.
- Sub-services are `providedIn: 'root'` singletons.
- Facade never contains business logic — only delegation.

## State Machines with Signals

Model finite states as union types. Use a single signal for the machine state.

```typescript
export type ConversationStatus = 'idle' | 'recording' | 'sending' | 'speaking' | 'error';

@Injectable({ providedIn: 'root' })
export class ConversationStateService {
  private readonly _status = signal<ConversationStatus>('idle');
  private readonly _error = signal<string | null>(null);

  readonly status = this._status.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isActive = computed(() => this._status() !== 'idle');

  setStatus(status: ConversationStatus): void {
    this._status.set(status);
  }

  clearError(): void {
    this._error.set(null);
    if (this._status() === 'error') {
      this._status.set('idle');
    }
  }
}
```

### Rules

- Define status as a union type, not an enum.
- Expose `status` as `asReadonly()`.
- Derive booleans with `computed()` (e.g., `isActive`, `isSending`).
- Error state is a separate signal — not embedded in the status type.
- Status transitions happen only inside the service, never from outside (except `setStatus` for orchestration).

## Multi-Signal Services

When a feature needs several related pieces of state, group them in one service.

```typescript
@Injectable({ providedIn: 'root' })
export class FeatureStateService {
  private readonly _items = signal<Item[]>([]);
  private readonly _selectedId = signal<string | null>(null);
  private readonly _loading = signal(false);

  readonly items = this._items.asReadonly();
  readonly selectedId = this._selectedId.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly selectedItem = computed(() => this._items().find((i) => i.id === this._selectedId()));
  readonly count = computed(() => this._items().length);
}
```

### Rules

- Private writable signals with `_` prefix.
- Public readonly via `.asReadonly()`.
- Derived state always via `computed()` — never methods that read signals.
- Never expose `.set()` or `.update()` directly — wrap in named methods.
- Immutable updates only: `update(items => [...items, newItem])`.

## Backend Sync Pattern

Combine local signal state with backend persistence.

```typescript
startConversation(level: Level): void {
  this._status.set('sending');
  this._error.set(null);

  this.api.start({ level }).subscribe({
    next: (res) => {
      this._id.set(res.id);
      this._messages.set(res.messages);
      this._status.set('idle');
    },
    error: (err) => {
      this._status.set('error');
      this._error.set(err.error?.message ?? 'Error de conexion');
    },
  });
}
```

### Rules

- Set status to `'sending'` before the HTTP call.
- Clear previous errors before the call.
- On success: update state, set status to `'idle'`.
- On error: set status to `'error'`, store user-friendly error message.
- Never throw from subscribe — always handle both branches.

## What NOT To Do

- Do not create "God services" with 10+ signals — split into focused sub-services behind a facade.
- Do not use `BehaviorSubject` — use `signal()`.
- Do not mutate arrays/objects — always create new references.
- Do not store UI state (form values, toggles) in global services — keep it in the component.
- Do not read signals in methods called from templates — use `computed()` instead.
- Do not expose writable signals publicly — always `.asReadonly()`.
