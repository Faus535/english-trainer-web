import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';
import { StreakResponse } from '../../shared/models/api.model';

@Injectable({ providedIn: 'root' })
export class ActivityApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/profiles`;

  recordActivity(profileId: string): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/${profileId}/activity`,
      {},
    );
  }

  getActivityDates(profileId: string): Observable<string[]> {
    return this.http.get<string[]>(
      `${this.baseUrl}/${profileId}/activity`,
    );
  }

  getStreak(profileId: string): Observable<StreakResponse> {
    return this.http.get<StreakResponse>(
      `${this.baseUrl}/${profileId}/streak`,
    );
  }
}
