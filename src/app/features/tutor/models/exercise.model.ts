export type ExerciseType = 'FILL_THE_GAP' | 'SENTENCE_CORRECTION' | 'MULTIPLE_CHOICE' | 'REWRITE';

export interface Exercise {
  id: string;
  type: ExerciseType;
  instruction: string;
  content: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  relatedError: string;
}

export interface ConversationExercises {
  conversationId: string;
  exercises: Exercise[];
}

export interface ExerciseAnswer {
  exerciseId: string;
  answer: string;
}

export interface ExerciseResultItem {
  exerciseId: string;
  correct: boolean;
  correctAnswer: string;
  explanation: string;
}

export interface ExerciseResult {
  totalCorrect: number;
  totalExercises: number;
  results: ExerciseResultItem[];
}
