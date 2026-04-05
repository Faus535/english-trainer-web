import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../core/services/environment';

export interface HomeSummaryResponse {
  suggestedAction: {
    type: 'talk' | 'immerse' | 'review';
    title: string;
    description: string;
    targetRoute: string;
  };
  progress: {
    xpToday: number;
    xpGoal: number;
    streak: number;
  };
  recentActivity: {
    lastTalkConversation?: { id: string; topic: string; date: string };
    reviewDueCount: number;
  };
}

@Injectable({ providedIn: 'root' })
export class HomeApiService {
  private readonly http = inject(HttpClient);

  getHomeSummary(profileId: string): Observable<HomeSummaryResponse> {
    return this.http.get<HomeSummaryResponse>(`${environment.apiUrl}/profiles/${profileId}/home`);
  }
}
