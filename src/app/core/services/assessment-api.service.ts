import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';
import { AuthService } from './auth.service';
import {
  LevelTestSubmitRequest,
  LevelTestResultResponse,
  TestQuestionsResponse,
  TestHistoryResponse,
} from '../../shared/models/api.model';

@Injectable({ providedIn: 'root' })
export class AssessmentApiService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly baseUrl = `${environment.apiUrl}`;

  getTestQuestions(): Observable<TestQuestionsResponse> {
    const profileId = this.auth.profileId();
    return this.http.get<TestQuestionsResponse>(
      `${this.baseUrl}/profiles/${profileId}/assessments/level-test/questions`,
    );
  }

  submitLevelTest(
    profileId: string,
    request: LevelTestSubmitRequest,
  ): Observable<LevelTestResultResponse> {
    return this.http.post<LevelTestResultResponse>(
      `${this.baseUrl}/profiles/${profileId}/assessments/level-test`,
      request,
    );
  }

  getTestHistory(profileId: string): Observable<TestHistoryResponse[]> {
    return this.http.get<TestHistoryResponse[]>(
      `${this.baseUrl}/profiles/${profileId}/assessments/history`,
    );
  }
}
