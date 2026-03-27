import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { signal, computed } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Session } from './session';
import { SessionService } from '../../services/session.service';
import { SessionExercise, SessionBlock, StudySession } from '../../models/session.model';

function createMockSessionService(overrides: Partial<Record<string, unknown>> = {}) {
  const _completedExerciseIndices = signal<Set<number>>(new Set());
  const exercises = signal<SessionExercise[]>([]);
  const canAdvance = signal(true);
  const advancing = signal(false);
  const error = signal<string | null>(null);

  return {
    currentSession: signal<StudySession | null>(null),
    currentBlock: signal<SessionBlock | null>(null),
    currentBlockIndex: signal(0),
    sessionProgress: signal(0),
    isLastBlock: signal(false),
    sessionCompleted: signal(false),
    completedSession: signal<StudySession | null>(null),
    isGenerating: signal(false),
    sessionStartTime: signal(Date.now()),
    canAdvanceBlock: canAdvance,
    isAdvancing: advancing,
    advanceError: error,
    currentBlockExercises: exercises,
    currentBlockExerciseCount: computed(() => exercises().length),
    currentBlockCompletedCount: computed(() => {
      const completed = _completedExerciseIndices();
      return exercises().filter((e) => completed.has(e.exerciseIndex)).length;
    }),
    completedExerciseIndices: _completedExerciseIndices,
    advanceBlock: () => {},
    goBackBlock: () => {},
    goToBlock: () => {},
    isBlockCompleted: () => false,
    dismissCompletion: () => {},
    startSession: () => {},
    markExerciseCompleted: (idx: number) => {
      _completedExerciseIndices.update((s) => {
        const next = new Set(s);
        next.add(idx);
        return next;
      });
    },
    // Internal writable signals for test manipulation
    _exercises: exercises,
    _canAdvance: canAdvance,
    _advancing: advancing,
    _error: error,
    _completedExerciseIndices,
    ...overrides,
  };
}

describe('Session Component', () => {
  let mockService: ReturnType<typeof createMockSessionService>;

  beforeEach(() => {
    mockService = createMockSessionService();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: SessionService, useValue: mockService },
      ],
    });
  });

  function createComponent() {
    const fixture = TestBed.createComponent(Session);
    fixture.detectChanges();
    return fixture;
  }

  function setupSessionWithExercises() {
    const exercises: SessionExercise[] = [
      { exerciseIndex: 0, exerciseType: 'MULTIPLE_CHOICE', contentIds: ['c1'], targetCount: 5 },
      { exerciseIndex: 1, exerciseType: 'FILL_BLANK', contentIds: ['c2'], targetCount: 3 },
      { exerciseIndex: 2, exerciseType: 'SPEAK', contentIds: ['c3'], targetCount: 5 },
    ];
    mockService._exercises.set(exercises);

    const block: SessionBlock = {
      type: 'listening',
      duration: 7,
      label: 'Listening',
      exercises,
    };
    (mockService.currentBlock as ReturnType<typeof signal<SessionBlock | null>>).set(block);

    const session: StudySession = {
      id: 'session-1',
      number: 1,
      mode: 'full',
      isIntegrator: false,
      listening: null,
      pronunciation: null,
      secondary: null,
      secondaryModule: 'vocabulary',
      warmup: [],
      duration: 21,
      blocks: [block],
    };
    (mockService.currentSession as ReturnType<typeof signal<StudySession | null>>).set(session);
  }

  it('should disable Next button when exercises are incomplete', () => {
    setupSessionWithExercises();
    mockService._canAdvance.set(false);

    const fixture = createComponent();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.nav-btn.primary');

    expect(button.disabled).toBe(true);
  });

  it('should enable Next button when all exercises are completed', () => {
    setupSessionWithExercises();
    mockService._canAdvance.set(true);

    const fixture = createComponent();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.nav-btn.primary');

    expect(button.disabled).toBe(false);
  });

  it('should render progress dots for each exercise', () => {
    setupSessionWithExercises();

    const fixture = createComponent();
    const dots = fixture.nativeElement.querySelectorAll('.dot');

    expect(dots.length).toBe(3);
  });

  it('should mark dot as done when exercise is completed', () => {
    setupSessionWithExercises();
    mockService._completedExerciseIndices.set(new Set([0]));

    const fixture = createComponent();
    const dots = fixture.nativeElement.querySelectorAll('.dot');

    expect(dots[0].classList.contains('done')).toBe(true);
    expect(dots[1].classList.contains('done')).toBe(false);
  });

  it('should show loading state while advancing', () => {
    setupSessionWithExercises();
    mockService._advancing.set(true);
    mockService._canAdvance.set(false);

    const fixture = createComponent();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.nav-btn.primary');

    expect(button.classList.contains('loading')).toBe(true);
    expect(button.textContent?.trim()).toContain('Avanzando...');
  });

  it('should display error message on advance failure', () => {
    setupSessionWithExercises();
    mockService._error.set('Completa todos los ejercicios antes de avanzar.');

    const fixture = createComponent();
    const errorEl = fixture.nativeElement.querySelector('.advance-error');

    expect(errorEl).not.toBeNull();
    expect(errorEl.textContent).toContain('Completa todos los ejercicios');
  });

  it('should use result.exerciseIndex for markExerciseCompleted when available', () => {
    setupSessionWithExercises();
    const fixture = createComponent();
    const component = fixture.componentInstance as any;

    const result = {
      exerciseType: 'listening',
      exerciseIndex: 1,
      correctCount: 3,
      totalCount: 5,
      score: 60,
      durationMs: 5000,
      items: [],
    };
    component.onExerciseCompleted(result);

    expect(mockService._completedExerciseIndices().has(1)).toBe(true);
    expect(mockService._completedExerciseIndices().has(0)).toBe(false);
  });

  it('should fallback to first non-completed exercise of matching type when exerciseIndex is missing', () => {
    setupSessionWithExercises();
    mockService._completedExerciseIndices.set(new Set([0]));
    const fixture = createComponent();
    const component = fixture.componentInstance as any;

    const result = {
      exerciseType: 'MULTIPLE_CHOICE',
      correctCount: 3,
      totalCount: 5,
      score: 60,
      durationMs: 5000,
      items: [],
    };
    component.onExerciseCompleted(result);
    expect(mockService._completedExerciseIndices().size).toBe(1);
  });

  it('should not show progress indicator for blocks with 0 exercises', () => {
    const block: SessionBlock = { type: 'warmup', duration: 3, label: 'Warmup' };
    (mockService.currentBlock as ReturnType<typeof signal<SessionBlock | null>>).set(block);
    mockService._exercises.set([]);

    const session: StudySession = {
      id: 'session-1',
      number: 1,
      mode: 'full',
      isIntegrator: false,
      listening: null,
      pronunciation: null,
      secondary: null,
      secondaryModule: 'vocabulary',
      warmup: [{ type: 'intro', desc: 'Welcome', icon: '👋', count: 0 }],
      duration: 21,
      blocks: [block],
    };
    (mockService.currentSession as ReturnType<typeof signal<StudySession | null>>).set(session);

    const fixture = createComponent();
    const progressIndicator = fixture.nativeElement.querySelector('.exercise-progress-indicator');

    expect(progressIndicator).toBeNull();
  });
});
