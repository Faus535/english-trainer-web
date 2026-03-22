import { Level } from '../../../shared/models/learning.model';

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  feedback?: TutorFeedback;
  confidence?: number;
}

export interface TutorFeedback {
  grammarCorrections: GrammarCorrection[];
  vocabularySuggestions: VocabSuggestion[];
  pronunciationTips: PronunciationTip[];
  encouragement: string;
}

export interface GrammarCorrection {
  original: string;
  corrected: string;
  rule: string;
}

export interface VocabSuggestion {
  word: string;
  definition: string;
  example: string;
}

export interface PronunciationTip {
  word: string;
  ipa: string;
  tip: string;
}

export type ConversationStatus = 'idle' | 'recording' | 'sending' | 'speaking' | 'error';

export interface Conversation {
  id: string;
  level: Level;
  topic?: string;
  startedAt: string;
  endedAt?: string;
  messageCount: number;
}

export interface ConversationDetailResponse {
  id: string;
  level: Level;
  topic?: string;
  messages: ConversationMessage[];
  startedAt: string;
  endedAt?: string;
}

export interface StartConversationRequest {
  level: Level;
  topic?: string;
}

export interface SendMessageRequest {
  content: string;
  confidence?: number;
}

export interface SendMessageResponse {
  message: ConversationMessage;
}

export interface EndConversationResponse {
  xpEarned: number;
  messagesCount: number;
  summary: string;
}

export type TutorTopic =
  | 'free'
  | 'job_interview'
  | 'restaurant'
  | 'travel'
  | 'shopping'
  | 'daily_life';

export const TUTOR_TOPICS: { value: TutorTopic; label: string }[] = [
  { value: 'free', label: 'Conversacion libre' },
  { value: 'job_interview', label: 'Entrevista de trabajo' },
  { value: 'restaurant', label: 'En el restaurante' },
  { value: 'travel', label: 'Viajando' },
  { value: 'shopping', label: 'De compras' },
  { value: 'daily_life', label: 'Vida diaria' },
];
