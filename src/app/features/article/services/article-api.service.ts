import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../core/services/environment';
import {
  GenerateArticleRequest,
  GenerateArticleResponse,
  ArticleResponse,
  SaveWordRequest,
  SavedWord,
  ArticleQuestion,
  SubmitAnswerRequest,
  AnswerResult,
  ArticleHistoryItem,
} from '../models/article.model';

@Injectable({ providedIn: 'root' })
export class ArticleApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/article`;

  generate(req: GenerateArticleRequest): Observable<GenerateArticleResponse> {
    return this.http.post<GenerateArticleResponse>(`${this.baseUrl}/generate`, req);
  }

  getArticle(id: string): Observable<ArticleResponse> {
    return this.http.get<ArticleResponse>(`${this.baseUrl}/${id}`);
  }

  completeArticle(id: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${id}/complete`, null);
  }

  saveWord(id: string, req: SaveWordRequest): Observable<SavedWord> {
    return this.http.post<SavedWord>(`${this.baseUrl}/${id}/words`, req);
  }

  getWords(id: string): Observable<SavedWord[]> {
    return this.http.get<SavedWord[]>(`${this.baseUrl}/${id}/words`);
  }

  getQuestions(id: string): Observable<ArticleQuestion[]> {
    return this.http.get<ArticleQuestion[]>(`${this.baseUrl}/${id}/questions`);
  }

  submitAnswer(id: string, qId: string, req: SubmitAnswerRequest): Observable<AnswerResult> {
    return this.http.post<AnswerResult>(`${this.baseUrl}/${id}/questions/${qId}/answer`, req);
  }

  getHint(id: string, qId: string): Observable<{ hint: string }> {
    return this.http.get<{ hint: string }>(`${this.baseUrl}/${id}/questions/${qId}/hint`);
  }

  getHistory(): Observable<ArticleHistoryItem[]> {
    return this.http.get<ArticleHistoryItem[]>(`${this.baseUrl}/history`);
  }

  deleteArticle(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
