import { TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { SessionService } from './session.service';
import { environment } from '../../../core/services/environment';

@Component({ template: '', changeDetection: ChangeDetectionStrategy.OnPush })
class DummyComponent {}

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    service = TestBed.inject(SessionService);
  });

  it('should start with no session', () => {
    expect(service.currentSession()).toBeNull();
  });

  it('should generate a full session', () => {
    service.startSession('full');
    const session = service.currentSession();
    expect(session).not.toBeNull();
    expect(session!.mode).toBe('full');
    expect(session!.duration).toBe(21);
    expect(session!.blocks.length).toBe(5);
  });

  it('should generate a short session', () => {
    service.startSession('short');
    const session = service.currentSession();
    expect(session!.mode).toBe('short');
    expect(session!.duration).toBe(14);
    expect(session!.blocks.length).toBe(4);
  });

  it('should generate an extended session', () => {
    service.startSession('extended');
    const session = service.currentSession();
    expect(session!.mode).toBe('extended');
    expect(session!.duration).toBe(31);
    expect(session!.blocks.length).toBe(6);
  });

  it('should have warmup as first block', () => {
    service.startSession('full');
    expect(service.currentBlock()!.type).toBe('warmup');
  });

  it('should not go back from first block', () => {
    service.startSession('full');
    service.goBackBlock();
    expect(service.currentBlockIndex()).toBe(0);
  });

  it('should abandon session', () => {
    service.startSession('full');
    service.abandonSession();
    expect(service.currentSession()).toBeNull();
  });

  it('should calculate progress', () => {
    service.startSession('full');
    expect(service.sessionProgress()).toBe(0);
  });
});

