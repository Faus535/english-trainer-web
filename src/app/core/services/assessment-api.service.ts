import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';
import { LevelTestSubmitRequest, LevelTestResultResponse } from '../../shared/models/api.model';

@Injectable({ providedIn: 'root' })
export class AssessmentApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}`;

  submitLevelTest(profileId: string, request: LevelTestSubmitRequest): Observable<LevelTestResultResponse> {
    return this.http.post<LevelTestResultResponse>(
      `${this.baseUrl}/profiles/${profileId}/assessments/level-test`,
      request,
    );
  }

  getTestHistory(profileId: string): Observable<LevelTestResultResponse[]> {
    return this.http.get<LevelTestResultResponse[]>(
      `${this.baseUrl}/profiles/${profileId}/assessments/history`,
    );
  }
}
