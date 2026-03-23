import { Injectable, inject } from '@angular/core';
import { Level, ModuleName, ModuleProgress, UnitReference } from '../models/learning.model';
import { ProfileStateService } from './profile-state.service';
import { ProgressStateService } from './progress-state.service';
import { ActivityStateService } from './activity-state.service';
import { ReviewStateService } from './review-state.service';

/**
 * Facade service — delegates to focused sub-services.
 * Keeps the public API unchanged so consumers don't need to update imports.
 */
@Injectable({ providedIn: 'root' })
export class StateService {
  private readonly profileState = inject(ProfileStateService);
  private readonly progressState = inject(ProgressStateService);
  private readonly activityState = inject(ActivityStateService);
  private readonly reviewState = inject(ReviewStateService);

  // Profile delegates
  readonly profile = this.profileState.profile;
  readonly syncing = this.profileState.syncing;
  readonly testCompleted = this.profileState.testCompleted;
  readonly totalSessions = this.profileState.totalSessions;
  readonly sessionsThisWeek = this.profileState.sessionsThisWeek;
  readonly overallLevel = this.profileState.overallLevel;

  // Activity delegates
  readonly streak = this.activityState.streak;
  readonly bestStreak = this.activityState.bestStreak;
  readonly flashcardCount = this.activityState.flashcardCount;

  loadFromBackend(): void {
    this.profileState.loadFromBackend();
    this.activityState.loadFromBackend();
  }

  // Profile methods
  getModuleLevel(moduleName: ModuleName): Level {
    return this.profileState.getModuleLevel(moduleName);
  }

  setModuleLevel(moduleName: ModuleName, level: Level): void {
    this.profileState.setModuleLevel(moduleName, level);
  }

  markTestCompleted(): void {
    this.profileState.markTestCompleted();
  }

  markTestIncomplete(): void {
    this.profileState.markTestIncomplete();
  }

  refreshFromBackend(): void {
    this.profileState.refreshFromBackend();
  }

  applyLevelsFromBackend(levels: Partial<Record<ModuleName, Level>>): void {
    this.profileState.applyLevelsFromBackend(levels);
  }

  // Progress methods
  getModuleProgress(moduleName: ModuleName): ModuleProgress {
    return this.progressState.getModuleProgress(moduleName);
  }

  saveModuleProgress(moduleName: ModuleName, progress: ModuleProgress): void {
    this.progressState.saveModuleProgress(moduleName, progress);
  }

  completeUnit(moduleName: ModuleName, unitIndex: number, score: number): ModuleProgress {
    return this.progressState.completeUnit(moduleName, unitIndex, score);
  }

  checkLevelUp(moduleName: ModuleName): boolean {
    return this.progressState.checkLevelUp(moduleName);
  }

  getNextUnit(moduleName: ModuleName): UnitReference | null {
    return this.progressState.getNextUnit(moduleName);
  }

  getModuleCompletionPercent(moduleName: ModuleName): number {
    return this.progressState.getModuleCompletionPercent(moduleName);
  }

  // Session recording
  recordSession(sessionData: {
    listening?: UnitReference | null;
    secondary?: UnitReference | null;
    duration?: number;
  }): void {
    this.profileState.recordSession(sessionData.duration);
    this.activityState.recordActivity();
  }

  // Activity methods
  recordActivity(): void {
    this.activityState.recordActivity();
  }

  trackFlashcard(): void {
    this.activityState.trackFlashcard();
  }

  // Review methods
  getUnitsForReview(maxCount = 3): { unitId: string; module: ModuleName; interval: number }[] {
    return this.reviewState.getUnitsForReview(maxCount);
  }

  completeReview(moduleName: ModuleName, unitId: string): void {
    this.reviewState.completeReview(moduleName, unitId);
  }

  // Export/Reset
  exportProgress(): string {
    const activityDates = this.activityState.getActivityDates();
    const baseExport = this.profileState.exportProgress();
    const data = JSON.parse(baseExport);
    data.activityDates = activityDates;
    return JSON.stringify(data, null, 2);
  }

  resetProgress(): void {
    this.profileState.resetProgress();
    this.activityState.reset();
  }
}