describe('SessionService - Exercise completion tracking', () => {
  let service: SessionService;
  let httpMock: HttpTestingController;

  const profileId = 'test-profile';
  const baseUrl = `${environment.apiUrl}/profiles`;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();

    // Set auth tokens BEFORE creating TestBed so AuthService reads them on init
    sessionStorage.setItem('et_profile_id', profileId);
    sessionStorage.setItem('et_token', 'test-token');

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: 'auth/login', component: DummyComponent }]),
      ],
    });

    service = TestBed.inject(SessionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Discard outstanding requests from side effects (gamification sync, state recording, etc.)
    httpMock.match(() => true);
  });

  function startBackendSession(): string {
    service.startSession('full');

    const req = httpMock.expectOne(`${baseUrl}/${profileId}/sessions/generate`);
    req.flush({
      id: '550e8400-e29b-41d4-a716-446655440000',
      mode: 'full',
      blocks: [
        { blockType: 'warmup', moduleName: 'listening', durationMinutes: 3 },
        {
          blockType: 'listening',
          moduleName: 'listening',
          durationMinutes: 7,
          exercises: [
            {
              exerciseIndex: 0,
              exerciseType: 'MULTIPLE_CHOICE',
              contentIds: ['c1'],
              targetCount: 5,
              completed: false,
            },
            {
              exerciseIndex: 1,
              exerciseType: 'FILL_BLANK',
              contentIds: ['c2'],
              targetCount: 3,
              completed: false,
            },
          ],
        },
        {
          blockType: 'pronunciation',
          moduleName: 'pronunciation',
          durationMinutes: 4,
          exercises: [
            {
              exerciseIndex: 2,
              exerciseType: 'SPEAK',
              contentIds: ['c3'],
              targetCount: 5,
              completed: false,
            },
          ],
        },
      ],
      completed: false,
      startedAt: new Date().toISOString(),
      completedAt: null,
      durationMinutes: 21,
    });

    return '550e8400-e29b-41d4-a716-446655440000';
  }

  it('canAdvanceBlock should be true for blocks with 0 exercises', () => {
    startBackendSession();
    // Block 0 is warmup with no exercises
    expect(service.canAdvanceBlock()).toBe(true);
  });

  it('canAdvanceBlock should be false when exercises are incomplete', () => {
    const sessionId = startBackendSession();

    // Advance from warmup to block 1 (listening with 2 exercises)
    service.advanceBlock();
    httpMock.expectOne(`${baseUrl}/${profileId}/sessions/${sessionId}/blocks/0/advance`).flush({
      blockIndex: 0,
      blockCompleted: true,
      nextBlockIndex: 1,
      sessionCompleted: false,
      completedExercises: 0,
      totalExercises: 0,
    });

    expect(service.canAdvanceBlock()).toBe(false);
  });

  it('markExerciseCompleted should update completedExerciseIndices', () => {
    startBackendSession();
    service.markExerciseCompleted(0);
    expect(service.completedExerciseIndices().has(0)).toBe(true);
  });

  it('canAdvanceBlock should be true when all exercises are completed', () => {
    const sessionId = startBackendSession();

    // Advance to block 1
    service.advanceBlock();
    httpMock.expectOne(`${baseUrl}/${profileId}/sessions/${sessionId}/blocks/0/advance`).flush({
      blockIndex: 0,
      blockCompleted: true,
      nextBlockIndex: 1,
      sessionCompleted: false,
      completedExercises: 0,
      totalExercises: 0,
    });

    // Mark both exercises in block 1 as completed
    service.markExerciseCompleted(0);
    service.markExerciseCompleted(1);
    expect(service.canAdvanceBlock()).toBe(true);
  });

  it('advanceBlock should be blocked when isAdvancing is true', () => {
    const sessionId = startBackendSession();

    service.advanceBlock();
    expect(service.isAdvancing()).toBe(true);

    // Second call should be a no-op
    service.advanceBlock();

    const reqs = httpMock.match(`${baseUrl}/${profileId}/sessions/${sessionId}/blocks/0/advance`);
    expect(reqs.length).toBe(1);
    reqs[0].flush({
      blockIndex: 0,
      blockCompleted: true,
      nextBlockIndex: 1,
      sessionCompleted: false,
      completedExercises: 0,
      totalExercises: 0,
    });
  });

  it('advanceBlock should reset completedExerciseIndices on success', () => {
    const sessionId = startBackendSession();

    service.markExerciseCompleted(0);
    expect(service.completedExerciseIndices().has(0)).toBe(true);

    service.advanceBlock();
    httpMock.expectOne(`${baseUrl}/${profileId}/sessions/${sessionId}/blocks/0/advance`).flush({
      blockIndex: 0,
      blockCompleted: true,
      nextBlockIndex: 1,
      sessionCompleted: false,
      completedExercises: 0,
      totalExercises: 0,
    });

    expect(service.completedExerciseIndices().size).toBe(0);
  });

  it('advanceBlock should set advanceError on 422', () => {
    const sessionId = startBackendSession();

    service.advanceBlock();
    httpMock
      .expectOne(`${baseUrl}/${profileId}/sessions/${sessionId}/blocks/0/advance`)
      .flush(
        { code: 'block_not_completed', message: 'Not completed' },
        { status: 422, statusText: 'Unprocessable Entity' },
      );

    expect(service.advanceError()).toBe('Completa todos los ejercicios antes de avanzar.');
    expect(service.isAdvancing()).toBe(false);
  });

  describe('Full advancement flow', () => {
    it('should complete: exercise done -> mark completed -> canAdvance true -> advanceBlock -> next block', () => {
      const sessionId = startBackendSession();

      // Advance from warmup (no exercises, canAdvance = true)
      expect(service.canAdvanceBlock()).toBe(true);
      service.advanceBlock();
      httpMock.expectOne(`${baseUrl}/${profileId}/sessions/${sessionId}/blocks/0/advance`).flush({
        blockIndex: 0,
        blockCompleted: true,
        nextBlockIndex: 1,
        sessionCompleted: false,
        completedExercises: 0,
        totalExercises: 0,
      });

      // Now on block 1 (listening, 2 exercises)
      expect(service.currentBlockIndex()).toBe(1);
      expect(service.canAdvanceBlock()).toBe(false);

      // Mark exercises complete
      service.markExerciseCompleted(0);
      expect(service.canAdvanceBlock()).toBe(false);
      service.markExerciseCompleted(1);
      expect(service.canAdvanceBlock()).toBe(true);

      // Advance to block 2
      service.advanceBlock();
      httpMock.expectOne(`${baseUrl}/${profileId}/sessions/${sessionId}/blocks/1/advance`).flush({
        blockIndex: 1,
        blockCompleted: true,
        nextBlockIndex: 2,
        sessionCompleted: false,
        completedExercises: 2,
        totalExercises: 2,
      });

      expect(service.currentBlockIndex()).toBe(2);
      expect(service.completedExerciseIndices().size).toBe(0);
    });

    it('should handle session resumption with partially completed blocks', () => {
      service.startSession('full');

      const req = httpMock.expectOne(`${baseUrl}/${profileId}/sessions/generate`);
      req.flush({
        id: '660e8400-e29b-41d4-a716-446655440000',
        mode: 'full',
        blocks: [
          { blockType: 'warmup', moduleName: 'listening', durationMinutes: 3 },
          {
            blockType: 'listening',
            moduleName: 'listening',
            durationMinutes: 7,
            exercises: [
              {
                exerciseIndex: 0,
                exerciseType: 'MULTIPLE_CHOICE',
                contentIds: ['c1'],
                targetCount: 5,
                completed: true,
              },
              {
                exerciseIndex: 1,
                exerciseType: 'FILL_BLANK',
                contentIds: ['c2'],
                targetCount: 3,
                completed: false,
              },
            ],
          },
        ],
        completed: false,
        startedAt: new Date().toISOString(),
        completedAt: null,
        durationMinutes: 21,
      });

      // Exercise 0 should be hydrated as completed
      expect(service.completedExerciseIndices().has(0)).toBe(true);
      expect(service.completedExerciseIndices().has(1)).toBe(false);
    });

    it('should complete session when backend says sessionCompleted', () => {
      const sessionId = startBackendSession();

      service.advanceBlock();
      httpMock.expectOne(`${baseUrl}/${profileId}/sessions/${sessionId}/blocks/0/advance`).flush({
        blockIndex: 0,
        blockCompleted: true,
        nextBlockIndex: 1,
        sessionCompleted: true,
        completedExercises: 0,
        totalExercises: 0,
      });

      // completeSession calls sessionApi.completeSession
      const completeReq = httpMock.expectOne(
        `${baseUrl}/${profileId}/sessions/${sessionId}/complete`,
      );
      completeReq.flush({});

      expect(service.sessionCompleted()).toBe(true);
    });

    it('should prevent double-tap during advance', () => {
      const sessionId = startBackendSession();

      service.advanceBlock();
      expect(service.isAdvancing()).toBe(true);

      service.advanceBlock(); // no-op

      const reqs = httpMock.match(`${baseUrl}/${profileId}/sessions/${sessionId}/blocks/0/advance`);
      expect(reqs.length).toBe(1);
      reqs[0].flush({
        blockIndex: 0,
        blockCompleted: true,
        nextBlockIndex: 1,
        sessionCompleted: false,
        completedExercises: 0,
        totalExercises: 0,
      });

      expect(service.isAdvancing()).toBe(false);
    });
  });

  describe('Local session guards', () => {
    function startLocalSession(): void {
      // Start a session without auth so it generates a local fallback (session-{timestamp})
      service.startSession('full');

      // The generate endpoint is called, simulate a failure so it falls back to local
      httpMock
        .expectOne(`${baseUrl}/${profileId}/sessions/generate`)
        .error(new ProgressEvent('error'));
    }

    it('advanceBlock with local session ID should not make HTTP calls', () => {
      startLocalSession();
      const session = service.currentSession();
      expect(session).not.toBeNull();
      expect(session!.id).toMatch(/^session-/);

      service.advanceBlock();

      httpMock.expectNone(() => true);
    });

    it('advanceBlock with local session ID should increment block index locally', () => {
      startLocalSession();
      expect(service.currentBlockIndex()).toBe(0);

      service.advanceBlock();

      expect(service.currentBlockIndex()).toBe(1);
      expect(service.isAdvancing()).toBe(false);
      expect(service.advanceError()).toBeNull();
    });

    it('advanceBlock with local session should clear completedExerciseIndices', () => {
      startLocalSession();
      service.markExerciseCompleted(0);
      expect(service.completedExerciseIndices().size).toBe(1);

      service.advanceBlock();

      expect(service.completedExerciseIndices().size).toBe(0);
    });

    it('completeSession with local session ID should not call backend', () => {
      startLocalSession();
      const session = service.currentSession()!;
      const totalBlocks = session.blocks.length;

      // Advance through all blocks to trigger completeSession
      for (let i = 0; i < totalBlocks; i++) {
        service.advanceBlock();
      }

      // No advance or complete HTTP calls should be made for this session
      const sessionRequests = httpMock
        .match(() => true)
        .filter((r) => r.request.url.includes('/sessions/') && r.request.url.includes(session.id));
      expect(sessionRequests.length).toBe(0);
    });

    it('completeSession with local session ID should still clear session state', () => {
      startLocalSession();
      const totalBlocks = service.currentSession()!.blocks.length;

      for (let i = 0; i < totalBlocks; i++) {
        service.advanceBlock();
      }

      expect(service.sessionCompleted()).toBe(true);
      expect(service.currentSession()).toBeNull();
    });
  });
});
