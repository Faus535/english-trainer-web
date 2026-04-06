# State Management

All state uses Angular signals (`signal()`, `computed()`, `effect()`). No RxJS BehaviorSubject for state.

## State Services

| Service              | Location                   | Signals                                                                                                                                                                       | Computed                                                             | Persistence    |
| -------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- | -------------- |
| AuthService          | core/services/             | `_token`, `_profileId`                                                                                                                                                        | `isAuthenticated`                                                    | sessionStorage |
| ProfileStateService  | shared/services/           | `_profile`, `_syncing`                                                                                                                                                        | `testCompleted`, `totalSessions`, `sessionsThisWeek`, `overallLevel` | localStorage   |
| ActivityStateService | shared/services/           | `_activityDates`, `_flashcardCount`                                                                                                                                           | `streak`, `bestStreak`                                               | localStorage   |
| TalkStateService     | features/talk/services/    | `_scenarioId`, `_conversationId`, `_messages`, `_status`, `_streaming`, `_error`, `_endResult`                                                                                | `isActive`, `messageCount`                                           | —              |
| ImmerseStateService  | features/immerse/services/ | `_content`, `_annotations`, `_exercises`, `_activeWord`, `_capturedVocab`, `_exerciseProgress`, `_loading`, `_error`, `_generating`, `_generationStep`, `_generationProgress` | `capturedVocabCount`, `exerciseCompletionRate`                       | —              |
| ReviewStateService   | shared/services/           | Facade pattern                                                                                                                                                                | —                                                                    | —              |
| StateService         | shared/services/           | Facade pattern                                                                                                                                                                | —                                                                    | —              |
| NotificationService  | shared/services/           | `_notifications`                                                                                                                                                              | `hasNotifications`                                                   | —              |
| TtsService           | shared/services/           | `_speaking`, `_rate`                                                                                                                                                          | —                                                                    | —              |
| IdleService          | shared/services/           | `_isIdle`, `_showWarning`, `_remainingSeconds`                                                                                                                                | `remainingDisplay`                                                   | —              |
| OfflineQueueService  | shared/services/           | `_online`, `_queue`                                                                                                                                                           | `pendingCount`                                                       | localStorage   |

## Patterns

- **Facade**: StateService and ReviewStateService delegate to specialized services
- **Persistence**: Auth in sessionStorage (cleared on tab close), profile/activity in localStorage with `english_modular_` prefix
- **No RxJS subjects**: All reactive state via signals
