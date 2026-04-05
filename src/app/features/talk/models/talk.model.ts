import { Level } from '../../../shared/models/learning.model';

export interface ScenarioCategory {
  id: string;
  name: string;
  scenarios: Scenario[];
}

export interface Scenario {
  id: string;
  name: string;
  description: string;
  difficulty: Level;
  icon: string;
}

export interface TalkStats {
  totalConversations: number;
  totalMessages: number;
  averageScore: number;
  streakDays: number;
  favoriteScenario: string;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  feedback?: TutorFeedback;
  confidence?: number;
}

export interface TutorFeedback {
  grammarCorrections: GrammarCorrection[];
  vocabularySuggestions: VocabSuggestion[];
  pronunciationTips: PronunciationTip[];
  encouragement: string;
}

export interface GrammarCorrection {
  original: string;
  corrected: string;
  rule: string;
  category?: string;
}

export interface VocabSuggestion {
  word: string;
  definition: string;
  example: string;
}

export interface PronunciationTip {
  word: string;
  ipa: string;
  tip: string;
}

export type ConversationStatus = 'idle' | 'recording' | 'sending' | 'speaking' | 'error';

export interface ConversationDetailResponse {
  id: string;
  level: Level;
  topic?: string;
  messages: ConversationMessage[];
  startedAt: string;
  endedAt?: string;
}

export interface ConversationEvaluation {
  grammarAccuracy: number;
  vocabularyRange: number;
  fluency: number;
  taskCompletion: number;
  overallScore: number;
  levelDemonstrated: string;
  strengths: string[];
  areasToImprove: string[];
  goalResults?: GoalResult[];
}

export interface GoalResult {
  goalDescription: string;
  achieved: boolean;
  progress: number;
  evidence: string;
}

export interface EndConversationResponse {
  xpEarned: number;
  messagesCount: number;
  summary: string;
  evaluation?: ConversationEvaluation;
}
