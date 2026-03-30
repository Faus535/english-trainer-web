export interface PhonemeResponse {
  id: string;
  symbol: string;
  name: string;
  category: string;
  subcategory: string;
  exampleWords: string[];
  description: string;
}

export type PhonemeDisplayCategory = 'VOWELS' | 'DIPHTHONGS' | 'CONSONANTS';

export function getDisplayCategory(p: PhonemeResponse): PhonemeDisplayCategory {
  if (p.subcategory === 'diphthong') return 'DIPHTHONGS';
  if (p.category === 'vowel') return 'VOWELS';
  return 'CONSONANTS';
}

export interface PhonemeDetailResponse extends PhonemeResponse {
  mouthPosition: string;
  tips: string[];
}

export interface PhraseResponse {
  id: string;
  text: string;
  difficulty: string;
  targetWords: string[];
  phonemeId: string;
}

export interface TodayPhonemeProgressDto {
  attemptsCount: number;
  correctAttemptsCount: number;
  completed: boolean;
  phrasesCompleted: number;
  phrasesTotal: number;
}

export interface TodayPhonemeResponse {
  phoneme: PhonemeResponse;
  assignedDate: string;
  progress: TodayPhonemeProgressDto;
  completedCount: number;
  totalCount: number;
}

export interface PhonemeProgressItem {
  phonemeId: string;
  symbol: string;
  name: string;
  category: string;
  difficultyOrder: number;
  completed: boolean;
  completedAt: string | null;
}

export interface AttemptRequest {
  score: number;
}

export interface AttemptResponse {
  id: string;
  score: number;
  passed: boolean;
  phraseId: string;
  phonemeId: string;
  createdAt: string;
}

export interface CompletionResponse {
  phonemeId: string;
  completed: boolean;
  completedAt: string;
}
