import { Injectable, inject, signal, computed } from '@angular/core';
import { ModuleName, MODULE_NAMES } from '../../../shared/models/learning.model';
import { StateService } from '../../../shared/services/state.service';
import { GamificationService } from './gamification.service';
import { SessionMode, StudySession, SessionBlock, WarmupItem } from '../models/session.model';
import { MODULES, getModuleLabel } from '../data/modules.data';

const SECONDARY_ROTATION: ModuleName[] = ['vocabulary', 'grammar', 'phrases'];
const STORAGE_KEY = 'english_modular_currentSession';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly state = inject(StateService);
  private readonly gamification = inject(GamificationService);

  private readonly _currentSession = signal<StudySession | null>(this.loadSession());
  private readonly _currentBlockIndex = signal(0);
  private readonly _completedBlocks = signal<Set<number>>(new Set());

  readonly currentSession = this._currentSession.asReadonly();
  readonly currentBlockIndex = this._currentBlockIndex.asReadonly();

  readonly currentBlock = computed<SessionBlock | null>(() => {
    const session = this._currentSession();
    const idx = this._currentBlockIndex();
    if (!session || idx >= session.blocks.length) return null;
    return session.blocks[idx];
  });

  readonly sessionProgress = computed(() => {
    const session = this._currentSession();
    if (!session) return 0;
    return Math.round((this._currentBlockIndex() / session.blocks.length) * 100);
  });

  readonly isLastBlock = computed(() => {
    const session = this._currentSession();
    if (!session) return false;
    return this._currentBlockIndex() >= session.blocks.length - 1;
  });

  startSession(mode: SessionMode): void {
    const session = this.generateSession(mode);
    this._currentSession.set(session);
    this._currentBlockIndex.set(0);
    this._completedBlocks.set(new Set());
    this.persistSession(session);
  }

  resumeSession(): boolean {
    const session = this.loadSession();
    if (session) {
      this._currentSession.set(session);
      return true;
    }
    return false;
  }

  advanceBlock(): void {
    const session = this._currentSession();
    if (!session) return;

    this._completedBlocks.update(s => {
      const next = new Set(s);
      next.add(this._currentBlockIndex());
      return next;
    });

    const nextIdx = this._currentBlockIndex() + 1;
    if (nextIdx >= session.blocks.length) {
      this.completeSession();
      return;
    }

    this._currentBlockIndex.set(nextIdx);
  }

  goBackBlock(): void {
    const idx = this._currentBlockIndex();
    if (idx > 0) {
      this._currentBlockIndex.set(idx - 1);
    }
  }

  goToBlock(index: number): void {
    const session = this._currentSession();
    if (!session || index < 0 || index >= session.blocks.length) return;
    if (index <= this._currentBlockIndex() || this._completedBlocks().has(index)) {
      this._currentBlockIndex.set(index);
    }
  }

  isBlockCompleted(index: number): boolean {
    return this._completedBlocks().has(index);
  }

  abandonSession(): void {
    this._currentSession.set(null);
    this._currentBlockIndex.set(0);
    this._completedBlocks.set(new Set());
    localStorage.removeItem(STORAGE_KEY);
  }

  private completeSession(): void {
    const session = this._currentSession();
    if (!session) return;

    this.state.recordSession({
      listening: session.listening,
      secondary: session.secondary,
      duration: session.duration,
    });

    if (session.listening) {
      this.state.completeUnit(session.listening.module, session.listening.unitIndex, 100);
    }
    if (session.pronunciation) {
      this.state.completeUnit(session.pronunciation.module, session.pronunciation.unitIndex, 100);
    }
    if (session.secondary) {
      this.state.completeUnit(session.secondary.module, session.secondary.unitIndex, 100);
    }

    this._currentSession.set(null);
    this._currentBlockIndex.set(0);
    this._completedBlocks.set(new Set());
    localStorage.removeItem(STORAGE_KEY);
  }

  private generateSession(mode: SessionMode): StudySession {
    const sessionNum = this.state.totalSessions() + 1;
    const weekSession = this.state.sessionsThisWeek();

    const listeningUnit = this.state.getNextUnit('listening');
    const pronunciationUnit = this.state.getNextUnit('pronunciation');

    const secondaryIdx = weekSession % SECONDARY_ROTATION.length;
    const secondaryModule = SECONDARY_ROTATION[secondaryIdx];
    const secondaryUnit = this.state.getNextUnit(secondaryModule);

    const warmup = this.buildWarmup();

    const session: StudySession = {
      id: `session-${Date.now()}`,
      number: sessionNum,
      mode,
      isIntegrator: sessionNum > 1 && sessionNum % 5 === 0,
      listening: listeningUnit,
      pronunciation: pronunciationUnit,
      secondary: secondaryUnit,
      secondaryModule,
      warmup,
      duration: mode === 'short' ? 14 : mode === 'extended' ? 31 : 21,
      blocks: this.buildBlocks(mode, listeningUnit, pronunciationUnit, secondaryUnit, secondaryModule),
    };

    return session;
  }

  private buildBlocks(
    mode: SessionMode,
    listening: ReturnType<StateService['getNextUnit']>,
    pronunciation: ReturnType<StateService['getNextUnit']>,
    secondary: ReturnType<StateService['getNextUnit']>,
    secondaryModule: ModuleName,
  ): SessionBlock[] {
    if (mode === 'short') {
      return [
        { type: 'warmup', duration: 2, label: 'Repaso rapido' },
        { type: 'listening', duration: 7, label: 'Listening', unit: listening },
        { type: 'pronunciation', duration: 3, label: 'Pronunciacion', unit: pronunciation },
        { type: 'practice', duration: 2, label: 'Practica' },
      ];
    }

    if (mode === 'extended') {
      return [
        { type: 'warmup', duration: 3, label: 'Repaso espaciado' },
        { type: 'listening', duration: 9, label: 'Listening', unit: listening },
        { type: 'pronunciation', duration: 5, label: 'Pronunciacion', unit: pronunciation },
        { type: 'secondary', duration: 5, label: getModuleLabel(secondaryModule), unit: secondary },
        { type: 'practice', duration: 4, label: 'Practica activa' },
        { type: 'bonus', duration: 5, label: 'Bonus: contenido real' },
      ];
    }

    return [
      { type: 'warmup', duration: 3, label: 'Repaso espaciado' },
      { type: 'listening', duration: 7, label: 'Listening', unit: listening },
      { type: 'pronunciation', duration: 4, label: 'Pronunciacion', unit: pronunciation },
      { type: 'secondary', duration: 4, label: getModuleLabel(secondaryModule), unit: secondary },
      { type: 'practice', duration: 3, label: 'Practica activa' },
    ];
  }

  private buildWarmup(): WarmupItem[] {
    const items: WarmupItem[] = [];

    const reviewUnits = this.state.getUnitsForReview(3);
    if (reviewUnits.length > 0) {
      for (const review of reviewUnits) {
        const mod = MODULES[review.module];
        items.push({
          type: 'review',
          module: review.module,
          unitId: review.unitId,
          desc: `Repaso: ${review.module} (intervalo ${review.interval}d)`,
          icon: mod?.icon || '\u{1F4DA}',
          count: 1,
        });
      }
    } else {
      items.push({ type: 'intro', desc: 'Bienvenida y preparacion', icon: '\u{1F44B}', count: 0 });
    }

    return items;
  }

  private persistSession(session: StudySession): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  }

  private loadSession(): StudySession | null {
    try {
      const val = localStorage.getItem(STORAGE_KEY);
      return val ? JSON.parse(val) as StudySession : null;
    } catch {
      return null;
    }
  }
}
