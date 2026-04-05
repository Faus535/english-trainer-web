import { Level } from './learning.model';

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
  exercises?: SessionExerciseResponse[];
  exerciseCount?: number;
  completedExercises?: number;
  blockCompleted?: boolean;
}

export interface SessionExerciseResponse {
  exerciseIndex: number;
  exerciseType: string;
  contentIds: string[];
  targetCount: number;
  blockIndex?: number;
  completed?: boolean;
  correctCount?: number;
  totalCount?: number;
}

export interface AdvanceBlockResponse {
  blockIndex: number;
  blockCompleted: boolean;
  nextBlockIndex: number;
  sessionCompleted: boolean;
  completedExercises: number;
  totalExercises: number;
}

export interface BlockExercisesResponse {
  exercises: SessionExerciseResponse[];
}

// API Error
export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
}

// Profile Management
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountRequest {
  password: string;
}

export interface UserAccountResponse {
  userId: string;
  email: string;
  profileId: string;
  role: string;
  provider: string;
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
