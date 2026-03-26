import { ModuleName, UnitReference } from '../../../shared/models/learning.model';

export type SessionMode = 'short' | 'full' | 'extended' | 'review';

export type BlockType =
  | 'warmup'
  | 'listening'
  | 'pronunciation'
  | 'secondary'
  | 'practice'
  | 'bonus';

export interface SessionExercise {
  exerciseIndex: number;
  exerciseType: string;
  contentIds: string[];
  targetCount: number;
  completed?: boolean;
}

export interface SessionBlock {
  type: BlockType;
  duration: number;
  label: string;
  unit?: UnitReference | null;
  exercises?: SessionExercise[];
}

export interface WarmupItem {
  type: string;
  module?: ModuleName;
  unitId?: string;
  desc: string;
  icon: string;
  count: number;
}

export interface StudySession {
  id: string;
  number: number;
  mode: SessionMode;
  isIntegrator: boolean;
  listening: UnitReference | null;
  pronunciation: UnitReference | null;
  secondary: UnitReference | null;
  secondaryModule: ModuleName;
  warmup: WarmupItem[];
  duration: number;
  blocks: SessionBlock[];
}
