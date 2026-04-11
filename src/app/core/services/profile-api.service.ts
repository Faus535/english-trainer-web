import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';
import {
  ChangePasswordRequest,
  DeleteAccountRequest,
  UserAccountResponse,
  UserProfileResponse,
} from '../../shared/models/api.model';

@Injectable({ providedIn: 'root' })
export class ProfileApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/profiles`;

  getProfile(profileId: string): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(`${this.baseUrl}/${profileId}`);
  }

  recordSession(profileId: string, module: string, durationSeconds: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/${profileId}/sessions`, {
      module,
      durationSeconds,
    });
  }

  updateEnglishLevel(userId: string, level: string): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${userId}/english-level`, { level });
  }

  addXp(profileId: string, amount: number): Observable<UserProfileResponse> {
    return this.http.post<UserProfileResponse>(`${this.baseUrl}/${profileId}/xp`, { amount });
  }

  getCurrentUser(): Observable<UserAccountResponse> {
    return this.http.get<UserAccountResponse>(`${environment.apiUrl}/auth/me`);
  }

  changePassword(data: ChangePasswordRequest): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/auth/change-password`, data);
  }

  deleteAccount(data: DeleteAccountRequest): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/auth/account`, { body: data });
  }
}
