# API Integration

Base URL: `http://localhost:8081/api`

## Auth (AuthService — 7 methods)

| Method            | HTTP | Endpoint              |
| ----------------- | ---- | --------------------- |
| login()           | POST | /auth/login           |
| register()        | POST | /auth/register        |
| loginWithGoogle() | POST | /auth/google          |
| refresh()         | POST | /auth/refresh         |
| logout()          | POST | /auth/logout          |
| forgotPassword()  | POST | /auth/forgot-password |
| resetPassword()   | POST | /auth/reset-password  |

## Profile (ProfileApiService — 10 methods)

| Method              | HTTP   | Endpoint                                     | Status    |
| ------------------- | ------ | -------------------------------------------- | --------- |
| getProfile()        | GET    | /profiles/{profileId}                        | Active    |
| getCurrentUser()    | GET    | /auth/me                                     | Active    |
| changePassword()    | PUT    | /auth/change-password                        | Active    |
| deleteAccount()     | DELETE | /auth/account                                | Active    |
| addXp()             | POST   | /profiles/{profileId}/xp                     | Active    |
| markTestCompleted() | PUT    | /profiles/{profileId}/test-completed         | **Stale** |
| resetTest()         | PUT    | /profiles/{profileId}/reset-test             | **Stale** |
| updateModuleLevel() | PUT    | /profiles/{profileId}/modules/{module}/level | **Stale** |
| setAllLevels()      | PUT    | /profiles/{profileId}/levels                 | **Stale** |
| recordSession()     | POST   | /profiles/{profileId}/sessions               | **Stale** |

## Activity (ActivityApiService — 3 methods)

| Method             | HTTP | Endpoint                       |
| ------------------ | ---- | ------------------------------ |
| recordActivity()   | POST | /profiles/{profileId}/activity |
| getActivityDates() | GET  | /profiles/{profileId}/activity |
| getStreak()        | GET  | /profiles/{profileId}/streak   |

## Home (HomeApiService — 1 method)

| Method           | HTTP | Endpoint                   |
| ---------------- | ---- | -------------------------- |
| getHomeSummary() | GET  | /profiles/{profileId}/home |

## Talk (TalkApiService — 5 methods + SSE)

| Method                   | HTTP     | Endpoint                                 |
| ------------------------ | -------- | ---------------------------------------- |
| listScenarios()          | GET      | /talk/scenarios                          |
| startConversation()      | POST     | /talk/conversations                      |
| endConversation()        | POST     | /talk/conversations/{id}/end             |
| getConversationSummary() | GET      | /talk/conversations/{id}/summary         |
| getTalkStats()           | GET      | /profiles/{userId}/talk/stats            |
| streamMessage()          | POST/SSE | /talk/conversations/{id}/messages/stream |

## Immerse (ImmerseApiService — 7 methods)

| Method                 | HTTP | Endpoint                                                   |
| ---------------------- | ---- | ---------------------------------------------------------- |
| submitContent()        | POST | /immerse/content                                           |
| generateContent()      | POST | /immerse/generate                                          |
| getContent()           | GET  | /immerse/content/{contentId}                               |
| getExercises()         | GET  | /immerse/content/{contentId}/exercises                     |
| submitExerciseAnswer() | POST | /immerse/content/{contentId}/exercises/{exerciseId}/submit |
| getVocabulary()        | GET  | /immerse/content/{contentId}/vocabulary                    |
| getHistory()           | GET  | /profiles/{userId}/immerse/history                         |

## Review (ReviewApiService — 3 methods)

| Method           | HTTP | Endpoint                                           |
| ---------------- | ---- | -------------------------------------------------- |
| getDueReviews()  | GET  | /profiles/{profileId}/review/queue                 |
| completeReview() | POST | /profiles/{profileId}/review/items/{itemId}/result |
| getReviewStats() | GET  | /profiles/{profileId}/review/stats                 |

## Totals

- **API services**: 7
- **Total methods**: 37 (+ 1 SSE stream)
- **Stale methods**: 5 (no matching backend endpoint)
