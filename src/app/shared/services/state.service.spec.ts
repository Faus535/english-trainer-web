import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { StateService } from './state.service';

describe('StateService', () => {
  let service: StateService;

  beforeEach(() => {
    localStorage.clear();
    service = TestBed.inject(StateService);
  });

  it('should start with default profile', () => {
    expect(service.totalSessions()).toBe(0);
    expect(service.sessionsThisWeek()).toBe(0);
    expect(service.overallLevel()).toBe('a1');
  });

  it('should get module level as a1 by default', () => {
    expect(service.getModuleLevel('listening')).toBe('a1');
  });

  it('should set and get module level', () => {
    service.setModuleLevel('listening', 'b1');
    expect(service.getModuleLevel('listening')).toBe('b1');
  });

  it('should get empty module progress by default', () => {
    const progress = service.getModuleProgress('listening');
    expect(progress.currentUnit).toBe(0);
    expect(progress.completedUnits).toEqual([]);
  });

  it('should complete a unit', () => {
    const progress = service.completeUnit('listening', 0, 95);
    expect(progress.completedUnits).toContain(0);
    expect(progress.scores[0]).toBe(95);
    expect(progress.currentUnit).toBe(1);
  });

  it('should not duplicate completed units', () => {
    service.completeUnit('listening', 0, 90);
    service.completeUnit('listening', 0, 95);
    const progress = service.getModuleProgress('listening');
    expect(progress.completedUnits.filter(u => u === 0).length).toBe(1);
  });

  it('should calculate module completion percent', () => {
    expect(service.getModuleCompletionPercent('listening')).toBe(0);
    service.completeUnit('listening', 0, 100);
    expect(service.getModuleCompletionPercent('listening')).toBeGreaterThan(0);
  });

  it('should get next unit', () => {
    const next = service.getNextUnit('listening');
    expect(next).not.toBeNull();
    expect(next!.unitIndex).toBe(0);
    expect(next!.level).toBe('a1');
  });

  it('should record session and increment count', () => {
    service.recordSession({ duration: 21 });
    expect(service.totalSessions()).toBe(1);
  });

  it('should track streaks', () => {
    expect(service.streak()).toBe(0);
    service.recordActivity();
    expect(service.streak()).toBe(1);
  });

  it('should calculate overall level as minimum module level', () => {
    service.setModuleLevel('listening', 'b1');
    service.setModuleLevel('vocabulary', 'a2');
    expect(service.overallLevel()).toBe('a1'); // other modules still a1
  });

  it('should export progress as JSON', () => {
    service.recordSession({ duration: 21 });
    const exported = service.exportProgress();
    const data = JSON.parse(exported);
    expect(data.version).toBe(2);
    expect(data.profile.sessionCount).toBe(1);
  });

  it('should reset progress', () => {
    service.recordSession({ duration: 21 });
    service.resetProgress();
    expect(service.totalSessions()).toBe(0);
  });
});
