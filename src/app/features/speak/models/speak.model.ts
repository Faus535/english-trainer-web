export type { Level } from '../../../shared/models/learning.model';

export interface Phrase {
  en: string;
  es: string;
}

export interface WordResult {
  word: string;
  correct: boolean;
}

export interface PronunciationResult {
  transcript: string;
  confidence: number;
  expected: string;
  score: number;
  words: WordResult[];
  error?: string;
}

export type RecognitionState = 'idle' | 'recording' | 'processing' | 'result';

export interface PronunciationFeedback {
  level: 'excellent' | 'good' | 'ok' | 'retry';
  message: string;
}
