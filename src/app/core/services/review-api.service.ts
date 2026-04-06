import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';

export interface ReviewItemResponse {
  id: string;
  sourceType: string;
  frontContent: string;
  backContent: string;
  nextReviewAt: string;
  intervalDays: number;
  consecutiveCorrect: number;
}

export interface ReviewResultResponse {
  id: string;
  nextReviewAt: string;
  intervalDays: number;
  easeFactor: number;
  consecutiveCorrect: number;
}

@Injectable({ providedIn: 'root' })
export class ReviewApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/profiles`;

  getDueReviews(profileId: string): Observable<ReviewItemResponse[]> {
    return this.http.get<ReviewItemResponse[]>(`${this.baseUrl}/${profileId}/review/queue`);
  }

  completeReview(
    profileId: string,
    itemId: string,
    quality: number,
  ): Observable<ReviewResultResponse> {
    return this.http.post<ReviewResultResponse>(
      `${this.baseUrl}/${profileId}/review/items/${itemId}/result`,
      { quality },
    );
  }

  getReviewStats(
    profileId: string,
  ): Observable<{ totalItems: number; dueToday: number; completedToday: number }> {
    return this.http.get<{ totalItems: number; dueToday: number; completedToday: number }>(
      `${this.baseUrl}/${profileId}/review/stats`,
    );
  }
}
