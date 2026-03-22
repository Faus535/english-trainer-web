import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../core/services/environment';
import {
  AnalyticsSummaryResponse,
  ModuleLevelHistoryResponse,
  ActivityHeatmapResponse,
  WeakAreaResponse,
} from '../../../shared/models/api.model';

@Injectable({ providedIn: 'root' })
export class AnalyticsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/analytics`;

  getSummary(profileId: string): Observable<AnalyticsSummaryResponse> {
    return this.http.get<AnalyticsSummaryResponse>(`${this.baseUrl}/${profileId}/summary`);
  }
  getLevelHistory(profileId: string): Observable<ModuleLevelHistoryResponse[]> {
    return this.http.get<ModuleLevelHistoryResponse[]>(
      `${this.baseUrl}/${profileId}/level-history`,
    );
  }
  getHeatmap(profileId: string): Observable<ActivityHeatmapResponse> {
    return this.http.get<ActivityHeatmapResponse>(`${this.baseUrl}/${profileId}/heatmap`);
  }
  getWeakAreas(profileId: string): Observable<WeakAreaResponse[]> {
    return this.http.get<WeakAreaResponse[]>(`${this.baseUrl}/${profileId}/weak-areas`);
  }
}
