import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../core/services/environment';
import {
  Conversation,
  ConversationDetailResponse,
  EndConversationResponse,
  SendMessageRequest,
  SendMessageResponse,
  StartConversationRequest,
} from '../models/tutor.model';

@Injectable({ providedIn: 'root' })
export class TutorApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/conversations`;

  startConversation(
    profileId: string,
    request: StartConversationRequest,
  ): Observable<ConversationDetailResponse> {
    return this.http.post<ConversationDetailResponse>(
      `${this.baseUrl}?profileId=${profileId}`,
      request,
    );
  }

  sendMessage(
    conversationId: string,
    request: SendMessageRequest,
  ): Observable<SendMessageResponse> {
    return this.http.post<SendMessageResponse>(
      `${this.baseUrl}/${conversationId}/messages`,
      request,
    );
  }

  getConversation(conversationId: string): Observable<ConversationDetailResponse> {
    return this.http.get<ConversationDetailResponse>(`${this.baseUrl}/${conversationId}`);
  }

  listConversations(profileId: string): Observable<Conversation[]> {
    return this.http.get<Conversation[]>(`${this.baseUrl}?profileId=${profileId}`);
  }

  endConversation(conversationId: string): Observable<EndConversationResponse> {
    return this.http.put<EndConversationResponse>(`${this.baseUrl}/${conversationId}/end`, {});
  }
}
