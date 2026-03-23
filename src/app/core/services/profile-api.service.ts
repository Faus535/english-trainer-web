import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';
import {
  ChangePasswordRequest,
  DeleteAccountRequest,
  UpdateProfileRequest,
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

  markTestCompleted(profileId: string): Observable<UserProfileResponse> {
    return this.http.put<UserProfileResponse>(`${this.baseUrl}/${profileId}/test-completed`, {});
  }

  resetTest(profileId: string): Observable<UserProfileResponse> {
    return this.http.put<UserProfileResponse>(`${this.baseUrl}/${profileId}/reset-test`, {});
  }

  updateModuleLevel(
    profileId: string,
    module: string,
    level: string,
  ): Observable<UserProfileResponse> {
    return this.http.put<UserProfileResponse>(
      `${this.baseUrl}/${profileId}/modules/${module}/level`,
      { level },
    );
  }

  recordSession(profileId: string, data: { duration?: number }): Observable<UserProfileResponse> {
    return this.http.post<UserProfileResponse>(`${this.baseUrl}/${profileId}/sessions`, data);
  }

  addXp(profileId: string, amount: number): Observable<UserProfileResponse> {
    return this.http.post<UserProfileResponse>(`${this.baseUrl}/${profileId}/xp`, { amount });
  }

  getCurrentUser(): Observable<UserAccountResponse> {
    return this.http.get<UserAccountResponse>(`${environment.apiUrl}/auth/me`);
  }

  updateProfile(profileId: string, data: UpdateProfileRequest): Observable<UserAccountResponse> {
    return this.http.put<UserAccountResponse>(`${this.baseUrl}/${profileId}`, data);
  }

  changePassword(data: ChangePasswordRequest): Observable<void> {
    return this.http.put<void>(`${environment.apiUrl}/auth/password`, data);
  }

  deleteAccount(data: DeleteAccountRequest): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/auth/account`, { body: data });
  }
}
