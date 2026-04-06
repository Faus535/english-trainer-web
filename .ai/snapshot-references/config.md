# Configuration

## Dependencies

| Package                 | Version  |
| ----------------------- | -------- |
| @angular/core           | ^21.2.0  |
| @angular/router         | ^21.2.0  |
| @angular/forms          | ^21.2.0  |
| @angular/service-worker | ^21.2.0  |
| lucide-angular          | ^0.577.0 |
| rxjs                    | ~7.8.0   |
| typescript              | ~5.9.2   |
| vitest                  | ^4.0.8   |

## App Configuration

- **Router**: PreloadAllModules, component input binding
- **HTTP**: authInterceptor + errorInterceptor
- **PWA**: Service worker enabled in production
- **Error handling**: Global error listeners
- **Change detection**: OnPush everywhere
- **Components**: All standalone (no NgModules)
- **Control flow**: @if, @for, @switch (no structural directives)

## Environment

| Key            | Value                     |
| -------------- | ------------------------- |
| apiUrl         | http://localhost:8081/api |
| production     | false                     |
| googleClientId | configured                |
| vapidPublicKey | (empty)                   |

## Routes

| Route          | Guard      | Load                 |
| -------------- | ---------- | -------------------- |
| /              | —          | Redirect to /home    |
| /auth/\*       | guestGuard | Lazy-load auth       |
| /home          | authGuard  | HomePage             |
| /talk/\*       | authGuard  | Lazy-load talk       |
| /immerse/\*    | authGuard  | Lazy-load immerse    |
| /review/\*     | authGuard  | Lazy-load review     |
| /profile       | authGuard  | Profile              |
| /notifications | authGuard  | NotificationSettings |
| /settings      | authGuard  | Settings             |
