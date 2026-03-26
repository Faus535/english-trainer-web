import { Injectable, inject, signal, computed } from '@angular/core';
import { catchError, of } from 'rxjs';
import { ModuleName, CEFR_LEVELS, UnitReference } from '../../../shared/models/learning.model';
import { StateService } from '../../../shared/services/state.service';
import { GamificationService } from './gamification.service';
import { AuthService } from '../../../core/services/auth.service';
import { SessionApiService } from '../../../core/services/session-api.service';
import {
  SessionMode,
  StudySession,
  SessionBlock,
  SessionExercise,
  WarmupItem,
} from '../models/session.model';
import { MODULES, getModuleLabel, getModuleConfig } from '../data/modules.data';
import { SessionResponse, SessionBlockResponse } from '../../../shared/models/api.model';

const SECONDARY_ROTATION: ModuleName[] = ['vocabulary', 'grammar', 'phrases'];
const STORAGE_KEY = 'english_modular_currentSession';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly state = inject(StateService);
  private readonly gamification = inject(GamificationService);
  private readonly auth = inject(AuthService);
  private readonly sessionApi = inject(SessionApiService);

  private readonly _currentSession = signal<StudySession | null>(this.loadSession());
  private readonly _currentBlockIndex = signal(0);
  private readonly _completedBlocks = signal<Set<number>>(new Set());
  private readonly _sessionCompleted = signal(false);
  private readonly _completedSession = signal<StudySession | null>(null);
  private readonly _sessionStartTime = signal<number>(Date.now());
  private readonly _isGenerating = signal(false);
  private readonly _completedExerciseIndices = signal<Set<number>>(new Set());
  private readonly _isAdvancing = signal(false);
  private readonly _advanceError = signal<string | null>(null);

  readonly currentSession = this._currentSession.asReadonly();
  readonly currentBlockIndex = this._currentBlockIndex.asReadonly();
  readonly sessionCompleted = this._sessionCompleted.asReadonly();
  readonly completedSession = this._completedSession.asReadonly();
  readonly sessionStartTime = this._sessionStartTime.asReadonly();
  readonly isGenerating = this._isGenerating.asReadonly();
  readonly completedExerciseIndices = this._completedExerciseIndices.asReadonly();
  readonly isAdvancing = this._isAdvancing.asReadonly();
  readonly advanceError = this._advanceError.asReadonly();

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

  readonly currentBlockExercises = computed(() => {
    const block = this.currentBlock();
    return block?.exercises ?? [];
  });

  readonly currentBlockExerciseCount = computed(() => {
    return this.currentBlockExercises().length;
  });

  readonly currentBlockCompletedCount = computed(() => {
    const exercises = this.currentBlockExercises();
    const completed = this._completedExerciseIndices();
    return exercises.filter((e) => completed.has(e.exerciseIndex)).length;
  });

  readonly canAdvanceBlock = computed(() => {
    const exercises = this.currentBlockExercises();
    if (exercises.length === 0) return true;
    const completed = this._completedExerciseIndices();
    return exercises.every((e) => completed.has(e.exerciseIndex));
  });

  startSession(mode: SessionMode): void {
    const profileId = this.auth.profileId();

    if (profileId && mode !== 'review') {
      this._isGenerating.set(true);
      this.sessionApi.generateSession(profileId, { mode }).subscribe({
        next: (response) => {
          const session = this.mapBackendSession(response, mode);
          this.initSession(session);
          this.hydrateCompletedExercises(response);
          this._isGenerating.set(false);
        },
        error: () => {
          const session = this.generateSession(mode);
          this.initSession(session);
          this._isGenerating.set(false);
        },
      });
    } else {
      const session = this.generateSession(mode);
      this.initSession(session);
    }
  }

  private hydrateCompletedExercises(response: SessionResponse): void {
    const completedIndices = new Set<number>();
    for (const block of response.blocks) {
      for (const ex of block.exercises ?? []) {
        if (ex.completed) {
          completedIndices.add(ex.exerciseIndex);
        }
      }
    }
    if (completedIndices.size > 0) {
      this._completedExerciseIndices.set(completedIndices);
    }
  }

  private initSession(session: StudySession): void {
    this._currentSession.set(session);
    this._currentBlockIndex.set(0);
    this._completedBlocks.set(new Set());
    this._sessionCompleted.set(false);
    this._completedSession.set(null);
    this._sessionStartTime.set(Date.now());
    this._completedExerciseIndices.set(new Set());
    this._isAdvancing.set(false);
    this._advanceError.set(null);
    this.persistSession(session);
  }

  private mapBackendSession(response: SessionResponse, mode: SessionMode): StudySession {
    const sessionNum = this.state.totalSessions() + 1;
    const secondaryModule = this.resolveSecondaryModule();
    const warmup = this.buildWarmup();

    const blocks: SessionBlock[] = response.blocks.map((b) => this.mapBlock(b, secondaryModule));

    return {
      id: response.id,
      number: sessionNum,
      mode,
      isIntegrator: sessionNum > 1 && sessionNum % 5 === 0,
      listening: this.findUnitForType(blocks, 'listening'),
      pronunciation: this.findUnitForType(blocks, 'pronunciation'),
      secondary: this.findUnitForType(blocks, 'secondary'),
      secondaryModule,
      warmup,
      duration: response.durationMinutes,
      blocks,
    };
  }

  private mapBlock(b: SessionBlockResponse, secondaryModule: ModuleName): SessionBlock {
    const blockType = b.blockType.toLowerCase() as SessionBlock['type'];
    const exercises: SessionExercise[] = (b.exercises ?? []).map((e) => ({
      exerciseIndex: e.exerciseIndex,
      exerciseType: e.exerciseType,
      contentIds: e.contentIds,
      targetCount: e.targetCount,
      completed: e.completed ?? false,
    }));

    const unit = this.resolveBlockUnit(blockType, b.moduleName, secondaryModule);

    return {
      type: blockType,
      duration: b.durationMinutes,
      label: this.blockLabel(blockType, secondaryModule),
      unit,
      exercises: exercises.length > 0 ? exercises : undefined,
    };
  }

  private resolveBlockUnit(
    blockType: string,
    moduleName: string,
    secondaryModule: ModuleName,
  ): UnitReference | null {
    switch (blockType) {
      case 'listening':
        return this.state.getNextUnit('listening');
      case 'pronunciation':
        return this.state.getNextUnit('pronunciation');
      case 'secondary':
        return this.state.getNextUnit(secondaryModule);
      default:
        return null;
    }
  }

  private findUnitForType(blocks: SessionBlock[], type: string): UnitReference | null {
    return blocks.find((b) => b.type === type)?.unit ?? null;
  }

  private blockLabel(type: string, secondaryModule: ModuleName): string {
    switch (type) {
      case 'warmup':
        return 'Repaso espaciado';
      case 'listening':
        return 'Listening';
      case 'pronunciation':
        return 'Pronunciacion';
      case 'secondary':
        return getModuleLabel(secondaryModule);
      case 'practice':
        return 'Practica activa';
      case 'bonus':
        return 'Bonus: contenido real';
      default:
        return type;
    }
  }

  private resolveSecondaryModule(): ModuleName {
    const weekSession = this.state.sessionsThisWeek();
    return SECONDARY_ROTATION[weekSession % SECONDARY_ROTATION.length];
  }

  resumeSession(): boolean {
    const session = this.loadSession();
    if (session) {
      this._currentSession.set(session);
      return true;
    }
    return false;
  }

  markExerciseCompleted(exerciseIndex: number): void {
    this._completedExerciseIndices.update((s) => {
      const next = new Set(s);
      next.add(exerciseIndex);
      return next;
    });
  }

  advanceBlock(): void {
    if (!this.canAdvanceBlock() || this._isAdvancing()) return;

    const session = this._currentSession();
    const profileId = this.auth.profileId();
    if (!session || !profileId) return;

    this._isAdvancing.set(true);
    this._advanceError.set(null);

    this.sessionApi.advanceBlock(profileId, session.id, this._currentBlockIndex()).subscribe({
      next: (response) => {
        this._isAdvancing.set(false);

        if (response.sessionCompleted) {
          this.completeSession();
          return;
        }

        this._completedBlocks.update((s) => {
          const next = new Set(s);
          next.add(this._currentBlockIndex());
          return next;
        });
        this._currentBlockIndex.set(response.nextBlockIndex);
        this._completedExerciseIndices.set(new Set());
      },
      error: (err) => {
        this._isAdvancing.set(false);
        const code = err?.error?.code;
        if (code === 'block_not_completed') {
          this._advanceError.set('Completa todos los ejercicios antes de avanzar.');
        } else {
          this._advanceError.set('Error al avanzar. Intenta de nuevo.');
        }
      },
    });
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

    const profileId = this.auth.profileId();
    if (profileId) {
      this.sessionApi
        .completeSession(profileId, session.id)
        .pipe(
          catchError((err) => {
            if (err?.error?.code === 'incomplete_session') {
              this._advanceError.set('Hay bloques sin completar.');
            }
            return of(null);
          }),
        )
        .subscribe();
    }

    this.gamification.syncToBackend();

    this._completedSession.set(session);
    this._sessionCompleted.set(true);
    this._currentSession.set(null);
    this._currentBlockIndex.set(0);
    this._completedBlocks.set(new Set());
    localStorage.removeItem(STORAGE_KEY);
  }

  dismissCompletion(): void {
    this._sessionCompleted.set(false);
    this._completedSession.set(null);
  }

  private generateSession(mode: SessionMode): StudySession {
    const sessionNum = this.state.totalSessions() + 1;
    const weekSession = this.state.sessionsThisWeek();

    if (mode === 'review') {
      return this.generateReviewSession(sessionNum, weekSession);
    }

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
      blocks: this.buildBlocks(
        mode,
        listeningUnit,
        pronunciationUnit,
        secondaryUnit,
        secondaryModule,
      ),
    };

    return session;
  }

  private generateReviewSession(sessionNum: number, weekSession: number): StudySession {
    const lowerListening = this.getReviewUnit('listening');
    const secondaryIdx = weekSession % SECONDARY_ROTATION.length;
    const secondaryModule = SECONDARY_ROTATION[secondaryIdx];
    const lowerSecondary = this.getReviewUnit(secondaryModule);

    const blocks: SessionBlock[] = [
      { type: 'warmup', duration: 2, label: 'Preparacion' },
      { type: 'listening', duration: 6, label: 'Listening (repaso)', unit: lowerListening },
      {
        type: 'secondary',
        duration: 5,
        label: `${getModuleLabel(secondaryModule)} (repaso)`,
        unit: lowerSecondary,
      },
      { type: 'practice', duration: 2, label: 'Practica' },
    ];

    return {
      id: `session-${Date.now()}`,
      number: sessionNum,
      mode: 'review',
      isIntegrator: false,
      listening: lowerListening,
      pronunciation: null,
      secondary: lowerSecondary,
      secondaryModule,
      warmup: [
        { type: 'intro', desc: 'Repaso de niveles anteriores', icon: '\u{1F504}', count: 0 },
      ],
      duration: 15,
      blocks,
    };
  }

  private getReviewUnit(moduleName: ModuleName): UnitReference | null {
    const currentLevel = this.state.getModuleLevel(moduleName);
    const idx = CEFR_LEVELS.indexOf(currentLevel);
    if (idx <= 0) return null;

    const lowerLevels = CEFR_LEVELS.slice(0, idx);
    const reviewLevel = lowerLevels[Math.floor(Math.random() * lowerLevels.length)];
    const config = getModuleConfig(moduleName, reviewLevel);
    if (!config || config.units.length === 0) return null;

    const unitIdx = Math.floor(Math.random() * config.units.length);
    return {
      module: moduleName,
      level: reviewLevel,
      unitIndex: unitIdx,
      unit: config.units[unitIdx],
    };
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
      return val ? (JSON.parse(val) as StudySession) : null;
    } catch {
      return null;
    }
  }
}
