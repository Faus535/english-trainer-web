import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../core/services/environment';
import {
  WritingExerciseResponse,
  WritingSubmissionRequest,
  WritingFeedbackResponse,
  WritingHistoryResponse,
} from '../../../shared/models/api.model';
import { Level } from '../../../shared/models/learning.model';

@Injectable({ providedIn: 'root' })
export class WritingApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/writing`;

  getExercises(level?: Level): Observable<WritingExerciseResponse[]> {
    let params = new HttpParams();
    if (level) params = params.set('level', level);
    return this.http.get<WritingExerciseResponse[]>(`${this.baseUrl}/exercises`, { params });
  }

  submitWriting(request: WritingSubmissionRequest): Observable<WritingFeedbackResponse> {
    return this.http.post<WritingFeedbackResponse>(`${this.baseUrl}/submissions`, request);
  }

  getHistory(profileId: string): Observable<WritingHistoryResponse[]> {
    return this.http.get<WritingHistoryResponse[]>(`${this.baseUrl}/history`, {
      params: new HttpParams().set('profileId', profileId),
    });
  }
}
