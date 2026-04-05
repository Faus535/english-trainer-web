import { Injectable, inject } from '@angular/core';
import { CEFR_LEVELS, ModuleName, ModuleProgress, UnitReference } from '../models/learning.model';
import { getModuleConfig } from '../data/modules.data';
import { ProgressApiService } from '../../core/services/progress-api.service';
import { AuthService } from '../../core/services/auth.service';
import { ProfileStateService } from './profile-state.service';
import { ReviewStateService } from './review-state.service';

@Injectable({ providedIn: 'root' })
export class ProgressStateService {
  private readonly profileState = inject(ProfileStateService);
  private readonly progressApi = inject(ProgressApiService);
  private readonly auth = inject(AuthService);
  private readonly reviewState = inject(ReviewStateService);

  getModuleProgress(moduleName: ModuleName): ModuleProgress {
    const profile = this.profileState.getProfile();
    const level = this.profileState.getModuleLevel(moduleName);
    const key = `${moduleName}-${level}`;
    return profile.moduleProgress[key] || { currentUnit: 0, completedUnits: [], scores: {} };
  }

  saveModuleProgress(moduleName: ModuleName, progress: ModuleProgress): void {
    const level = this.profileState.getModuleLevel(moduleName);
    const key = `${moduleName}-${level}`;
    this.profileState.updateProfile((p) => ({
      ...p,
      moduleProgress: { ...p.moduleProgress, [key]: progress },
    }));
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

    const level = this.profileState.getModuleLevel(moduleName);
    const config = getModuleConfig(moduleName, level);
    if (config?.units[unitIndex]) {
      this.reviewState.addToReviewQueue(moduleName, config.units[unitIndex].id);
    }

    const profileId = this.auth.profileId();
    if (profileId) {
      this.progressApi.completeUnit(profileId, moduleName, level, unitIndex).subscribe();
    }

    this.checkLevelUp(moduleName);
    return updated;
  }

  checkLevelUp(moduleName: ModuleName): boolean {
    const level = this.profileState.getModuleLevel(moduleName);
    const progress = this.getModuleProgress(moduleName);
    const config = getModuleConfig(moduleName, level);
    if (!config) return false;

    if (progress.completedUnits.length >= config.totalUnits) {
      const idx = CEFR_LEVELS.indexOf(level);
      if (idx < CEFR_LEVELS.length - 1) {
        this.profileState.setModuleLevel(moduleName, CEFR_LEVELS[idx + 1]);
        return true;
      }
    }
    return false;
  }

  getNextUnit(moduleName: ModuleName): UnitReference | null {
    const level = this.profileState.getModuleLevel(moduleName);
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
    const level = this.profileState.getModuleLevel(moduleName);
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
}
