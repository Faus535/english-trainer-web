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
  completedAt?: string;
}

export interface TestQuestionsResponse {
  vocabulary: VocabQuestionResponse[];
  grammar: GrammarQuestionResponse[];
  listening: ListeningQuestionResponse[];
  pronunciation: PronunciationQuestionResponse[];
}

export interface VocabQuestionResponse {
  es: string;
  answer: string;
  alts?: string[];
  level: Level;
}

export interface GrammarQuestionResponse {
  sentence: string;
  options: string[];
  answer: number;
  level: Level;
}

export interface ListeningQuestionResponse {
  text: string;
  level: Level;
  speed: number;
}

export interface PronunciationQuestionResponse {
  word: string;
  options: string[];
  answer: number;
  level: Level;
  special?: 'syllables' | 'words' | 'stress';
}

export interface TestHistoryResponse {
  id: string;
  levels: Record<ModuleName, Level>;
  scores: Record<ModuleName, number>;
  completedAt: string;
  attemptNumber: number;
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

// Profile Management
export interface UpdateProfileRequest {
  name?: string;
  avatarUrl?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountRequest {
  password: string;
}

export interface UserAccountResponse {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  provider: 'local' | 'google';
  createdAt: string;
}

// Password Recovery
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

// Reading
export interface ReadingTextResponse {
  id: string;
  title: string;
  content: string;
  level: Level;
  topic: string;
  wordCount: number;
  estimatedMinutes: number;
}

export interface ReadingQuestionResponse {
  id: string;
  textId: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface ReadingResultResponse {
  textId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
}

export interface SubmitReadingAnswersRequest {
  answers: Record<string, number>;
}

// Writing
export interface WritingExerciseResponse {
  id: string;
  prompt: string;
  level: Level;
  category: string;
  minWords: number;
  maxWords: number;
}

export interface WritingSubmissionRequest {
  exerciseId: string;
  content: string;
}

export interface WritingFeedbackResponse {
  id: string;
  exerciseId: string;
  score: number;
  corrections: WritingCorrection[];
  suggestions: string[];
  summary: string;
  submittedAt: string;
}

export interface WritingCorrection {
  original: string;
  corrected: string;
  type: 'grammar' | 'spelling' | 'style' | 'vocabulary';
  explanation: string;
}

export interface WritingHistoryResponse {
  id: string;
  exerciseId: string;
  prompt: string;
  score: number;
  wordCount: number;
  submittedAt: string;
}

// Analytics
export interface AnalyticsSummaryResponse {
  totalSessions: number;
  totalMinutes: number;
  totalXp: number;
  averageAccuracy: number;
  currentStreak: number;
  bestStreak: number;
  sessionsThisWeek: number;
  sessionsLastWeek: number;
  minutesThisWeek: number;
  minutesLastWeek: number;
}

export interface ModuleLevelHistoryResponse {
  moduleName: string;
  history: { date: string; level: string }[];
}

export interface ActivityHeatmapResponse {
  dates: Record<string, number>;
}

export interface WeakAreaResponse {
  moduleName: string;
  accuracy: number;
  suggestion: string;
}
