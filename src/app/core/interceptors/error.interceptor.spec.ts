import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
  provideHttpClient,
  withInterceptors,
  HttpErrorResponse,
  HttpClient,
} from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { errorInterceptor } from './error.interceptor';

@Component({ template: '', changeDetection: ChangeDetectionStrategy.OnPush })
class DummyComponent {}

describe('errorInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        provideRouter([{ path: '**', component: DummyComponent }]),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
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

  it('should attempt refresh on 401 for non-auth endpoints', () => {
    http.get('/api/protected').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/api/protected');
    req.flush(null, { status: 401, statusText: 'Unauthorized' });

    // Interceptor attempts refresh
    const refreshReq = httpMock.expectOne((r) => r.url.includes('/auth/refresh'));
    expect(refreshReq.request.method).toBe('POST');

    // Refresh fails → triggers logout
    refreshReq.flush(null, { status: 401, statusText: 'Unauthorized' });
  });

  it('should not attempt refresh on 401 for public auth endpoints', () => {
    http.post('/api/auth/login', {}).subscribe({ error: () => {} });

    const req = httpMock.expectOne('/api/auth/login');
    req.flush(null, { status: 401, statusText: 'Unauthorized' });

    // No refresh should be attempted for public auth URLs
    httpMock.expectNone((r) => r.url.includes('/auth/refresh'));
  });

  it('should attempt refresh on 401 for /auth/me', () => {
    http.get('/api/auth/me').subscribe({ error: () => {} });

    const req = httpMock.expectOne('/api/auth/me');
    req.flush(null, { status: 401, statusText: 'Unauthorized' });

    // /auth/me is not a public auth URL, so refresh should be attempted
    const refreshReq = httpMock.expectOne((r) => r.url.includes('/auth/refresh'));
    expect(refreshReq.request.method).toBe('POST');
    refreshReq.flush(null, { status: 401, statusText: 'Unauthorized' });
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
