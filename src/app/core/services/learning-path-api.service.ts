import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';
import { LearningStatus, LearningPath } from '../../shared/models/learning-path.model';

export interface GenerateLearningPathResponse {
  learningPathId: string;
  unitsGenerated: number;
  currentLevel: string;
}

@Injectable({ providedIn: 'root' })
export class LearningPathApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getLearningStatus(profileId: string): Observable<LearningStatus> {
    return this.http.get<LearningStatus>(`${this.baseUrl}/profiles/${profileId}/learning-status`);
  }

  getLearningPath(profileId: string): Observable<LearningPath> {
    return this.http.get<LearningPath>(`${this.baseUrl}/profiles/${profileId}/learning-path`);
  }

  generateLearningPath(profileId: string): Observable<GenerateLearningPathResponse> {
    return this.http.post<GenerateLearningPathResponse>(
      `${this.baseUrl}/profiles/${profileId}/learning-path/generate`,
      {},
    );
  }
}
