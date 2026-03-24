import { TestBed } from '@angular/core/testing';
import { IdleService } from './idle.service';

describe('IdleService', () => {
  let service: IdleService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdleService);
  });

  afterEach(() => {
    service.stop();
    vi.useRealTimers();
  });

  it('should start with idle false and no warning', () => {
    expect(service.isIdle()).toBe(false);
    expect(service.showWarning()).toBe(false);
    expect(service.remainingSeconds()).toBe(0);
  });

  it('should not show warning before start', () => {
    vi.advanceTimersByTime(30 * 60 * 1000);
    expect(service.showWarning()).toBe(false);
    expect(service.isIdle()).toBe(false);
  });

  it('should show warning after 29 minutes of inactivity', () => {
    service.start();
    vi.advanceTimersByTime(29 * 60 * 1000);
    expect(service.showWarning()).toBe(true);
    expect(service.isIdle()).toBe(false);
  });

  it('should set idle after 30 minutes of inactivity', () => {
    service.start();
    vi.advanceTimersByTime(30 * 60 * 1000);
    expect(service.isIdle()).toBe(true);
    expect(service.showWarning()).toBe(false);
  });

  it('should reset timers and clear warning on reset', () => {
    service.start();
    vi.advanceTimersByTime(29 * 60 * 1000);
    expect(service.showWarning()).toBe(true);

    service.reset();
    expect(service.showWarning()).toBe(false);
    expect(service.isIdle()).toBe(false);

    // After another 29 min should warn again (not idle yet)
    vi.advanceTimersByTime(29 * 60 * 1000);
    expect(service.isIdle()).toBe(false);
    expect(service.showWarning()).toBe(true);
  });

  it('should clear all state on stop', () => {
    service.start();
    vi.advanceTimersByTime(29 * 60 * 1000);
    expect(service.showWarning()).toBe(true);

    service.stop();
    expect(service.showWarning()).toBe(false);
    expect(service.isIdle()).toBe(false);
    expect(service.remainingSeconds()).toBe(0);
  });

  it('should have countdown in remainingDisplay when warning', () => {
    service.start();
    vi.advanceTimersByTime(29 * 60 * 1000);
    expect(service.showWarning()).toBe(true);

    const remaining = service.remainingSeconds();
    expect(remaining).toBeGreaterThan(0);
    expect(remaining).toBeLessThanOrEqual(60);
  });
});
