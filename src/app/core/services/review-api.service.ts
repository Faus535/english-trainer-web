import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from './environment';
import { ReviewItem, ReviewStats, ReviewRating } from '../../features/review/models/review.model';

export interface ReviewItemResponse {
  id: string;
  sourceType: string;
  frontContent: string;
  backContent: string;
  nextReviewAt: string;
  intervalDays: number;
  consecutiveCorrect: number;
  contextSentence?: string;
  contextTranslation?: string;
  targetWord?: string;
  targetTranslation?: string;
}

export interface ReviewResultResponse {
  id: string;
  nextReviewAt: string;
  intervalDays: number;
  easeFactor: number;
  consecutiveCorrect: number;
}

const RATING_QUALITY: Record<ReviewRating, number> = {
  HARD: 2,
  GOOD: 4,
  EASY: 5,
};

@Injectable({ providedIn: 'root' })
export class ReviewApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/profiles`;

  getDueReviews(profileId: string): Observable<ReviewItem[]> {
    return this.http
      .get<ReviewItemResponse[]>(`${this.baseUrl}/${profileId}/review/queue`)
      .pipe(map((items) => items.map(this.mapResponseToItem)));
  }

  submitResult(
    profileId: string,
    itemId: string,
    rating: ReviewRating,
  ): Observable<ReviewResultResponse> {
    const quality = RATING_QUALITY[rating];
    return this.http.post<ReviewResultResponse>(
      `${this.baseUrl}/${profileId}/review/items/${itemId}/result`,
      { quality },
    );
  }

  getReviewStats(profileId: string): Observable<ReviewStats> {
    return this.http.get<ReviewStats>(`${this.baseUrl}/${profileId}/review/stats`);
  }

  private mapResponseToItem(r: ReviewItemResponse): ReviewItem {
    return {
      id: r.id,
      word: r.frontContent,
      translation: r.backContent,
      contextSentence: r.contextSentence,
      contextTranslation: r.contextTranslation,
      targetWord: r.targetWord,
      targetTranslation: r.targetTranslation,
      quality: r.consecutiveCorrect,
      interval: r.intervalDays,
      sourceType: r.sourceType as ReviewItem['sourceType'],
    };
  }
}
