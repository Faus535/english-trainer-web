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

  afterEach(() => httpMock.verify());

  function startBackendSession(): string {
    service.startSession('full');

    const req = httpMock.expectOne(`${baseUrl}/${profileId}/sessions/generate`);
    req.flush({
      id: 'session-1',
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

    return 'session-1';
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
});
