import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { GamificationService } from './gamification.service';
import { StateService } from '../../../shared/services/state.service';

describe('GamificationService', () => {
  let service: GamificationService;
  let state: StateService;

  beforeEach(() => {
    localStorage.clear();
    state = TestBed.inject(StateService);
    service = TestBed.inject(GamificationService);
  });

  it('should start with 0 XP', () => {
    expect(service.xp()).toBe(0);
  });

  it('should be Beginner level at 0 XP', () => {
    expect(service.level().name).toBe('Beginner');
    expect(service.level().index).toBe(0);
  });

  it('should gain XP from sessions', () => {
    state.recordSession({ duration: 21 });
    expect(service.xp()).toBe(50);
  });

  it('should have 0 unlocked achievements initially', () => {
    expect(service.unlockedAchievements().length).toBe(0);
  });

  it('should unlock first_session achievement after 1 session', () => {
    state.recordSession({ duration: 21 });
    const unlocked = service.unlockedAchievements();
    expect(unlocked.some(a => a.id === 'first_session')).toBe(true);
  });

  it('should return a sound of the day', () => {
    const sound = service.getSoundOfTheDay();
    expect(sound.sound).toBeTruthy();
    expect(sound.words.length).toBeGreaterThan(0);
  });

  it('should return a phrase', () => {
    const phrase = service.currentPhrase();
    expect(phrase.en).toBeTruthy();
    expect(phrase.es).toBeTruthy();
  });

  it('should toggle phrase reveal', () => {
    expect(service.phraseRevealed()).toBe(false);
    service.revealPhrase();
    expect(service.phraseRevealed()).toBe(true);
  });

  it('should get random phrase', () => {
    service.getRandomPhrase();
    expect(service.phraseRevealed()).toBe(false);
  });
});
