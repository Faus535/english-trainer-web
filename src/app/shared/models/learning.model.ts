export type Level = 'a1' | 'a2' | 'b1' | 'b2' | 'c1' | 'c2';

export const CEFR_LEVELS: Level[] = ['a1', 'a2', 'b1', 'b2', 'c1', 'c2'];

export type ModuleName = 'listening' | 'vocabulary' | 'grammar' | 'phrases' | 'pronunciation';

export const MODULE_NAMES: ModuleName[] = [
  'listening',
  'vocabulary',
  'grammar',
  'phrases',
  'pronunciation',
];

export interface ModuleUnit {
  id: string;
  title: string;
  desc: string;
  type: string;
}

export interface ModuleLevelConfig {
  totalUnits: number;
  units: ModuleUnit[];
}

export interface ModuleConfig {
  name: string;
  icon: string;
  weight: number;
  color: string;
  levels: Record<Level, ModuleLevelConfig>;
}

export interface ModuleProgress {
  currentUnit: number;
  completedUnits: number[];
  scores: Record<number, number>;
  reviewQueue?: ReviewItem[];
}

export interface ReviewItem {
  unitId: string;
  nextReview: string;
  interval: number;
  reviews: number;
}

export interface UserProfile {
  testCompleted: boolean;
  levels: Partial<Record<ModuleName, Level>>;
  moduleProgress: Record<string, ModuleProgress>;
  sessionCount: number;
  sessionsThisWeek: number;
  weekStart: string | null;
}

export interface UnitReference {
  module: ModuleName;
  level: Level;
  unitIndex: number;
  unit: ModuleUnit;
}
