import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';
import {
  AchievementResponse,
  UserAchievementResponse,
  XpLevelResponse,
} from '../../shared/models/api.model';

@Injectable({ providedIn: 'root' })
export class GamificationApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}`;

  getAllAchievements(): Observable<AchievementResponse[]> {
    return this.http.get<AchievementResponse[]>(
      `${this.baseUrl}/achievements`,
    );
  }

  getUserAchievements(profileId: string): Observable<UserAchievementResponse[]> {
    return this.http.get<UserAchievementResponse[]>(
      `${this.baseUrl}/profiles/${profileId}/achievements`,
    );
  }

  checkAchievements(profileId: string): Observable<UserAchievementResponse[]> {
    return this.http.post<UserAchievementResponse[]>(
      `${this.baseUrl}/profiles/${profileId}/achievements/check`,
      {},
    );
  }

  grantXp(profileId: string, amount: number): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/profiles/${profileId}/xp`,
      { amount },
    );
  }

  getXpLevel(profileId: string): Observable<XpLevelResponse> {
    return this.http.get<XpLevelResponse>(
      `${this.baseUrl}/profiles/${profileId}/xp-level`,
    );
  }
}
