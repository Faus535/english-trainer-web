import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from './environment';
import {
  AuthResponse,
  ForgotPasswordRequest,
  GoogleAuthRequest,
  LoginRequest,
  RefreshRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from '../../shared/models/api.model';

const TOKEN_KEY = 'et_token';
const REFRESH_KEY = 'et_refresh_token';
const PROFILE_ID_KEY = 'et_profile_id';
const EMAIL_KEY = 'et_email';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly baseUrl = `${environment.apiUrl}/auth`;

  private readonly _token = signal<string | null>(sessionStorage.getItem(TOKEN_KEY));
  private readonly _profileId = signal<string | null>(sessionStorage.getItem(PROFILE_ID_KEY));

  readonly isAuthenticated = computed(() => !!this._token());
  readonly profileId = this._profileId.asReadonly();
  readonly token = this._token.asReadonly();

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, request)
      .pipe(tap((res) => this.storeAuth(res)));
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/register`, request)
      .pipe(tap((res) => this.storeAuth(res)));
  }

  loginWithGoogle(request: GoogleAuthRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/google`, request)
      .pipe(tap((res) => this.storeAuth(res)));
  }

  refresh(): Observable<AuthResponse> {
    const refreshToken = sessionStorage.getItem(REFRESH_KEY);
    const request: RefreshRequest = { refreshToken: refreshToken ?? '' };
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/refresh`, request)
      .pipe(tap((res) => this.storeAuth(res)));
  }

  logout(): void {
    if (!this._token()) return;

    const refreshToken = sessionStorage.getItem(REFRESH_KEY);
    if (refreshToken) {
      this.http.post<void>(`${this.baseUrl}/logout`, { refreshToken }).subscribe();
    }

    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
    sessionStorage.removeItem(PROFILE_ID_KEY);
    sessionStorage.removeItem(EMAIL_KEY);
    this._token.set(null);
    this._profileId.set(null);
    this.router.navigate(['/auth/login']);
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/forgot-password`, request);
  }

  resetPassword(request: ResetPasswordRequest): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/reset-password`, request);
  }

  private storeAuth(res: AuthResponse): void {
    sessionStorage.setItem(TOKEN_KEY, res.token);
    sessionStorage.setItem(REFRESH_KEY, res.refreshToken);
    sessionStorage.setItem(PROFILE_ID_KEY, res.profileId);
    sessionStorage.setItem(EMAIL_KEY, res.email);
    this._token.set(res.token);
    this._profileId.set(res.profileId);
  }
}
