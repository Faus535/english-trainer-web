import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../core/services/environment';
import {
  DrillItem,
  DrillSubmitRequest,
  DrillSubmitResponse,
  MiniConversationEvaluateRequest,
  MiniConversationEvaluateResponse,
  MiniConversationStartRequest,
  MiniConversationStartResponse,
  PronunciationAnalyzeRequest,
  PronunciationAnalyzeResponse,
  PronunciationFeedbackRequest,
  PronunciationFeedbackResponse,
} from '../models/pronunciation.model';

@Injectable({ providedIn: 'root' })
export class PronunciationApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/pronunciation`;

  analyze(req: PronunciationAnalyzeRequest): Observable<PronunciationAnalyzeResponse> {
    return this.http.post<PronunciationAnalyzeResponse>(`${this.baseUrl}/analyze`, req);
  }

  getFeedback(req: PronunciationFeedbackRequest): Observable<PronunciationFeedbackResponse> {
    return this.http.post<PronunciationFeedbackResponse>(`${this.baseUrl}/feedback`, req);
  }

  getDrills(level: string, focus?: string): Observable<DrillItem[]> {
    const params: Record<string, string> = { level };
    if (focus) params['focus'] = focus;
    return this.http.get<DrillItem[]>(`${this.baseUrl}/drills`, { params });
  }

  submitDrill(id: string, req: DrillSubmitRequest): Observable<DrillSubmitResponse> {
    return this.http.post<DrillSubmitResponse>(`${this.baseUrl}/drills/${id}/submit`, req);
  }

  startMiniConversation(
    req: MiniConversationStartRequest,
  ): Observable<MiniConversationStartResponse> {
    return this.http.post<MiniConversationStartResponse>(`${this.baseUrl}/mini-conversation`, req);
  }

  evaluateMiniConversation(
    id: string,
    req: MiniConversationEvaluateRequest,
  ): Observable<MiniConversationEvaluateResponse> {
    return this.http.post<MiniConversationEvaluateResponse>(
      `${this.baseUrl}/mini-conversation/${id}/evaluate`,
      req,
    );
  }
}
