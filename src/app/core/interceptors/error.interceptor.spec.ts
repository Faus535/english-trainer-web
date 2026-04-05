import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors, HttpErrorResponse } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { errorInterceptor } from './error.interceptor';
import { AuthService } from '../services/auth.service';

@Component({ template: '', changeDetection: ChangeDetectionStrategy.OnPush })
class DummyComponent {}

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let auth: AuthService;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        provideRouter([{ path: 'auth/login', component: DummyComponent }]),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
    auth = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should pass through successful requests', () => {
    http.get('/api/data').subscribe((data) => {
      expect(data).toEqual({ value: 1 });
    });

    const req = httpMock.expectOne('/api/data');
    req.flush({ value: 1 });
  });

  it('should call logout on 401 for non-auth endpoints', () => {
    const logoutSpy = vi.spyOn(auth, 'logout');

    http.get('/api/protected').subscribe({
      error: () => {
        // expected
      },
    });

    const req = httpMock.expectOne('/api/protected');
    req.flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(logoutSpy).toHaveBeenCalled();
  });

  it('should not call logout on 401 for auth endpoints', () => {
    const logoutSpy = vi.spyOn(auth, 'logout');

    http.post('/api/auth/login', {}).subscribe({
      error: () => {
        // expected
      },
    });

    const req = httpMock.expectOne('/api/auth/login');
    req.flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(logoutSpy).not.toHaveBeenCalled();
  });

  it('should attempt refresh on 401 for /auth/me (authenticated endpoint)', () => {
    const refreshSpy = vi.spyOn(auth, 'refresh');

    http.get('/api/auth/me').subscribe({
      error: () => {
        // expected
      },
    });

    const req = httpMock.expectOne('/api/auth/me');
    req.flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(refreshSpy).toHaveBeenCalled();
  });

  it('should propagate error to subscriber', () => {
    let caughtError: HttpErrorResponse | null = null;

    http.get('/api/data').subscribe({
      error: (err) => {
        caughtError = err;
      },
    });

    const req = httpMock.expectOne('/api/data');
    req.flush(null, { status: 500, statusText: 'Server Error' });

    expect(caughtError).toBeTruthy();
    expect(caughtError!.status).toBe(500);
  });
});
