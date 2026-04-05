import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../core/services/environment';
import {
  ImmerseContentRequest,
  ImmerseContentResponse,
  ImmerseExercise,
  ImmerseExerciseResult,
  VocabEntry,
  ImmerseContent,
  GenerateContentRequest,
} from '../models/immerse.model';

@Injectable({ providedIn: 'root' })
export class ImmerseApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/immerse`;

  submitContent(req: ImmerseContentRequest): Observable<ImmerseContentResponse> {
    return this.http.post<ImmerseContentResponse>(`${this.baseUrl}/content`, req);
  }

  generateContent(req: GenerateContentRequest): Observable<ImmerseContentResponse> {
    return this.http.post<ImmerseContentResponse>(`${this.baseUrl}/generate`, req);
  }

  getContent(contentId: string): Observable<ImmerseContentResponse> {
    return this.http.get<ImmerseContentResponse>(`${this.baseUrl}/content/${contentId}`);
  }

  getExercises(contentId: string): Observable<ImmerseExercise[]> {
    return this.http.get<ImmerseExercise[]>(`${this.baseUrl}/content/${contentId}/exercises`);
  }

  submitExerciseAnswer(
    contentId: string,
    exerciseId: string,
    answer: string,
  ): Observable<ImmerseExerciseResult> {
    return this.http.post<ImmerseExerciseResult>(
      `${this.baseUrl}/content/${contentId}/exercises/${exerciseId}/submit`,
      { answer },
    );
  }

  getVocabulary(contentId: string): Observable<VocabEntry[]> {
    return this.http.get<VocabEntry[]>(`${this.baseUrl}/content/${contentId}/vocabulary`);
  }

  getHistory(userId: string): Observable<ImmerseContent[]> {
    return this.http.get<ImmerseContent[]>(
      `${environment.apiUrl}/profiles/${userId}/immerse/history`,
    );
  }
}
