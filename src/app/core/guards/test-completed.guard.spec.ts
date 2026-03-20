import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { describe, expect, it, beforeEach } from 'vitest';
import { StateService } from '../../shared/services/state.service';
import { testCompletedGuard, testNotCompletedGuard } from './test-completed.guard';

describe('testCompletedGuard', () => {
  let state: StateService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    state = TestBed.inject(StateService);
  });

  it('should block if test not completed', () => {
    const result = TestBed.runInInjectionContext(() =>
      testCompletedGuard({} as any, {} as any)
    );
    expect(result).not.toBe(true);
  });

  it('should allow if test completed', () => {
    state.markTestCompleted();
    const result = TestBed.runInInjectionContext(() =>
      testCompletedGuard({} as any, {} as any)
    );
    expect(result).toBe(true);
  });
});

describe('testNotCompletedGuard', () => {
  let state: StateService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
    state = TestBed.inject(StateService);
  });

  it('should allow if test not completed', () => {
    const result = TestBed.runInInjectionContext(() =>
      testNotCompletedGuard({} as any, {} as any)
    );
    expect(result).toBe(true);
  });

  it('should block if test completed', () => {
    state.markTestCompleted();
    const result = TestBed.runInInjectionContext(() =>
      testNotCompletedGuard({} as any, {} as any)
    );
    expect(result).not.toBe(true);
  });
});
