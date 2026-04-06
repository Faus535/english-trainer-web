import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../core/services/environment';
import {
  TalkScenarioResponse,
  Scenario,
  ScenarioCategory,
  TalkStats,
  ConversationDetailResponse,
  TalkEndResponse,
  SendMessageResponse,
} from '../models/talk.model';

const CATEGORY_ICONS: Record<string, string> = {
  'Daily Life': '🏠',
  Work: '💼',
  Travel: '✈️',
  'Food & Dining': '🍽️',
  Shopping: '🛒',
  Health: '🏥',
  Education: '📚',
  Entertainment: '🎬',
  Social: '👥',
};

@Injectable({ providedIn: 'root' })
export class TalkApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/talk`;

  listScenarios(): Observable<ScenarioCategory[]> {
    return this.http
      .get<TalkScenarioResponse[]>(`${this.baseUrl}/scenarios`)
      .pipe(map((raw) => this.groupByCategory(raw)));
  }

  startConversation(req: {
    scenarioId: string;
    level: string;
  }): Observable<ConversationDetailResponse> {
    return this.http.post<ConversationDetailResponse>(`${this.baseUrl}/conversations`, req);
  }

  sendMessage(
    conversationId: string,
    content: string,
    confidence?: number,
  ): Observable<SendMessageResponse> {
    return this.http.post<SendMessageResponse>(
      `${this.baseUrl}/conversations/${conversationId}/messages`,
      { content, confidence },
    );
  }

  endConversation(conversationId: string): Observable<TalkEndResponse> {
    return this.http.post<TalkEndResponse>(
      `${this.baseUrl}/conversations/${conversationId}/end`,
      {},
    );
  }

  getConversationSummary(conversationId: string): Observable<TalkEndResponse> {
    return this.http.get<TalkEndResponse>(
      `${this.baseUrl}/conversations/${conversationId}/summary`,
    );
  }

  getTalkStats(userId: string): Observable<TalkStats> {
    return this.http.get<TalkStats>(`${environment.apiUrl}/profiles/${userId}/talk/stats`);
  }

  categoryIcon(category: string): string {
    return CATEGORY_ICONS[category] ?? '💬';
  }

  private groupByCategory(raw: TalkScenarioResponse[]): ScenarioCategory[] {
    const map = new Map<string, Scenario[]>();

    for (const item of raw) {
      const scenario: Scenario = {
        id: item.id,
        title: item.title,
        description: item.description,
        cefrLevel: item.cefrLevel,
        difficultyOrder: item.difficultyOrder,
        category: item.category,
      };
      const list = map.get(item.category) ?? [];
      list.push(scenario);
      map.set(item.category, list);
    }

    return Array.from(map.entries()).map(([name, scenarios]) => ({
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      scenarios: scenarios.sort((a, b) => a.difficultyOrder - b.difficultyOrder),
    }));
  }
}
