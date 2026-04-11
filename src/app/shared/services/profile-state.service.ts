import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  CEFR_LEVELS,
  Level,
  ModuleName,
  MODULE_NAMES,
  UserProfile,
} from '../models/learning.model';
import { UserProfileResponse } from '../models/api.model';
import { ProfileApiService } from '../../core/services/profile-api.service';
import { AuthService } from '../../core/services/auth.service';

const STORAGE_PREFIX = 'english_modular_';

@Injectable({ providedIn: 'root' })
export class ProfileStateService {
  private readonly profileApi = inject(ProfileApiService);
  private readonly auth = inject(AuthService);

  private readonly _profile = signal<UserProfile>(this.loadProfile());
  private readonly _syncing = signal(false);

  readonly profile = this._profile.asReadonly();
  readonly syncing = this._syncing.asReadonly();

  readonly testCompleted = computed(() => this._profile().testCompleted);
  readonly totalSessions = computed(() => this._profile().sessionCount || 0);

  readonly sessionsThisWeek = computed(() => {
    const profile = this._profile();
    const weekStart = this.getCurrentWeekStart();
    if (profile.weekStart !== weekStart) return 0;
    return profile.sessionsThisWeek || 0;
  });

  readonly overallLevel = computed<Level>(() => {
    const profile = this._profile();
    let minIdx = CEFR_LEVELS.length - 1;
    for (const mod of MODULE_NAMES) {
      const lvl = profile.levels[mod] || 'a1';
      const idx = CEFR_LEVELS.indexOf(lvl);
      if (idx < minIdx) minIdx = idx;
    }
    return CEFR_LEVELS[minIdx];
  });

  loadFromBackend(): void {
    const profileId = this.auth.profileId();
    if (!profileId) return;

    this._syncing.set(true);
    this.profileApi.getProfile(profileId).subscribe({
      next: (res) => {
        this.applyBackendProfile(res);
        this._syncing.set(false);
      },
      error: () => {
        this._syncing.set(false);
      },
    });
  }

  getModuleLevel(moduleName: ModuleName): Level {
    return this._profile().levels[moduleName] || 'a1';
  }

  setModuleLevel(moduleName: ModuleName, level: Level, _syncToBackend = true): void {
    this._profile.update((p) => ({
      ...p,
      levels: { ...p.levels, [moduleName]: level },
    }));
    this.persistProfile();
  }

  markTestCompleted(_syncToBackend = true): void {
    this._profile.update((p) => ({ ...p, testCompleted: true }));
    this.persistProfile();
  }

  setAllLevelsAndComplete(levels: Partial<Record<ModuleName, Level>>): Observable<void> {
    this._profile.update((p) => ({
      ...p,
      testCompleted: true,
      levels: { ...p.levels, ...levels },
    }));
    this.persistProfile();
    return of(undefined);
  }

  markTestIncomplete(): void {
    this._profile.update((p) => ({ ...p, testCompleted: false, levels: {} }));
    this.persistProfile();
  }

  refreshFromBackend(): void {
    const profileId = this.auth.profileId();
    if (!profileId) return;

    this.profileApi.getProfile(profileId).subscribe({
      next: (res) => this.applyBackendProfile(res),
    });
  }

  applyLevelsFromBackend(levels: Partial<Record<ModuleName, Level>>): void {
    this._profile.update((p) => ({
      ...p,
      testCompleted: true,
      levels,
    }));
    this.persistProfile();
  }

  recordSession(): void {
    this._profile.update((p) => {
      const weekStart = this.getCurrentWeekStart();
      const isNewWeek = p.weekStart !== weekStart;
      return {
        ...p,
        sessionCount: (p.sessionCount || 0) + 1,
        weekStart,
        sessionsThisWeek: isNewWeek ? 1 : (p.sessionsThisWeek || 0) + 1,
      };
    });
    this.persistProfile();
  }

  updateEnglishLevel(level: string): void {
    const profileId = this.auth.profileId();
    if (!profileId) return;

    this.profileApi.updateEnglishLevel(profileId, level).subscribe();
  }

  updateProfile(updater: (p: UserProfile) => UserProfile): void {
    this._profile.update(updater);
    this.persistProfile();
  }

  getProfile(): UserProfile {
    return this._profile();
  }

  exportProgress(): string {
    return JSON.stringify(
      {
        version: 2,
        system: 'modular',
        exportedAt: new Date().toISOString(),
        profile: this._profile(),
      },
      null,
      2,
    );
  }

  resetProgress(): void {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        keys.push(key);
      }
    }
    keys.forEach((k) => localStorage.removeItem(k));

    this._profile.set(this.createDefaultProfile());
  }

  private applyBackendProfile(res: UserProfileResponse): void {
    this._profile.update((p) => ({
      ...p,
      testCompleted: res.testCompleted,
      levels: {
        listening: res.levelListening,
        vocabulary: res.levelVocabulary,
        grammar: res.levelGrammar,
        phrases: res.levelPhrases,
        pronunciation: res.levelPronunciation,
      },
      sessionCount: res.sessionCount,
      sessionsThisWeek: res.sessionsThisWeek,
    }));
    this.persistProfile();
  }

  getCurrentWeekStart(): string {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString().slice(0, 10);
  }

  private loadProfile(): UserProfile {
    return this.loadState('profile', this.createDefaultProfile());
  }

  private createDefaultProfile(): UserProfile {
    return {
      testCompleted: false,
      levels: {},
      moduleProgress: {},
      sessionCount: 0,
      sessionsThisWeek: 0,
      weekStart: null,
    };
  }

  persistProfile(): void {
    this.saveState('profile', this._profile());
  }

  private loadState<T>(key: string, fallback: T): T {
    try {
      const val = localStorage.getItem(STORAGE_PREFIX + key);
      return val ? (JSON.parse(val) as T) : fallback;
    } catch {
      return fallback;
    }
  }

  private saveState(key: string, val: unknown): void {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
  }
}
