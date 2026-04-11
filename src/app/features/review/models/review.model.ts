export interface ReviewItem {
  id: string;
  word: string;
  translation: string;
  contextSentence?: string;
  contextTranslation?: string;
  targetWord?: string;
  targetTranslation?: string;
  quality: number;
  interval: number;
  sourceType?: 'ARTICLE' | 'TALK' | 'IMMERSE';
}

export interface ReviewStats {
  totalItems: number;
  dueToday: number;
  averageQuality: number;
  totalMastered: number;
  weeklyReviewed: number;
  accuracyRate: number;
  retentionRate?: number;
  averageInterval?: number;
}

export type ReviewRating = 'HARD' | 'GOOD' | 'EASY';
