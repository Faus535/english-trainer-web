import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { HomeApiService } from './home-api.service';
import { environment } from '../../../core/services/environment';
import { HomeResponse } from '../models/home.model';

const mockHomeResponse: HomeResponse = {
  dueReviewCount: 5,
  streakDays: 3,
  weeklyActivity: [true, true, false, true, false, false, false],
  suggestedModule: 'REVIEW',
  recentXpThisWeek: 120,
  recentAchievements: [],
  englishLevel: 'B2',
};

describe('HomeApiService', () => {
  let service: HomeApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(HomeApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('getHome should return HomeResponse', () => {
    let result: HomeResponse | undefined;

    service.getHome().subscribe((r) => (result = r));

    const req = httpMock.expectOne(`${environment.apiUrl}/home`);
    expect(req.request.method).toBe('GET');
    req.flush(mockHomeResponse);

    expect(result).toEqual(mockHomeResponse);
  });
});
