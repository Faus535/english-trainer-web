import { Injectable, signal, computed } from '@angular/core';
import {
  CEFR_LEVELS,
  Level,
  ModuleName,
  ModuleProgress,
  MODULE_NAMES,
  UnitReference,
  UserProfile,
} from '../models/learning.model';
import { getModuleConfig } from '../../features/dashboard/data/modules.data';

const STORAGE_PREFIX = 'english_modular_';

@Injectable({ providedIn: 'root' })
export class StateService {
  private readonly _profile = signal<UserProfile>(this.loadProfile());
  private readonly _activityDates = signal<Record<string, boolean>>(this.loadState('activityDates', {}));
  private readonly _flashcardCount = signal<number>(this.loadState('flashcardCount', 0));

  readonly profile = this._profile.asReadonly();

  readonly totalSessions = computed(() => this._profile().sessionCount || 0);

  readonly sessionsThisWeek = computed(() => {
    const profile = this._profile();
    const weekStart = this.getCurrentWeekStart();
    if (profile.weekStart !== weekStart) return 0;
    return profile.sessionsThisWeek || 0;
  });

  readonly streak = computed(() => this.calculateStreak());
  readonly bestStreak = computed(() => this.calculateBestStreak());
  readonly flashcardCount = this._flashcardCount.asReadonly();

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

  getModuleLevel(moduleName: ModuleName): Level {
    return this._profile().levels[moduleName] || 'a1';
  }

  setModuleLevel(moduleName: ModuleName, level: Level): void {
    this._profile.update(p => ({
      ...p,
      levels: { ...p.levels, [moduleName]: level },
    }));
    this.persistProfile();
  }

  getModuleProgress(moduleName: ModuleName): ModuleProgress {
    const profile = this._profile();
    const level = this.getModuleLevel(moduleName);
    const key = `${moduleName}-${level}`;
    return profile.moduleProgress[key] || { currentUnit: 0, completedUnits: [], scores: {} };
  }

  saveModuleProgress(moduleName: ModuleName, progress: ModuleProgress): void {
    const level = this.getModuleLevel(moduleName);
    const key = `${moduleName}-${level}`;
    this._profile.update(p => ({
      ...p,
      moduleProgress: { ...p.moduleProgress, [key]: progress },
    }));
    this.persistProfile();
  }

  completeUnit(moduleName: ModuleName, unitIndex: number, score: number): ModuleProgress {
    const progress = { ...this.getModuleProgress(moduleName) };
    const completedUnits = [...progress.completedUnits];

    if (!completedUnits.includes(unitIndex)) {
      completedUnits.push(unitIndex);
    }

    const scores = { ...progress.scores, [unitIndex]: score };
    const currentUnit = Math.max(progress.currentUnit, unitIndex + 1);

    const updated: ModuleProgress = { ...progress, completedUnits, scores, currentUnit };
    this.saveModuleProgress(moduleName, updated);

    const level = this.getModuleLevel(moduleName);
    const config = getModuleConfig(moduleName, level);
    if (config?.units[unitIndex]) {
      this.addToReviewQueue(moduleName, config.units[unitIndex].id);
    }

    this.checkLevelUp(moduleName);
    return updated;
  }

  checkLevelUp(moduleName: ModuleName): boolean {
    const level = this.getModuleLevel(moduleName);
    const progress = this.getModuleProgress(moduleName);
    const config = getModuleConfig(moduleName, level);
    if (!config) return false;

    if (progress.completedUnits.length >= config.totalUnits) {
      const idx = CEFR_LEVELS.indexOf(level);
      if (idx < CEFR_LEVELS.length - 1) {
        this.setModuleLevel(moduleName, CEFR_LEVELS[idx + 1]);
        return true;
      }
    }
    return false;
  }

  getNextUnit(moduleName: ModuleName): UnitReference | null {
    const level = this.getModuleLevel(moduleName);
    const config = getModuleConfig(moduleName, level);
    if (!config) return null;

    const progress = this.getModuleProgress(moduleName);
    const unitIdx = progress.currentUnit;

    if (unitIdx >= config.units.length) {
      const idx = CEFR_LEVELS.indexOf(level);
      if (idx >= CEFR_LEVELS.length - 1) return null;
      const nextLevel = CEFR_LEVELS[idx + 1];
      const nextConfig = getModuleConfig(moduleName, nextLevel);
      if (!nextConfig?.units.length) return null;
      return { module: moduleName, level: nextLevel, unitIndex: 0, unit: nextConfig.units[0] };
    }

    return { module: moduleName, level, unitIndex: unitIdx, unit: config.units[unitIdx] };
  }

  getModuleCompletionPercent(moduleName: ModuleName): number {
    const level = this.getModuleLevel(moduleName);
    const levelIdx = CEFR_LEVELS.indexOf(level);
    const progress = this.getModuleProgress(moduleName);

    let totalCompleted = 0;
    let totalUnits = 0;

    for (let i = 0; i < CEFR_LEVELS.length; i++) {
      const cfg = getModuleConfig(moduleName, CEFR_LEVELS[i]);
      if (!cfg) continue;
      totalUnits += cfg.totalUnits;

      if (i < levelIdx) {
        totalCompleted += cfg.totalUnits;
      } else if (i === levelIdx) {
        totalCompleted += progress.completedUnits.length;
      }
    }

    return totalUnits > 0 ? Math.round((totalCompleted / totalUnits) * 100) : 0;
  }

