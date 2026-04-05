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

// Re-export tutor types used by Talk
export type {
  ConversationMessage,
  TutorFeedback,
  GrammarCorrection,
  VocabSuggestion,
  ConversationStatus,
  ConversationDetailResponse,
  ConversationEvaluation,
  GoalResult,
  EndConversationResponse,
} from '../../tutor/models/tutor.model';
