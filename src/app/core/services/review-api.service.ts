import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';
import { SpacedRepetitionItemResponse } from '../../shared/models/api.model';

@Injectable({ providedIn: 'root' })
export class ReviewApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/profiles`;

  addUnitToReview(
    profileId: string,
    moduleName: string,
    level: string,
    unitIndex: number,
  ): Observable<SpacedRepetitionItemResponse> {
    return this.http.post<SpacedRepetitionItemResponse>(`${this.baseUrl}/${profileId}/reviews`, {
      itemType: 'module-unit',
      moduleName,
      level,
      unitIndex,
    });
  }

  addWordToReview(
    profileId: string,
    word: string,
    level: string,
  ): Observable<SpacedRepetitionItemResponse> {
    return this.http.post<SpacedRepetitionItemResponse>(`${this.baseUrl}/${profileId}/reviews`, {
      itemType: 'vocabulary-word',
      word,
      level,
    });
  }

  getDueReviews(profileId: string): Observable<SpacedRepetitionItemResponse[]> {
    return this.http.get<SpacedRepetitionItemResponse[]>(
      `${this.baseUrl}/${profileId}/reviews/due`,
    );
  }

  completeReview(
    profileId: string,
    itemId: string,
    quality: number,
  ): Observable<SpacedRepetitionItemResponse> {
    return this.http.put<SpacedRepetitionItemResponse>(
      `${this.baseUrl}/${profileId}/reviews/${itemId}/complete`,
      { quality },
    );
  }

  getReviewStats(
    profileId: string,
  ): Observable<{ totalItems: number; dueToday: number; completedToday: number }> {
    return this.http.get<{ totalItems: number; dueToday: number; completedToday: number }>(
      `${this.baseUrl}/${profileId}/reviews/stats`,
    );
  }
}
