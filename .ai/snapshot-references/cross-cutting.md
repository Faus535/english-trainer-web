# Cross-Cutting Analysis

## API Alignment (Backend ↔ Frontend)

| Area         | Backend Endpoints | Frontend Methods                        | Status                                      |
| ------------ | ----------------- | --------------------------------------- | ------------------------------------------- |
| Auth         | 10                | 7 (AuthService) + 3 (ProfileApiService) | Aligned                                     |
| Profile      | 4                 | 10 (ProfileApiService)                  | **Mismatch** — frontend has 6 stale methods |
| Activity     | 3                 | 3                                       | Aligned                                     |
| Gamification | 5                 | 0 (event-driven only)                   | No frontend integration                     |
| Home         | 1                 | 1                                       | Aligned                                     |
| Immerse      | 8                 | 7 + polling                             | Aligned                                     |
| Review       | 3                 | 3                                       | Aligned                                     |
| Talk         | 7                 | 5 + SSE                                 | Aligned                                     |

## Stale Frontend Methods (No Backend Endpoint)

| Service                 | Method              | HTTP | Endpoint                              |
| ----------------------- | ------------------- | ---- | ------------------------------------- |
| ProfileApiService       | markTestCompleted() | PUT  | /profiles/{id}/test-completed         |
| ProfileApiService       | resetTest()         | PUT  | /profiles/{id}/reset-test             |
| ProfileApiService       | updateModuleLevel() | PUT  | /profiles/{id}/modules/{module}/level |
| ProfileApiService       | setAllLevels()      | PUT  | /profiles/{id}/levels                 |
| ProfileApiService       | recordSession()     | POST | /profiles/{id}/sessions               |
| PushNotificationService | registerSub()       | POST | /notifications/subscribe              |

## Security

- JWT auth with proactive refresh (5-min margin on frontend)
- IDOR protection via `@RequireProfileOwnership` aspect
- Rate limiting filter in shared infrastructure
- CORS configuration present
- Frontend stores tokens in sessionStorage

## Risks & Gaps

1. **Profile API dead code**: Frontend ProfileApiService has 5 methods calling non-existent backend endpoints (legacy from pre-redesign)
2. **Notification infrastructure gone**: Backend dropped notification tables (V10.5.0) but frontend still has PushNotificationService
3. **Gamification not exposed to frontend**: XP/achievements are event-driven but no UI consumes them
4. **No pagination on list endpoints**: Review queue, immerse history, activity dates — potential scaling issue
5. **AI single provider**: Only Anthropic Claude configured, no fallback
