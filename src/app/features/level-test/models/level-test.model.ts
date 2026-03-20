import { Level } from '../../../shared/models/learning.model';

export type TestPhase = 'intro' | 'vocabulary' | 'grammar' | 'listening' | 'pronunciation' | 'results';

export interface VocabQuestion {
  es: string;
  answer: string;
  alts?: string[];
  level: Level;
}

export interface GrammarQuestion {
  sentence: string;
  options: string[];
  answer: number;
  level: Level;
}

export interface ListeningQuestion {
  text: string;
  level: Level;
  speed: number;
}

export interface PronunciationQuestion {
  word: string;
  options: string[];
  answer: number;
  level: Level;
  special?: 'syllables' | 'words' | 'stress';
}

export interface TestAnswer {
  level: Level;
  correct: boolean;
  score?: number;
}

export interface ProfileType {
  id: 'avanzado_pasivo' | 'reactivador' | 'intermedio' | 'basico';
  label: string;
}
