import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';

export interface ExerciseResultRequest {
  correctCount: number;
  totalCount: number;
  averageResponseTimeMs: number;
  exerciseType: string;
}

export interface ExerciseResultResponse {
  unitMasteryScore: number;
  unitStatus: string;
  xpEarned: number;
}

@Injectable({ providedIn: 'root' })
export class ExerciseResultApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  recordResult(
    profileId: string,
    sessionId: string,
    exerciseIndex: number,
    result: ExerciseResultRequest,
  ): Observable<ExerciseResultResponse> {
    return this.http.post<ExerciseResultResponse>(
      `${this.baseUrl}/profiles/${profileId}/sessions/${sessionId}/exercises/${exerciseIndex}/result`,
      result,
    );
  }
}
