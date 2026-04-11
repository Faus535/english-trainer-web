import { Level } from '../../../shared/models/learning.model';

export interface ImmerseContent {
  id: string;
  title: string;
  sourceUrl?: string;
  paragraphs: AnnotatedParagraph[];
  difficulty: Level;
  wordCount: number;
  contentType?: ContentType;
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

export type ExerciseType = 'fill-blank' | 'definition-match' | 'context-use' | 'LISTENING_CLOZE';

export interface ImmerseExercise {
  id: string;
  type: ExerciseType;
  prompt: string;
  options?: string[];
  correctAnswer: string;
  listenText?: string;
  blankPosition?: number;
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

export type ContentType = 'TEXT' | 'AUDIO' | 'VIDEO';

export interface GenerateContentRequest {
  contentType: ContentType;
  level?: Level;
  topic?: string;
}

export interface ImmerseContentRequest {
  url?: string;
  text?: string;
}

export type ImmerseContentStatus = 'PENDING' | 'PROCESSING' | 'PROCESSED' | 'FAILED';

export type GenerationStep =
  | 'idle'
  | 'sending'
  | 'analyzing'
  | 'writing'
  | 'annotating'
  | 'finalizing';

export interface GenerationStepConfig {
  key: GenerationStep;
  label: string;
  threshold: number;
}

export const GENERATION_STEPS: GenerationStepConfig[] = [
  { key: 'sending', label: 'Sending request...', threshold: 0 },
  { key: 'analyzing', label: 'Analyzing topic...', threshold: 3 },
  { key: 'writing', label: 'Writing content...', threshold: 8 },
  { key: 'annotating', label: 'Annotating vocabulary...', threshold: 18 },
  { key: 'finalizing', label: 'Finalizing...', threshold: 30 },
];

export interface GenerateContentResponse {
  id: string;
  status: ImmerseContentStatus;
}

export interface ImmerseContentResponse extends ImmerseContent {
  status?: ImmerseContentStatus;
}
