import { Injectable, inject } from '@angular/core';
import { ModuleName } from '../models/learning.model';
import { ReviewApiService } from '../../core/services/review-api.service';
import { AuthService } from '../../core/services/auth.service';
import { ProfileStateService } from './profile-state.service';

@Injectable({ providedIn: 'root' })
export class ReviewStateService {
  private readonly profileState = inject(ProfileStateService);
  private readonly reviewApi = inject(ReviewApiService);
  private readonly auth = inject(AuthService);

  getUnitsForReview(maxCount = 3): { unitId: string; module: ModuleName; interval: number }[] {
    const profile = this.profileState.getProfile();
    const today = new Date().toISOString().slice(0, 10);
    const due: { unitId: string; module: ModuleName; interval: number; nextReview: string }[] = [];

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
    this.profileState.updateProfile((p) => {
      const newProgress = { ...p.moduleProgress };
      for (const key of Object.keys(newProgress)) {
        if (!key.startsWith(moduleName)) continue;
        const progress = newProgress[key];
        if (!progress.reviewQueue) continue;

        const idx = progress.reviewQueue.findIndex((r) => r.unitId === unitId);
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

    const profileId = this.auth.profileId();
    if (profileId) {
      this.reviewApi.submitResult(profileId, unitId, 'HARD').subscribe();
    }
  }

  addToReviewQueue(moduleName: ModuleName, unitId: string): void {
    const level = this.profileState.getModuleLevel(moduleName);
    const key = `${moduleName}-${level}`;

    this.profileState.updateProfile((p) => {
      const progress = p.moduleProgress[key] || { currentUnit: 0, completedUnits: [], scores: {} };
      const queue = [...(progress.reviewQueue || [])];

      if (queue.some((r) => r.unitId === unitId)) return p;

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
  }
}
