# Features

## Auth (4 components)

| Component      | Selector              | Route                 |
| -------------- | --------------------- | --------------------- |
| Login          | `app-login`           | /auth/login           |
| Register       | `app-register`        | /auth/register        |
| ForgotPassword | `app-forgot-password` | /auth/forgot-password |
| ResetPassword  | `app-reset-password`  | /auth/reset-password  |

## Home (4 components)

| Component           | Selector                    | Purpose           |
| ------------------- | --------------------------- | ----------------- |
| HomePage            | `app-home-page`             | Main dashboard    |
| DailyProgress       | `app-daily-progress`        | XP progress ring  |
| StreakWidget        | `app-streak-widget`         | Streak display    |
| SuggestedActionCard | `app-suggested-action-card` | Action suggestion |

## Talk (11 components, 3 pages)

| Component          | Selector                  | Purpose                |
| ------------------ | ------------------------- | ---------------------- |
| ScenarioSelect     | `app-scenario-select`     | Scenario picker (page) |
| TalkConversation   | `app-talk-conversation`   | Conversation (page)    |
| TalkSummary        | `app-talk-summary`        | Summary (page)         |
| ScenarioCard       | `app-scenario-card`       | Scenario card          |
| ChatBubble         | `app-chat-bubble`         | Message display        |
| ConversationHeader | `app-conversation-header` | Header                 |
| TalkInputBar       | `app-talk-input-bar`      | Input bar              |
| InlineCorrection   | `app-inline-correction`   | Grammar corrections    |
| FeedbackCard       | `app-feedback-card`       | Feedback               |
| EvaluationCard     | `app-evaluation-card`     | Evaluation metrics     |
| GoalsTracker       | `app-goals-tracker`       | Goal progress          |

## Immerse (7 components, 3 pages)

| Component         | Selector                 | Purpose                                |
| ----------------- | ------------------------ | -------------------------------------- |
| ImmerseHub        | `app-immerse-hub`        | Content submission & generation (page) |
| ImmerseReader     | `app-immerse-reader`     | Content reader (page)                  |
| ImmerseExercises  | `app-immerse-exercises`  | Exercises (page)                       |
| AnnotatedWord     | `app-annotated-word`     | Word annotation                        |
| WordPopup         | `app-word-popup`         | Word definition popup                  |
| VocabChip         | `app-vocab-chip`         | Vocabulary token                       |
| GenerationOverlay | `app-generation-overlay` | Generation progress overlay            |

## Review (2 components)

| Component   | Selector           | Route         |
| ----------- | ------------------ | ------------- |
| ReviewPage  | `app-review-page`  | /review       |
| ReviewStats | `app-review-stats` | /review/stats |

## Profile & Settings (3 components)

| Component            | Selector                    | Route          |
| -------------------- | --------------------------- | -------------- |
| Profile              | `app-profile`               | /profile       |
| Settings             | `app-settings`              | /settings      |
| NotificationSettings | `app-notification-settings` | /notifications |

## Totals

- **Features**: 7 (auth, home, talk, immerse, review, profile, settings)
- **Components**: ~50 (37 feature + 12 shared + shell)
- **Pages**: 16
