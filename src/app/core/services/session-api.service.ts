import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';
import {
  AdvanceBlockResponse,
  GenerateSessionRequest,
  SessionExerciseResponse,
  SessionResponse,
} from '../../shared/models/api.model';

@Injectable({ providedIn: 'root' })
export class SessionApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/profiles`;

  generateSession(profileId: string, request: GenerateSessionRequest): Observable<SessionResponse> {
    return this.http.post<SessionResponse>(
      `${this.baseUrl}/${profileId}/sessions/generate`,
      request,
    );
  }

  getCurrentSession(profileId: string): Observable<SessionResponse> {
    return this.http.get<SessionResponse>(`${this.baseUrl}/${profileId}/sessions/current`);
  }

  completeSession(profileId: string, sessionId: string): Observable<SessionResponse> {
    return this.http.put<SessionResponse>(
      `${this.baseUrl}/${profileId}/sessions/${sessionId}/complete`,
      {},
    );
  }

  getSessionHistory(profileId: string): Observable<SessionResponse[]> {
    return this.http.get<SessionResponse[]>(`${this.baseUrl}/${profileId}/sessions`);
  }

  advanceBlock(
    profileId: string,
    sessionId: string,
    blockIndex: number,
  ): Observable<AdvanceBlockResponse> {
    return this.http.put<AdvanceBlockResponse>(
      `${this.baseUrl}/${profileId}/sessions/${sessionId}/blocks/${blockIndex}/advance`,
      {},
    );
  }

  getBlockExercises(
    profileId: string,
    sessionId: string,
    blockIndex: number,
  ): Observable<SessionExerciseResponse[]> {
    return this.http.get<SessionExerciseResponse[]>(
      `${this.baseUrl}/${profileId}/sessions/${sessionId}/blocks/${blockIndex}/exercises`,
    );
  }
}
