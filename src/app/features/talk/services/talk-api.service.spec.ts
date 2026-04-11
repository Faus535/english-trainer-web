import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TalkApiService } from './talk-api.service';
import { environment } from '../../../core/services/environment';

describe('TalkApiService', () => {
  let service: TalkApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TalkApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('listQuickChallenges should GET /api/talk/quick-challenges', () => {
    const mockChallenges = [
      {
        id: 'order-coffee',
        title: 'Order Coffee',
        description: 'Order at a café',
        difficulty: 'EASY',
        category: 'Food & Dining',
      },
      {
        id: 'job-interview',
        title: 'Job Interview',
        description: 'Answer common questions',
        difficulty: 'HARD',
        category: 'Work',
      },
    ];

    let result: unknown;
    service.listQuickChallenges().subscribe((data) => (result = data));

    const req = httpMock.expectOne(`${environment.apiUrl}/talk/quick-challenges`);
    expect(req.request.method).toBe('GET');
    req.flush(mockChallenges);

    expect(result).toEqual(mockChallenges);
  });

  it('startConversation should include mode in request body', () => {
    service.startConversation({ scenarioId: 'scenario-1', mode: 'FULL', level: 'b1' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/talk/conversations`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.mode).toBe('FULL');
    expect(req.request.body.scenarioId).toBe('scenario-1');
    req.flush({
      id: 'conv-1',
      userId: 'user-1',
      scenarioId: 'scenario-1',
      level: 'b1',
      status: 'active',
      startedAt: '2026-04-11T00:00:00Z',
      endedAt: null,
      messages: [],
    });
  });

  it('startConversation should include challengeId for QUICK mode', () => {
    service.startConversation({ mode: 'QUICK', challengeId: 'order-coffee' }).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/talk/conversations`);
    expect(req.request.body.mode).toBe('QUICK');
    expect(req.request.body.challengeId).toBe('order-coffee');
    req.flush({
      id: 'conv-2',
      userId: 'user-1',
      scenarioId: null,
      level: 'a2',
      status: 'active',
      startedAt: '2026-04-11T00:00:00Z',
      endedAt: null,
      messages: [],
    });
  });
});
