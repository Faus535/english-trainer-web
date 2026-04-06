import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { StateService } from './state.service';

describe('StateService', () => {
  let service: StateService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
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
    service.setModuleLevel('listening', 'b1', false);
    expect(service.getModuleLevel('listening')).toBe('b1');
  });

  it('should record session and increment count', () => {
    service.recordSession({ duration: 21 });
    expect(service.totalSessions()).toBe(1);
  });

  it('should track streaks via recordActivity', () => {
    expect(service.streak()).toBe(0);
    service.recordActivity();
    expect(service.streak()).toBe(1);
  });

  it('should calculate overall level as minimum module level', () => {
    service.setModuleLevel('listening', 'b1', false);
    service.setModuleLevel('vocabulary', 'a2', false);
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
