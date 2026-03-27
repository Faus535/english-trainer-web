export interface ExerciseResult {
  exerciseType: 'listening' | 'vocabulary' | 'grammar' | 'phrases' | 'pronunciation';
  exerciseIndex?: number;
  correctCount: number;
  totalCount: number;
  score: number;
  durationMs: number;
  items: ExerciseResultItem[];
}

export interface ExerciseResultItem {
  contentId?: string;
  word?: string;
  correct: boolean;
}
