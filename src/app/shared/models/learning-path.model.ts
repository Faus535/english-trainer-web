export interface LearningStatus {
  currentUnit: UnitSummary;
  nextUnit: { name: string; unitIndex: number } | null;
  overallProgress: { unitsCompleted: number; totalUnits: number; percentComplete: number };
  todaysPlan: TodaysPlan;
  reviewsDue: number;
  streak: number;
  weakAreas: WeakArea[];
  recentMilestones: Milestone[];
}

export interface UnitSummary {
  name: string;
  unitIndex: number;
  masteryScore: number;
  status: UnitStatus;
  contentProgress: { practiced: number; total: number };
}

export type UnitStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'NEEDS_REVIEW' | 'MASTERED';

export interface TodaysPlan {
  newItemsCount: number;
  reviewItemsCount: number;
  estimatedMinutes: number;
  suggestedSessionMode: 'short' | 'full' | 'extended';
}

export interface WeakArea {
  module: string;
  unitName: string;
  masteryScore: number;
}

export interface Milestone {
  type: string;
  description: string;
  date: string;
}

export interface LearningPath {
  currentLevel: string;
  currentUnitIndex: number;
  units: LearningPathUnit[];
}

export interface LearningPathUnit {
  unitIndex: number;
  name: string;
  status: UnitStatus;
  masteryScore: number;
}
