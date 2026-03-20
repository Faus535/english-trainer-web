import { Injectable, inject, computed, signal, effect } from '@angular/core';
import { CEFR_LEVELS, MODULE_NAMES } from '../../../shared/models/learning.model';
import { StateService } from '../../../shared/services/state.service';
import { AuthService } from '../../../core/services/auth.service';
import { GamificationApiService } from '../../../core/services/gamification-api.service';
import { GamificationStatus, PhraseRoulette, SoundOfTheDay } from '../models/gamification.model';
import { Achievement } from '../models/gamification.model';
import { ACHIEVEMENTS } from '../data/achievements.data';
import {
  GAMIFICATION_LEVELS,
  PHRASE_ROULETTE_DATA,
  SOUNDS_OF_THE_DAY,
  XP_PER_FLASHCARD,
  XP_PER_LEVEL_UP,
  XP_PER_SESSION,
  XP_STREAK_BONUS,
} from '../data/gamification.data';

@Injectable({ providedIn: 'root' })
export class GamificationService {
  private readonly state = inject(StateService);
  private readonly auth = inject(AuthService);
  private readonly gamificationApi = inject(GamificationApiService);
  private readonly _rouletteIndex = signal(-1);
  private readonly _rouletteRevealed = signal(false);
  private _lastXp = 0;

  readonly xp = computed(() => {
    const sessions = this.state.totalSessions();
    const flashcards = this.state.flashcardCount();
    const streak = this.state.streak();
    const streakBonus = streak > 3 ? (streak - 3) * XP_STREAK_BONUS : 0;

    let levelUps = 0;
    for (const mod of MODULE_NAMES) {
      levelUps += CEFR_LEVELS.indexOf(this.state.getModuleLevel(mod));
    }

    return (sessions * XP_PER_SESSION) + (flashcards * XP_PER_FLASHCARD) + (levelUps * XP_PER_LEVEL_UP) + streakBonus;
  });

  readonly level = computed<GamificationStatus>(() => {
    const xp = this.xp();
    let current = GAMIFICATION_LEVELS[0];
    for (const l of GAMIFICATION_LEVELS) {
      if (xp >= l.minXP) current = l;
    }
    const idx = GAMIFICATION_LEVELS.indexOf(current);
    const nextLevel = GAMIFICATION_LEVELS[idx + 1] ?? null;
    const progress = nextLevel
      ? Math.min((xp - current.minXP) / (nextLevel.minXP - current.minXP), 1)
      : 1;
    return { name: current.name, index: idx, xp, progress, nextLevel };
  });

  readonly unlockedAchievements = computed<Achievement[]>(() => {
    const sessions = this.state.totalSessions();
    const sessionsWeek = this.state.sessionsThisWeek();
    const streak = this.state.streak();
    const bestStreak = this.state.bestStreak();
    const flashcards = this.state.flashcardCount();

    return ACHIEVEMENTS.filter(a => {
      switch (a.id) {
        case 'first_session': return sessions >= 1;
        case 'week_complete': return sessionsWeek >= 3;
        case 'sessions_10': return sessions >= 10;
        case 'sessions_25': return sessions >= 25;
        case 'sessions_50': return sessions >= 50;
        case 'sessions_100': return sessions >= 100;
        case 'streak_3': return streak >= 3 || bestStreak >= 3;
        case 'streak_7': return streak >= 7 || bestStreak >= 7;
        case 'streak_14': return streak >= 14 || bestStreak >= 14;
        case 'flash_50': return flashcards >= 50;
        case 'flash_200': return flashcards >= 200;
        case 'listening_a2': return CEFR_LEVELS.indexOf(this.state.getModuleLevel('listening')) >= 1;
        case 'listening_b1': return CEFR_LEVELS.indexOf(this.state.getModuleLevel('listening')) >= 2;
        case 'listening_b2': return CEFR_LEVELS.indexOf(this.state.getModuleLevel('listening')) >= 3;
        case 'listening_c1': return CEFR_LEVELS.indexOf(this.state.getModuleLevel('listening')) >= 4;
        case 'pron_a2': return CEFR_LEVELS.indexOf(this.state.getModuleLevel('pronunciation')) >= 1;
        case 'pron_b1': return CEFR_LEVELS.indexOf(this.state.getModuleLevel('pronunciation')) >= 2;
        case 'pron_b2': return CEFR_LEVELS.indexOf(this.state.getModuleLevel('pronunciation')) >= 3;
        case 'all_b1': return MODULE_NAMES.every(m => CEFR_LEVELS.indexOf(this.state.getModuleLevel(m)) >= 2);
        case 'all_b2': return MODULE_NAMES.every(m => CEFR_LEVELS.indexOf(this.state.getModuleLevel(m)) >= 3);
        case 'graduate': return MODULE_NAMES.every(m => CEFR_LEVELS.indexOf(this.state.getModuleLevel(m)) >= 4);
        case 'review_7': return sessions >= 7;
        default: return false;
      }
    });
  });

  readonly allAchievements = ACHIEVEMENTS;

  /**
   * Syncs XP and checks achievements on the backend.
   * Call after actions that change XP (session complete, flashcard, level-up).
   */
  syncToBackend(): void {
    const profileId = this.auth.profileId();
    if (!profileId) return;

    const currentXp = this.xp();
    const diff = currentXp - this._lastXp;
    if (diff > 0) {
      this._lastXp = currentXp;
      this.gamificationApi.grantXp(profileId, diff).subscribe();
    }

    this.gamificationApi.checkAchievements(profileId).subscribe();
  }

  getSoundOfTheDay(): SoundOfTheDay {
    const today = new Date().toISOString().slice(0, 10);
    const seed = today.split('-').join('');
    const idx = parseInt(seed, 10) % SOUNDS_OF_THE_DAY.length;
    return SOUNDS_OF_THE_DAY[idx];
  }

  readonly currentPhrase = computed<PhraseRoulette>(() => {
    const idx = this._rouletteIndex();
    if (idx < 0) return PHRASE_ROULETTE_DATA[0];
    return PHRASE_ROULETTE_DATA[idx];
  });

  readonly phraseRevealed = this._rouletteRevealed.asReadonly();

  getRandomPhrase(): void {
    this._rouletteIndex.set(Math.floor(Math.random() * PHRASE_ROULETTE_DATA.length));
    this._rouletteRevealed.set(false);
  }

  revealPhrase(): void {
    this._rouletteRevealed.set(true);
  }
}
