import { Level } from '../../../shared/models/learning.model';

export interface ImmerseContent {
  id: string;
  title: string;
  sourceUrl?: string;
  paragraphs: AnnotatedParagraph[];
  difficulty: Level;
  wordCount: number;
}

export interface AnnotatedParagraph {
  text: string;
  annotations: WordAnnotation[];
}

export interface WordAnnotation {
  word: string;
  startIndex: number;
  endIndex: number;
  definition: string;
  partOfSpeech: string;
  level: Level;
}

export interface ImmerseExercise {
  id: string;
  type: 'fill-blank' | 'definition-match' | 'context-use';
  prompt: string;
  options?: string[];
  correctAnswer: string;
}

export interface ImmerseExerciseResult {
  exerciseId: string;
  correct: boolean;
  userAnswer: string;
}

export interface VocabEntry {
  word: string;
  definition: string;
  partOfSpeech: string;
  level: Level;
  contextSentence: string;
}

export interface ImmerseContentSuggestion {
  id: string;
  title: string;
  description: string;
  difficulty: Level;
  estimatedMinutes: number;
}

export interface ImmerseContentRequest {
  url?: string;
  text?: string;
}

export type ImmerseContentResponse = ImmerseContent;
