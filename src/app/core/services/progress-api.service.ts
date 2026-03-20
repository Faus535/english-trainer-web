import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';
import { ModuleProgressResponse } from '../../shared/models/api.model';

@Injectable({ providedIn: 'root' })
export class ProgressApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/profiles`;

  getAllProgress(profileId: string): Observable<ModuleProgressResponse[]> {
    return this.http.get<ModuleProgressResponse[]>(
      `${this.baseUrl}/${profileId}/modules`,
    );
  }

  getModuleProgress(profileId: string, module: string, level: string): Observable<ModuleProgressResponse> {
    return this.http.get<ModuleProgressResponse>(
      `${this.baseUrl}/${profileId}/modules/${module}/levels/${level}`,
    );
  }

  initModuleProgress(profileId: string, module: string, level: string): Observable<ModuleProgressResponse> {
    return this.http.post<ModuleProgressResponse>(
      `${this.baseUrl}/${profileId}/modules/${module}/levels/${level}`,
      {},
    );
  }

  completeUnit(profileId: string, module: string, level: string, unit: number): Observable<ModuleProgressResponse> {
    return this.http.put<ModuleProgressResponse>(
      `${this.baseUrl}/${profileId}/modules/${module}/levels/${level}/units/${unit}`,
      {},
    );
  }

  checkLevelUp(profileId: string, module: string, level: string): Observable<{ levelUp: boolean; newLevel?: string }> {
    return this.http.get<{ levelUp: boolean; newLevel?: string }>(
      `${this.baseUrl}/${profileId}/modules/${module}/levels/${level}/level-up`,
    );
  }
}