  recordSession(sessionData: { listening?: UnitReference | null; secondary?: UnitReference | null; duration?: number }): void {
    this._profile.update(p => {
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
    this.recordActivity();
  }

  recordActivity(): void {
    const today = this.getToday();
    this._activityDates.update(dates => ({ ...dates, [today]: true }));
    this.saveState('activityDates', this._activityDates());
  }

  trackFlashcard(): void {
    this._flashcardCount.update(c => c + 1);
    this.saveState('flashcardCount', this._flashcardCount());
  }

  getUnitsForReview(maxCount: number = 3): Array<{ unitId: string; module: ModuleName; interval: number }> {
    const profile = this._profile();
    const today = this.getToday();
    const due: Array<{ unitId: string; module: ModuleName; interval: number; nextReview: string }> = [];

    for (const key of Object.keys(profile.moduleProgress)) {
      const progress = profile.moduleProgress[key];
      if (!progress.reviewQueue) continue;

      const moduleName = key.split('-')[0] as ModuleName;
      for (const review of progress.reviewQueue) {
        if (review.nextReview <= today) {
          due.push({ ...review, module: moduleName });
        }
      }
    }

    due.sort((a, b) => a.nextReview.localeCompare(b.nextReview));
    return due.slice(0, maxCount);
  }

  completeReview(moduleName: ModuleName, unitId: string): void {
    this._profile.update(p => {
      const newProgress = { ...p.moduleProgress };
      for (const key of Object.keys(newProgress)) {
        if (!key.startsWith(moduleName)) continue;
        const progress = newProgress[key];
        if (!progress.reviewQueue) continue;

        const idx = progress.reviewQueue.findIndex(r => r.unitId === unitId);
        if (idx === -1) continue;

        const queue = [...progress.reviewQueue];
        const review = { ...queue[idx] };
        review.reviews++;

        if (review.reviews >= 5) {
          queue.splice(idx, 1);
        } else {
          const intervals = [1, 3, 7, 14, 30];
          review.interval = intervals[Math.min(review.reviews, intervals.length - 1)];
          const nextDate = new Date();
          nextDate.setDate(nextDate.getDate() + review.interval);
          review.nextReview = nextDate.toISOString().slice(0, 10);
          queue[idx] = review;
        }

        newProgress[key] = { ...progress, reviewQueue: queue };
      }
      return { ...p, moduleProgress: newProgress };
    });
    this.persistProfile();
  }

  readonly testCompleted = computed(() => this._profile().testCompleted);

  markTestCompleted(): void {
    this._profile.update(p => ({ ...p, testCompleted: true }));
    this.persistProfile();
  }

  markTestIncomplete(): void {
    this._profile.update(p => ({ ...p, testCompleted: false, levels: {} }));
    this.persistProfile();
  }

  exportProgress(): string {
    const data = {
      version: 2,
      system: 'modular',
      exportedAt: new Date().toISOString(),
      profile: this._profile(),
      activityDates: this._activityDates(),
    };
    return JSON.stringify(data, null, 2);
  }

  resetProgress(): void {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        keys.push(key);
      }
    }
    keys.forEach(k => localStorage.removeItem(k));

    this._profile.set(this.createDefaultProfile());
    this._activityDates.set({});
    this._flashcardCount.set(0);
  }

  private addToReviewQueue(moduleName: ModuleName, unitId: string): void {
    const level = this.getModuleLevel(moduleName);
    const key = `${moduleName}-${level}`;

    this._profile.update(p => {
      const progress = p.moduleProgress[key] || { currentUnit: 0, completedUnits: [], scores: {} };
      const queue = [...(progress.reviewQueue || [])];

      if (queue.some(r => r.unitId === unitId)) return p;

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      queue.push({
        unitId,
        nextReview: tomorrow.toISOString().slice(0, 10),
        interval: 1,
        reviews: 0,
      });

      return {
        ...p,
        moduleProgress: {
          ...p.moduleProgress,
          [key]: { ...progress, reviewQueue: queue },
        },
      };
    });
    this.persistProfile();
  }

  private calculateStreak(): number {
    const history = this._activityDates();
    let streak = 0;
    const d = new Date();
    if (history[d.toISOString().slice(0, 10)]) {
      streak = 1;
      d.setDate(d.getDate() - 1);
    }
    while (history[d.toISOString().slice(0, 10)]) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  }

  private calculateBestStreak(): number {
    const history = this._activityDates();
    const dates = Object.keys(history).sort();
    if (!dates.length) return 0;
    let best = 1;
    let current = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diff = (curr.getTime() - prev.getTime()) / 86400000;
      if (diff === 1) {
        current++;
        if (current > best) best = current;
      } else if (diff > 1) {
        current = 1;
      }
    }
    return best;
  }

  private getCurrentWeekStart(): string {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    return monday.toISOString().slice(0, 10);
  }

  private getToday(): string {
    return new Date().toISOString().slice(0, 10);
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

  private persistProfile(): void {
    this.saveState('profile', this._profile());
  }

  private loadState<T>(key: string, fallback: T): T {
    try {
      const val = localStorage.getItem(STORAGE_PREFIX + key);
      return val ? JSON.parse(val) as T : fallback;
    } catch {
      return fallback;
    }
  }

  private saveState(key: string, val: unknown): void {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
  }
}
