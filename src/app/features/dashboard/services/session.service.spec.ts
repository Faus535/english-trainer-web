import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    localStorage.clear();
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

  it('should advance blocks', () => {
    service.startSession('full');
    expect(service.currentBlockIndex()).toBe(0);
    service.advanceBlock();
    expect(service.currentBlockIndex()).toBe(1);
    expect(service.currentBlock()!.type).toBe('listening');
  });

  it('should go back blocks', () => {
    service.startSession('full');
    service.advanceBlock();
    service.goBackBlock();
    expect(service.currentBlockIndex()).toBe(0);
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
    service.advanceBlock();
    expect(service.sessionProgress()).toBeGreaterThan(0);
  });
});
