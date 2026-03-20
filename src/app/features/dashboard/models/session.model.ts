import { ModuleName, UnitReference } from '../../../shared/models/learning.model';

export type SessionMode = 'short' | 'full' | 'extended';

export type BlockType = 'warmup' | 'listening' | 'pronunciation' | 'secondary' | 'practice' | 'bonus';

export interface SessionBlock {
  type: BlockType;
  duration: number;
  label: string;
  unit?: UnitReference | null;
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
