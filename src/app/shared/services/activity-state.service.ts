import { Injectable, inject, signal, computed } from '@angular/core';
import { ActivityApiService } from '../../core/services/activity-api.service';
import { AuthService } from '../../core/services/auth.service';

const STORAGE_PREFIX = 'english_modular_';

@Injectable({ providedIn: 'root' })
export class ActivityStateService {
  private readonly activityApi = inject(ActivityApiService);
  private readonly auth = inject(AuthService);

  private readonly _activityDates = signal<Record<string, boolean>>(
    this.loadState('activityDates', {}),
  );
  private readonly _flashcardCount = signal<number>(this.loadState('flashcardCount', 0));

  readonly flashcardCount = this._flashcardCount.asReadonly();
  readonly streak = computed(() => this.calculateStreak());
  readonly bestStreak = computed(() => this.calculateBestStreak());

  loadFromBackend(): void {
    const profileId = this.auth.profileId();
    if (!profileId) return;

    this.activityApi.getActivityDates(profileId).subscribe({
      next: (dates) => {
        const map: Record<string, boolean> = {};
        for (const d of dates) {
          map[d] = true;
        }
        this._activityDates.set(map);
        this.saveState('activityDates', map);
      },
    });
  }

  recordActivity(): void {
    const today = this.getToday();
    this._activityDates.update((dates) => ({ ...dates, [today]: true }));
    this.saveState('activityDates', this._activityDates());

    const profileId = this.auth.profileId();
    if (profileId) {
      this.activityApi.recordActivity(profileId).subscribe();
    }
  }

  trackFlashcard(): void {
    this._flashcardCount.update((c) => c + 1);
    this.saveState('flashcardCount', this._flashcardCount());
  }

  getActivityDates(): Record<string, boolean> {
    return this._activityDates();
  }

  reset(): void {
    this._activityDates.set({});
    this._flashcardCount.set(0);
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

  private getToday(): string {
    return new Date().toISOString().slice(0, 10);
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
