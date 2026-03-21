import { Level, ModuleName } from './learning.model';

// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  profileId: string;
  email: string;
}

export interface GoogleAuthRequest {
  idToken: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface CurrentUserResponse {
  userId: string;
  email: string;
  profileId: string;
  role: string;
}

// User Profile
export interface UserProfileResponse {
  id: string;
  testCompleted: boolean;
  levelListening: Level;
  levelVocabulary: Level;
  levelGrammar: Level;
  levelPhrases: Level;
  levelPronunciation: Level;
  sessionCount: number;
  sessionsThisWeek: number;
  xp: number;
}

// Module Progress
export interface ModuleProgressResponse {
  id: string;
  userId: string;
  moduleName: ModuleName;
  level: Level;
  currentUnit: number;
  completedUnits: number[];
  totalUnits: number;
}

// Assessment
export interface LevelTestSubmitRequest {
  answers: Record<string, number>;
  scores: Record<ModuleName, number>;
}

export interface LevelTestResultResponse {
  id: string;
  levels: Record<ModuleName, Level>;
  scores: Record<ModuleName, number>;
}

// Gamification
export interface XpLevelResponse {
  totalXp: number;
  level: number;
  levelName: string;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progress: number;
}

export interface AchievementResponse {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

export interface UserAchievementResponse {
  achievementId: string;
  unlockedAt: string;
}

// Activity
export interface StreakResponse {
  currentStreak: number;
  bestStreak: number;
}

// Session
export interface GenerateSessionRequest {
  mode: 'short' | 'full' | 'extended';
}

export interface SessionResponse {
  id: string;
  mode: string;
  blocks: SessionBlockResponse[];
  completed: boolean;
  startedAt: string;
  completedAt: string | null;
  durationMinutes: number;
}

export interface SessionBlockResponse {
  blockType: string;
  moduleName: string;
  durationMinutes: number;
}

// Vocabulary
export interface VocabEntryResponse {
  id: string;
  en: string;
  ipa: string;
  es: string;
  type: string;
  example: string;
  level: Level;
}

// Phrases
export interface PhraseResponse {
  id: string;
  en: string;
  es: string;
  level: Level;
}

// Spaced Repetition
export interface SpacedRepetitionItemResponse {
  id: string;
  itemType: string;
  itemId: string;
  nextReview: string;
  interval: number;
  reviewCount: number;
}

// Review
export interface CompleteReviewRequest {
  quality: number;
}

// API Error
export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
}
