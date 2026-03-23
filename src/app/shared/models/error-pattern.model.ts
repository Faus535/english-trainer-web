export type ErrorCategory =
  | 'TENSE'
  | 'ARTICLE'
  | 'PREPOSITION'
  | 'WORD_ORDER'
  | 'SUBJECT_VERB_AGREEMENT'
  | 'VOCABULARY'
  | 'SPELLING'
  | 'PUNCTUATION'
  | 'OTHER';

export interface ErrorPattern {
  category: ErrorCategory;
  pattern: string;
  occurrenceCount: number;
  lastOccurred: string;
  examples: string[];
  resolved: boolean;
}

export interface ErrorSummary {
  totalErrors: number;
  categoryCounts: Record<ErrorCategory, number>;
  topPatterns: ErrorPattern[];
  resolvedCount: number;
}
