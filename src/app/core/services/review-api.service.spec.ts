import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ReviewApiService, ReviewResultResponse } from './review-api.service';

describe('ReviewApiService', () => {
  let service: ReviewApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ReviewApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('submitResult should send quality 4 for EASY', () => {
    const mockResponse: ReviewResultResponse = {
      id: 'item-1',
      nextReviewAt: '2026-04-18',
      intervalDays: 7,
      easeFactor: 2.5,
      consecutiveCorrect: 3,
    };

    service.submitResult('profile-1', 'item-1', 'EASY').subscribe();

    const req = httpMock.expectOne((r) => r.url.includes('/review/items/item-1/result'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ quality: 4 });
    req.flush(mockResponse);
  });

  it('submitResult should send quality 2 for HARD', () => {
    const mockResponse: ReviewResultResponse = {
      id: 'item-1',
      nextReviewAt: '2026-04-12',
      intervalDays: 1,
      easeFactor: 2.0,
      consecutiveCorrect: 0,
    };

    service.submitResult('profile-1', 'item-1', 'HARD').subscribe();

    const req = httpMock.expectOne((r) => r.url.includes('/review/items/item-1/result'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ quality: 2 });
    req.flush(mockResponse);
  });
});
