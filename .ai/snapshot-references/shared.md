# Shared Components, Guards & Interceptors

## Shared Components (12)

| Component          | Selector                    | Purpose                  |
| ------------------ | --------------------------- | ------------------------ |
| Icon               | `app-icon`                  | Lucide icon wrapper      |
| Toast              | `app-toast`                 | Notification toast       |
| FormError          | `app-form-error`            | Form error message       |
| ProgressRing       | `app-progress-ring`         | SVG progress ring        |
| ConnectionStatus   | `app-connection-status`     | Online/offline indicator |
| AchievementPopup   | `app-achievement-popup`     | Achievement popup        |
| IdleWarningModal   | `app-idle-warning-modal`    | Idle timeout warning     |
| Skeleton           | `app-skeleton`              | Loading skeleton         |
| VocabPopup         | `app-vocab-popup`           | Vocabulary popup         |
| EmptyState         | `app-empty-state`           | Empty state placeholder  |
| Onboarding         | `app-onboarding`            | Onboarding wizard        |
| GoogleSignInButton | `app-google-sign-in-button` | Google OAuth button      |

## Guards (2)

| Guard      | Type          | Behavior                                 |
| ---------- | ------------- | ---------------------------------------- |
| authGuard  | CanActivateFn | Requires auth → redirects to /auth/login |
| guestGuard | CanActivateFn | Requires no auth → redirects to /home    |

## Interceptors (2)

| Interceptor      | Purpose                                                                      |
| ---------------- | ---------------------------------------------------------------------------- |
| authInterceptor  | Attaches Bearer token, proactive refresh (5-min margin)                      |
| errorInterceptor | 401 refresh+retry, 403 permission denied, 0 offline queue, 500+ server error |

## Layout

- **Shell** (`app-shell`): Main container with bottom nav (Home, Talk, Immerse, Review), toast, connection status, idle warning
