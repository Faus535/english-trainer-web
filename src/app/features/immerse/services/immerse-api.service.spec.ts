import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';
import { ImmerseApiService } from './immerse-api.service';
import { environment } from '../../../core/services/environment';

describe('ImmerseApiService', () => {
  let service: ImmerseApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ImmerseApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  describe('getExercises', () => {
    it('should not append type param for ALL', () => {
      service.getExercises('content-1').subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/immerse/content/content-1/exercises`);
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should append type param when not ALL', () => {
      service.getExercises('content-1', 'LISTENING_CLOZE').subscribe();

      const req = httpMock.expectOne(
        `${environment.apiUrl}/immerse/content/content-1/exercises?type=LISTENING_CLOZE`,
      );
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });

    it('should append REGULAR type param when REGULAR', () => {
      service.getExercises('content-1', 'REGULAR').subscribe();

      const req = httpMock.expectOne(
        `${environment.apiUrl}/immerse/content/content-1/exercises?type=REGULAR`,
      );
      expect(req.request.method).toBe('GET');
      req.flush([]);
    });
  });
});
