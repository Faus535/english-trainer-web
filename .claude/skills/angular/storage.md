# Angular Browser Storage — Best Practices

## Storage Types

| Storage          | Lifetime  | Scope       | Size    | Use case                                  |
| ---------------- | --------- | ----------- | ------- | ----------------------------------------- |
| `sessionStorage` | Tab close | Same tab    | ~5MB    | Auth tokens                               |
| `localStorage`   | Permanent | Same origin | ~5-10MB | User progress, preferences, offline queue |
| `IndexedDB`      | Permanent | Same origin | Large   | Binary data, large datasets               |

## Auth Token Storage

Use `sessionStorage` for tokens — cleared when the tab closes, reducing exposure.

```typescript
const TOKEN_KEY = 'et_token';
const REFRESH_KEY = 'et_refresh_token';
const PROFILE_ID_KEY = 'et_profile_id';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _token = signal<string | null>(sessionStorage.getItem(TOKEN_KEY));

  readonly token = this._token.asReadonly();
  readonly isAuthenticated = computed(() => !!this._token());

  private storeAuth(res: AuthResponse): void {
    sessionStorage.setItem(TOKEN_KEY, res.token);
    sessionStorage.setItem(REFRESH_KEY, res.refreshToken);
    this._token.set(res.token);
  }

  logout(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
    this._token.set(null);
  }
}
```

### Rules

- Never store tokens in `localStorage` — persists across sessions, XSS risk.
- Initialize signals from `sessionStorage` in field declaration.
- Clear all auth keys on logout.
- Use string constants for keys, not inline strings.

## Persistent State with localStorage

Use prefixed keys and JSON serialization.

```typescript
const STORAGE_PREFIX = 'english_modular_';

@Injectable({ providedIn: 'root' })
export class ProfileStateService {
  private readonly _profile = signal<UserProfile>(this.loadState('profile', DEFAULT_PROFILE));

  private loadState<T>(key: string, fallback: T): T {
    try {
      const val = localStorage.getItem(STORAGE_PREFIX + key);
      return val ? (JSON.parse(val) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  private saveState(key: string, val: unknown): void {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
  }

  persistProfile(): void {
    this.saveState('profile', this._profile());
  }
}
```

### Rules

- Always use a prefix: `english_modular_`, `et_` — avoids collisions with other apps on same origin.
- Wrap `JSON.parse` in `try/catch` — storage can be corrupt, empty, or from old version.
- Provide a fallback value for every `loadState` call.
- Call `saveState` after every signal mutation that should persist.
- Generic `loadState<T>` / `saveState` helpers — avoid repeating try/catch.

## Signal + Storage Sync

Keep signals in sync with storage.

```typescript
// Load: storage → signal (on init)
private readonly _items = signal<Item[]>(this.loadState('items', []));

// Save: signal → storage (after mutation)
addItem(item: Item): void {
  this._items.update(items => [...items, item]);
  this.saveState('items', this._items());
}

// Reset: clear both
reset(): void {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(STORAGE_PREFIX)) keys.push(key);
  }
  keys.forEach(k => localStorage.removeItem(k));
  this._items.set([]);
}
```

### Rules

- Initialize signal from storage in field declaration — never in constructor or `ngOnInit`.
- Persist immediately after mutation — don't batch or defer.
- For reset, iterate and remove all prefixed keys.
- Never use `localStorage.clear()` — it wipes other apps' data.

## Offline Queue Storage

```typescript
private readonly QUEUE_KEY = 'et_offline_queue';

enqueue(request: QueuedRequest): void {
  this._queue.update(q => [...q, request]);
  localStorage.setItem(this.QUEUE_KEY, JSON.stringify(this._queue()));
}

private loadQueue(): QueuedRequest[] {
  try {
    const raw = localStorage.getItem(this.QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
```

### Rules

- Queue survives page reloads via localStorage.
- Re-hydrate queue on service construction.
- Remove items from queue after successful retry.
- Don't store sensitive data (tokens, passwords) in the queue.

## Export / Import

Let users export their progress as JSON.

```typescript
exportProgress(): string {
  return JSON.stringify({
    version: 2,
    system: 'modular',
    exportedAt: new Date().toISOString(),
    profile: this._profile(),
  }, null, 2);
}
```

### Rules

- Include a `version` field for forward compatibility.
- Include `exportedAt` timestamp.
- Use `JSON.stringify(data, null, 2)` for human-readable export.
- Validate version on import before applying.

## What NOT To Do

- Do not store auth tokens in `localStorage` — use `sessionStorage`.
- Do not use `localStorage.clear()` — use prefixed key removal.
- Do not skip `try/catch` on `JSON.parse` — storage can be corrupt.
- Do not store large blobs in localStorage — use IndexedDB.
- Do not read localStorage on every render — read once on init, then use signals.
- Do not store derived state — store source data, derive with `computed()`.
- Do not use `sessionStorage` for data that must survive page reloads (progress, queue).
