export type TalkMode = 'FULL' | 'QUICK';

export interface QuickChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD';
  category: string;
}

export interface TalkStartRequest {
  scenarioId?: string;
  mode: TalkMode;
  challengeId?: string;
  level?: string;
}

export type TalkSummaryResponse =
  | {
      mode: 'FULL';
      summary: string;
      evaluation: TalkEvaluation;
      turnCount: number;
      errorCount: number;
      grammarNotes?: GrammarNote[];
      newVocabulary?: VocabItem[];
    }
  | { mode: 'QUICK'; taskCompleted: boolean; top3Corrections: string[]; encouragementNote: string };

export interface TalkScenarioResponse {
  id: string;
  title: string;
  description: string;
  category: string;
  cefrLevel: string;
  difficultyOrder: number;
}

export interface ScenarioCategory {
  id: string;
  name: string;
  scenarios: Scenario[];
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  cefrLevel: string;
  difficultyOrder: number;
  category: string;
}

export interface TalkCorrection {
  grammarFixes: string[];
  vocabularySuggestions: string[];
  pronunciationTips: string[];
  encouragement: string | null;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  correction?: TalkCorrection | null;
  confidence?: number;
}

export type ConversationStatus = 'idle' | 'recording' | 'sending' | 'speaking' | 'error';

export interface ConversationDetailResponse {
  id: string;
  userId: string;
  scenarioId: string;
  level: string;
  status: string;
  startedAt: string;
  endedAt: string | null;
  messages: ConversationMessage[];
}

export interface SendMessageResponse {
  content: string;
  correction: TalkCorrection;
  suggestEnd: boolean;
  ended?: boolean;
}

export interface TalkEvaluation {
  grammarAccuracy: number;
  vocabularyRange: number;
  fluency: number;
  taskCompletion: number;
  overallScore: number;
  levelDemonstrated: string;
  strengths: string[];
  areasToImprove: string[];
}

export interface GrammarNote {
  originalText: string;
  correction: string;
  explanation: string;
}

export interface VocabItem {
  word: string;
  definition: string;
  usedInContext: string;
}

export interface TalkEndResponse {
  summary: string;
  evaluation: TalkEvaluation;
  turnCount: number;
  errorCount: number;
  grammarNotes?: GrammarNote[];
  newVocabulary?: VocabItem[];
}

export interface TalkStats {
  totalConversations: number;
  completedConversations: number;
  totalMessages: number;
  averageScore: number;
}
