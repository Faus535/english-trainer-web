# Angular PWA & Offline — Best Practices

## Service Worker Configuration

Configure caching strategies in `ngsw-config.json`.

```json
{
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": ["/favicon.ico", "/index.html", "/*.css", "/*.js"]
      }
    },
    {
      "name": "assets",
      "installMode": "lazy",
      "updateMode": "prefetch",
      "resources": {
        "files": ["/assets/**"]
      }
    }
  ],
  "dataGroups": [
    {
      "name": "api-profile",
      "urls": ["/api/profiles/**"],
      "cacheConfig": {
        "strategy": "freshness",
        "maxAge": "1h",
        "maxSize": 20,
        "timeout": "5s"
      }
    },
    {
      "name": "api-vocab",
      "urls": ["/api/vocab/**", "/api/phrases/**"],
      "cacheConfig": {
        "strategy": "performance",
        "maxAge": "7d",
        "maxSize": 100
      }
    }
  ]
}
```

### Cache Strategy Rules

- **`freshness`**: Network first, cache fallback. Use for user-specific data (profile, sessions, activity).
- **`performance`**: Cache first, network update. Use for reference data (vocab, phrases, achievements).
- Set `timeout` on freshness strategies to fall back faster when offline.
- Set `maxSize` to limit cache entries.
- Set `maxAge` to expire stale data.

## Offline Queue Service

Queue failed requests for retry when back online.

```typescript
interface QueuedRequest {
  id: string;
  method: 'POST' | 'PUT' | 'DELETE';
  url: string;
  body: unknown;
  timestamp: number;
  retryCount: number;
}

@Injectable({ providedIn: 'root' })
export class OfflineQueueService implements OnDestroy {
  private readonly http = inject(HttpClient);

  private readonly _online = signal(navigator.onLine);
  private readonly _queue = signal<QueuedRequest[]>(this.loadQueue());

  readonly online = this._online.asReadonly();
  readonly pendingCount = computed(() => this._queue().length);

  private onlineHandler = () => {
    this._online.set(true);
    this.flush();
  };
  private offlineHandler = () => this._online.set(false);

  constructor() {
    window.addEventListener('online', this.onlineHandler);
    window.addEventListener('offline', this.offlineHandler);
  }

  ngOnDestroy(): void {
    window.removeEventListener('online', this.onlineHandler);
    window.removeEventListener('offline', this.offlineHandler);
  }
}
```

### Rules

- Implement `OnDestroy` to clean up `window` event listeners.
- Store queue in `localStorage` so it survives page reloads.
- Only queue state-changing requests (POST, PUT, DELETE) — never GET.
- Auto-flush when the `online` event fires.
- Use `navigator.onLine` for initial state.

## Exponential Backoff Retry

```typescript
private readonly MAX_RETRIES = 5;

private executeWithRetry(request: QueuedRequest): void {
  const delay = Math.min(1000 * Math.pow(2, request.retryCount), 30000);

  setTimeout(() => {
    this.http.request(request.method, request.url, { body: request.body })
      .subscribe({
        next: () => this.removeFromQueue(request.id),
        error: () => {
          if (request.retryCount < this.MAX_RETRIES) {
            this.incrementRetry(request.id);
            this.executeWithRetry({ ...request, retryCount: request.retryCount + 1 });
          } else {
            this.removeFromQueue(request.id);
          }
        },
      });
  }, delay);
}
```

### Rules

- Max 5 retries.
- Exponential backoff: `1s, 2s, 4s, 8s, 16s` (capped at 30s).
- Remove from queue after max retries — don't retry forever.
- Persist retry count so it survives page reloads.

## Connection Status Component

Show offline state and pending request count.

```typescript
@Component({
  selector: 'app-connection-status',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!online()) {
      <div class="offline-bar" role="alert">
        Sin conexion
        @if (pendingCount() > 0) {
          <span>({{ pendingCount() }} pendientes)</span>
        }
      </div>
    }
  `,
})
export class ConnectionStatus {
  private readonly offlineQueue = inject(OfflineQueueService);
  protected readonly online = this.offlineQueue.online;
  protected readonly pendingCount = this.offlineQueue.pendingCount;
}
```

### Rules

- Use `role="alert"` so screen readers announce connection changes.
- Show pending request count so users know work is queued.
- Fixed position at bottom of screen, high `z-index`.
- Place in the shell component — always visible.

## localStorage Persistence for Queue

```typescript
private readonly STORAGE_KEY = 'et_offline_queue';

private loadQueue(): QueuedRequest[] {
  try {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

private persistQueue(): void {
  localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this._queue()));
}
```

### Rules

- Wrap `JSON.parse` in `try/catch` — storage can be corrupted or full.
- Call `persistQueue()` after every queue mutation.
- Use a namespaced key (`et_` prefix) to avoid collisions.

## What NOT To Do

- Do not queue GET requests — they are idempotent and cacheable via Service Worker.
- Do not retry non-idempotent requests (POST) without user awareness.
- Do not use `performance` cache strategy for user-specific data — it serves stale content.
- Do not forget `timeout` on freshness strategies — without it, the app hangs when offline.
- Do not poll `navigator.onLine` — use event listeners.
- Do not store sensitive data (tokens) in the offline queue.
