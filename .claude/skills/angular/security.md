# Angular Security — Best Practices

## Token Storage

Never store authentication tokens in `localStorage` — it is accessible to any script via XSS.

### Preferred: HttpOnly Cookies (Backend-Managed)

The most secure approach is httpOnly cookies set by the backend. The frontend never touches the token directly.

```typescript
// app.config.ts — enable credentials for cookie-based auth
provideHttpClient(
  withInterceptors([errorInterceptor]),
  withXsrfConfiguration({ cookieName: 'XSRF-TOKEN', headerName: 'X-XSRF-TOKEN' }),
);
```

```typescript
// auth.service.ts — no token in localStorage
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _isAuthenticated = signal(false);
  readonly isAuthenticated = this._isAuthenticated.asReadonly();

  login(credentials: LoginRequest): Observable<void> {
    return this.http
      .post<void>('/api/auth/login', credentials, { withCredentials: true })
      .pipe(tap(() => this._isAuthenticated.set(true)));
  }

  logout(): void {
    this.http.post('/api/auth/logout', {}, { withCredentials: true }).subscribe();
    this._isAuthenticated.set(false);
  }

  checkSession(): Observable<boolean> {
    return this.http
      .get<{ authenticated: boolean }>('/api/auth/check', { withCredentials: true })
      .pipe(
        map((res) => res.authenticated),
        tap((auth) => this._isAuthenticated.set(auth)),
        catchError(() => {
          this._isAuthenticated.set(false);
          return of(false);
        }),
      );
  }
}
```

### Fallback: SessionStorage + Minimal Exposure

If httpOnly cookies are not possible, use `sessionStorage` (cleared when tab closes) and minimize what is stored.

```typescript
// Never store refresh tokens client-side
// Store only the access token, and only in sessionStorage
sessionStorage.setItem('token', accessToken);

// Clear on logout
sessionStorage.removeItem('token');
```

## Content Sanitization

Angular sanitizes interpolated values by default. Respect this protection.

```typescript
// SAFE — Angular auto-escapes
<p>{{ userInput() }}</p>

// DANGEROUS — bypasses sanitization, avoid unless absolutely necessary
<div [innerHTML]="trustedHtml()">
```

### When Rendering User-Provided HTML

```typescript
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

// Only sanitize through DomSanitizer, never bypass
readonly sanitizedContent = computed(() => {
  return this.sanitizer.sanitize(SecurityContext.HTML, this.rawContent()) ?? '';
});
```

### Markdown Rendering

When building a markdown renderer, sanitize the HTML output before injecting.

```typescript
// Convert markdown to HTML, then sanitize
readonly safeHtml = computed(() => {
  const rawHtml = this.markdownToHtml(this.content());
  return this.sanitizer.sanitize(SecurityContext.HTML, rawHtml) ?? '';
});
```

## CSRF / XSRF Protection

- Enable Angular's built-in XSRF support with `withXsrfConfiguration()`.
- The backend must set the XSRF cookie; Angular reads it and sends the header automatically.
- All state-changing requests (POST, PUT, DELETE) are protected.

## Environment Configuration

Never hardcode API URLs or secrets in source code.

```typescript
// environment.ts (development)
export const environment = {
  apiUrl: 'http://localhost:8081/api',
  production: false,
} as const;

// environment.prod.ts (production)
export const environment = {
  apiUrl: '/api',
  production: true,
} as const;
```

Configure `fileReplacements` in `angular.json`:

```json
{
  "configurations": {
    "production": {
      "fileReplacements": [
        {
          "replace": "src/app/core/services/environment.ts",
          "with": "src/app/core/services/environment.prod.ts"
        }
      ]
    }
  }
}
```

## Rules

- Never store tokens in `localStorage` — use httpOnly cookies or `sessionStorage`.
- Never use `bypassSecurityTrustHtml()` unless the content is fully controlled.
- Always sanitize user-provided HTML through `DomSanitizer.sanitize()`.
- Enable XSRF protection for all state-changing HTTP requests.
- Use separate environment files for dev and production.
- Never hardcode API keys, secrets, or credentials in source code.
- Never log tokens or sensitive data to the console.
- Use `withCredentials: true` when the backend manages auth via cookies.

## What NOT To Do

- Do not store JWT in `localStorage` — XSS can steal it.
- Do not use `bypassSecurityTrustHtml` for user-provided content.
- Do not disable Angular's built-in sanitization.
- Do not include `.env` files or secret keys in the repository.
- Do not expose internal error details (stack traces, DB errors) to the user.
- Do not trust client-side validation alone — always validate server-side too.
