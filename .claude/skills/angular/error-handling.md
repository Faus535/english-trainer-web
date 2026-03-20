# Angular Error Handling — Best Practices

## Notification Service

Create a centralized notification system using signals. Never log errors silently to console.

```typescript
// shared/services/notification.service.ts
import { Injectable, signal, computed } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly _notifications = signal<Notification[]>([]);

  readonly notifications = this._notifications.asReadonly();
  readonly hasNotifications = computed(() => this._notifications().length > 0);

  show(type: NotificationType, message: string, duration = 4000): void {
    const id = crypto.randomUUID();
    this._notifications.update((list) => [...list, { id, type, message, duration }]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  dismiss(id: string): void {
    this._notifications.update((list) => list.filter((n) => n.id !== id));
  }

  success(message: string): void {
    this.show('success', message);
  }
  error(message: string): void {
    this.show('error', message, 6000);
  }
  warning(message: string): void {
    this.show('warning', message);
  }
  info(message: string): void {
    this.show('info', message);
  }
}
```

## Toast Component

```typescript
// shared/components/toast/toast.ts
@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast {
  protected readonly notifications = inject(NotificationService);

  protected dismiss(id: string): void {
    this.notifications.dismiss(id);
  }
}
```

```html
<!-- toast.html -->
@for (notification of notifications.notifications(); track notification.id) {
<div class="toast" [class]="'toast--' + notification.type" role="alert">
  <span>{{ notification.message }}</span>
  <button (click)="dismiss(notification.id)" aria-label="Cerrar">x</button>
</div>
}
```

## Error Interceptor Pattern

The interceptor must notify the user, not just log to console.

```typescript
// core/interceptors/error.interceptor.ts
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        auth.logout();
        return EMPTY;
      }

      if (error.status === 0) {
        notification.warning(
          'Sin conexion. Los cambios se guardaran cuando vuelvas a estar online.',
        );
        return EMPTY;
      }

      if (error.status >= 500) {
        notification.error('Error del servidor. Intenta de nuevo mas tarde.');
      } else if (error.status >= 400) {
        const message = error.error?.message ?? 'Error en la solicitud.';
        notification.error(message);
      }

      return throwError(() => error);
    }),
  );
};
```

## Component Error States

Always handle loading, error, and empty states in components.

```html
@if (loading()) {
<app-skeleton />
} @else if (error()) {
<div class="error-state" role="alert">
  <p>{{ error() }}</p>
  <button (click)="retry()">Reintentar</button>
</div>
} @else if (items().length === 0) {
<div class="empty-state">
  <p>No hay elementos todavia.</p>
</div>
} @else { @for (item of items(); track item.id) {
<app-item-card [item]="item" />
} }
```

## Retry Strategy for Offline Queue

Implement exponential backoff for failed requests.

```typescript
private retryWithBackoff(request: QueuedRequest, attempt = 1): void {
  const maxAttempts = 5;
  if (attempt > maxAttempts) {
    this.notification.error('No se pudo enviar la solicitud despues de varios intentos.');
    this.removeFromQueue(request.id);
    return;
  }

  const delay = Math.min(1000 * Math.pow(2, attempt - 1), 30000);
  setTimeout(() => this.flush(request, attempt + 1), delay);
}
```

## Rules

- Never use `console.error` as the only error handling — always notify the user.
- Show error toasts for 6 seconds (longer than success toasts at 4 seconds).
- Use `role="alert"` on error messages for screen reader accessibility.
- Handle all three states in data-fetching components: loading, error, empty.
- Provide a "retry" action on recoverable errors.
- Use exponential backoff for retry logic, max 5 attempts.
- Return `EMPTY` from interceptor for errors already handled (401, offline).
- Return `throwError` for errors that components need to handle specifically.
- Log to console in addition to user notification in development only.

## What NOT To Do

- Do not silently swallow errors with empty `catchError(() => EMPTY)`.
- Do not show raw HTTP error messages to the user — map them to friendly text.
- Do not retry non-idempotent requests (POST, DELETE) without user confirmation.
- Do not show multiple overlapping toasts for the same error — debounce if needed.
- Do not use `window.alert()` or `window.confirm()` for error display.
