import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';

@Component({ template: '', changeDetection: ChangeDetectionStrategy.OnPush })
class DummyComponent {}

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: 'auth/login', component: DummyComponent }]),
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should start as unauthenticated', () => {
    expect(service.isAuthenticated()).toBe(false);
    expect(service.token()).toBeNull();
    expect(service.profileId()).toBeNull();
  });

  it('should login and store auth data', () => {
    const mockResponse = {
      token: 'test-token',
      refreshToken: 'test-refresh',
      profileId: 'profile-1',
      email: 'test@test.com',
    };

    service.login({ email: 'test@test.com', password: '123456' }).subscribe((res) => {
      expect(res.token).toBe('test-token');
    });

    const req = httpMock.expectOne('http://localhost:8081/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ email: 'test@test.com', password: '123456' });
    req.flush(mockResponse);

    expect(service.isAuthenticated()).toBe(true);
    expect(service.token()).toBe('test-token');
    expect(service.profileId()).toBe('profile-1');
  });

  it('should register and store auth data', () => {
    const mockResponse = {
      token: 'new-token',
      refreshToken: 'new-refresh',
      profileId: 'profile-2',
      email: 'new@test.com',
    };

    service.register({ email: 'new@test.com', password: '123456' }).subscribe();

    const req = httpMock.expectOne('http://localhost:8081/api/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(service.isAuthenticated()).toBe(true);
    expect(service.profileId()).toBe('profile-2');
  });

  it('should refresh token', () => {
    // First login
    sessionStorage.setItem('et_refresh_token', 'old-refresh');

    const mockResponse = {
      token: 'refreshed-token',
      refreshToken: 'new-refresh',
      profileId: 'profile-1',
      email: 'test@test.com',
    };

    service.refresh().subscribe();

    const req = httpMock.expectOne('http://localhost:8081/api/auth/refresh');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(service.token()).toBe('refreshed-token');
  });

  it('should logout and clear all stored data', () => {
    // Login first so the service signals are properly set
    const mockResponse = {
      token: 'some-token',
      refreshToken: 'some-refresh',
      profileId: 'some-id',
      email: 'test@test.com',
    };

    service.login({ email: 'test@test.com', password: '123456' }).subscribe();
    const loginReq = httpMock.expectOne('http://localhost:8081/api/auth/login');
    loginReq.flush(mockResponse);

    expect(service.isAuthenticated()).toBe(true);

    service.logout();

    // Flush the logout POST (fire-and-forget)
    const logoutReq = httpMock.expectOne('http://localhost:8081/api/auth/logout');
    logoutReq.flush(null);

    expect(service.isAuthenticated()).toBe(false);
    expect(service.token()).toBeNull();
    expect(service.profileId()).toBeNull();
    expect(sessionStorage.getItem('et_token')).toBeNull();
    expect(sessionStorage.getItem('et_refresh_token')).toBeNull();
    expect(sessionStorage.getItem('et_profile_id')).toBeNull();
  });
});
