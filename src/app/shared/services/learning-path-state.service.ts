import { Injectable, inject, signal, computed } from '@angular/core';
import { EMPTY, finalize, catchError } from 'rxjs';
import { LearningPathApiService } from '../../core/services/learning-path-api.service';
import { LearningStatus, LearningPath } from '../models/learning-path.model';

@Injectable({ providedIn: 'root' })
export class LearningPathStateService {
  private readonly api = inject(LearningPathApiService);

  private readonly _learningStatus = signal<LearningStatus | null>(null);
  private readonly _learningPath = signal<LearningPath | null>(null);
  private readonly _isLoading = signal(true);

  readonly learningStatus = this._learningStatus.asReadonly();
  readonly learningPath = this._learningPath.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly hasPath = computed(() => this._learningStatus() !== null);

  loadStatus(profileId: string): void {
    this._isLoading.set(true);
    this.api
      .getLearningStatus(profileId)
      .pipe(
        catchError((err) => {
          if (err.status === 404) {
            this._learningStatus.set(null);
            return EMPTY;
          }
          throw err;
        }),
        finalize(() => this._isLoading.set(false)),
      )
      .subscribe((status) => this._learningStatus.set(status));
  }

  loadPath(profileId: string): void {
    this._isLoading.set(true);
    this.api
      .getLearningPath(profileId)
      .pipe(
        catchError((err) => {
          if (err.status === 404) {
            this._learningPath.set(null);
            return EMPTY;
          }
          throw err;
        }),
        finalize(() => this._isLoading.set(false)),
      )
      .subscribe((path) => this._learningPath.set(path));
  }

  generatePath(profileId: string): void {
    this._isLoading.set(true);
    this.api
      .generateLearningPath(profileId)
      .pipe(finalize(() => this._isLoading.set(false)))
      .subscribe(() => {
        this.loadStatus(profileId);
        this.loadPath(profileId);
      });
  }

  refreshStatus(profileId: string): void {
    this.loadStatus(profileId);
  }
}
