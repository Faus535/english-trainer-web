import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ProfileApiService } from './profile-api.service';
import { environment } from './environment';

describe('ProfileApiService', () => {
  let service: ProfileApiService;
  let httpMock: HttpTestingController;
  const base = `${environment.apiUrl}/profiles`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ProfileApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('recordSession should POST with module and durationSeconds', () => {
    service.recordSession('profile-1', 'ARTICLE', 600).subscribe();

    const req = httpMock.expectOne(`${base}/profile-1/sessions`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ module: 'ARTICLE', durationSeconds: 600 });
    req.flush(null, { status: 201, statusText: 'Created' });
  });

  it('updateEnglishLevel should PUT with level', () => {
    service.updateEnglishLevel('profile-1', 'B1').subscribe();

    const req = httpMock.expectOne(`${base}/profile-1/english-level`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ level: 'B1' });
    req.flush(null, { status: 204, statusText: 'No Content' });
  });
});
