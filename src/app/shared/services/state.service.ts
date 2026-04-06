import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Level, ModuleName, UnitReference } from '../models/learning.model';
import { ProfileStateService } from './profile-state.service';
import { ActivityStateService } from './activity-state.service';
import { ReviewStateService } from './review-state.service';

/**
 * Facade service — delegates to focused sub-services.
 * Keeps the public API unchanged so consumers don't need to update imports.
 */
@Injectable({ providedIn: 'root' })
export class StateService {
  private readonly profileState = inject(ProfileStateService);
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

  setModuleLevel(moduleName: ModuleName, level: Level, syncToBackend = true): void {
    this.profileState.setModuleLevel(moduleName, level, syncToBackend);
  }

  markTestCompleted(syncToBackend = true): void {
    this.profileState.markTestCompleted(syncToBackend);
  }

  setAllLevelsAndComplete(levels: Partial<Record<ModuleName, Level>>): Observable<void> {
    return this.profileState.setAllLevelsAndComplete(levels);
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
