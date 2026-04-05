import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../core/services/environment';
import { Level } from '../../../shared/models/learning.model';
import {
  ScenarioCategory,
  TalkStats,
  ConversationDetailResponse,
  EndConversationResponse,
} from '../models/talk.model';

@Injectable({ providedIn: 'root' })
export class TalkApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/talk`;

  listScenarios(): Observable<ScenarioCategory[]> {
    return this.http.get<ScenarioCategory[]>(`${this.baseUrl}/scenarios`);
  }

  startConversation(
    profileId: string,
    req: { scenarioId: string; level: Level },
  ): Observable<ConversationDetailResponse> {
    return this.http.post<ConversationDetailResponse>(`${this.baseUrl}/conversations`, req);
  }

  endConversation(conversationId: string): Observable<EndConversationResponse> {
    return this.http.post<EndConversationResponse>(
      `${this.baseUrl}/conversations/${conversationId}/end`,
      {},
    );
  }

  getConversationSummary(conversationId: string): Observable<EndConversationResponse> {
    return this.http.get<EndConversationResponse>(
      `${this.baseUrl}/conversations/${conversationId}/summary`,
    );
  }

  getTalkStats(userId: string): Observable<TalkStats> {
    return this.http.get<TalkStats>(`${environment.apiUrl}/profiles/${userId}/talk/stats`);
  }
}
