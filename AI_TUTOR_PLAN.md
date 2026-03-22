# AI Tutor - Frontend Implementation Plan

## Overview

New `tutor` feature: chat-style UI where the user speaks with an AI English tutor via voice.
Reuses existing `SpeechRecognitionService` (STT) and `TtsService` (TTS).

## Voice Pipeline

```
User taps mic → SpeechRecognition (free mode) → transcript + confidence
  → POST /api/conversations/{id}/messages → Claude response + feedback
  → Display in chat → TtsService.speak(response) → User listens → Repeat
```

## Feature Structure

```
features/tutor/
  tutor.routes.ts
  pages/tutor-page/          # Main conversation page
  components/
    chat-bubble/              # Message bubble (user right, tutor left)
    voice-input/              # Mic button with recording/sending states
    feedback-card/            # Expandable grammar/vocab/pronunciation feedback
    conversation-header/      # Level, topic, end button
    conversation-list/        # Past conversations list
  services/
    tutor-api.service.ts      # HTTP calls to /api/conversations
    conversation-state.service.ts  # Signal-based state
  models/
    tutor.model.ts            # Interfaces
```

## Models

- `ConversationMessage`: id, role (user|assistant), content, timestamp, feedback?, confidence?
- `TutorFeedback`: grammarCorrections[], vocabularySuggestions[], pronunciationTips[], encouragement
- `GrammarCorrection`: original, corrected, rule
- `VocabSuggestion`: word, definition, example
- `PronunciationTip`: word, ipa, tip
- `ConversationStatus`: 'idle' | 'recording' | 'sending' | 'speaking' | 'error'

## Phase 1 — Core conversation UI

- [x] Route `/tutor` lazy-loaded with authGuard + testCompletedGuard
- [x] Add navigation item in shell bottom nav
- [x] `tutor.model.ts` with all interfaces
- [x] `TutorApiService`: startConversation, sendMessage, getConversation, listConversations, endConversation
- [x] `ConversationStateService`: signals for conversationId, messages[], status, currentLevel
- [x] `SpeechRecognitionService` — add `startFreeRecording()` method (no expected phrase, raw transcript)
- [x] `TutorPage` component: orchestrates voice pipeline (record → send → display → speak)
- [x] `ChatBubble` component: user messages right, tutor left, auto-scroll to bottom
- [x] `VoiceInput` component: mic button with visual states (idle, recording, sending, speaking)
- [x] `ConversationHeader`: level display, end conversation button

## Phase 2 — Feedback display

- [x] `FeedbackCard` component: expandable card below each tutor message
- [x] Show grammar corrections with original → corrected highlighting
- [x] Show vocabulary suggestions with definition + example
- [x] Show pronunciation tips with IPA + tap-to-hear (TtsService)
- [x] Encouragement message display

## Phase 3 — Level selection + history

- [x] Level selector in conversation start (defaults to profile pronunciation level)
- [x] `ConversationList` component: past conversations with date, topic, level
- [x] Resume or review past conversations
- [x] Topic selector (optional) when starting a conversation

## Phase 4 — Integration + polish

- [x] XP animation on conversation end (reuse GamificationBar)
- [x] "Add to review" button on vocabulary suggestions → review-api.service
- [x] Loading skeleton during AI response
- [x] Error states: network failure, API timeout, mic permission denied
- [x] Conversation summary screen on end

## Phase 5 — Advanced (future)

- [x] Role-play mode selector (job interview, restaurant, travel, etc.)
- [ ] Streaming response display (word by word as SSE arrives)
- [ ] Conversation stats: mistakes over time, words learned
- [ ] Suggested topics based on level and history
