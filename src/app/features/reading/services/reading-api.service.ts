import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../core/services/environment';
import {
  ReadingTextResponse,
  ReadingQuestionResponse,
  ReadingResultResponse,
  SubmitReadingAnswersRequest,
} from '../../../shared/models/api.model';
import { Level } from '../../../shared/models/learning.model';

@Injectable({ providedIn: 'root' })
export class ReadingApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/reading`;

  getTexts(level?: Level, topic?: string): Observable<ReadingTextResponse[]> {
    let params = new HttpParams();
    if (level) params = params.set('level', level);
    if (topic) params = params.set('topic', topic);
    return this.http.get<ReadingTextResponse[]>(`${this.baseUrl}/texts`, { params });
  }

  getText(textId: string): Observable<ReadingTextResponse> {
    return this.http.get<ReadingTextResponse>(`${this.baseUrl}/texts/${textId}`);
  }

  getQuestions(textId: string): Observable<ReadingQuestionResponse[]> {
    return this.http.get<ReadingQuestionResponse[]>(`${this.baseUrl}/texts/${textId}/questions`);
  }

  submitAnswers(
    textId: string,
    request: SubmitReadingAnswersRequest,
  ): Observable<ReadingResultResponse> {
    return this.http.post<ReadingResultResponse>(
      `${this.baseUrl}/texts/${textId}/answers`,
      request,
    );
  }
}
