import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PronunciationApiService } from './pronunciation-api.service';
import { environment } from '../../../core/services/environment';

describe('PronunciationApiService', () => {
  let service: PronunciationApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PronunciationApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('analyze() should POST to /api/pronunciation/analyze with body', () => {
    const req = { text: 'thought', level: 'b1' };
    const mockResponse = {
      text: 'thought',
      ipa: '/θɔːt/',
      syllables: '1',
      stressPattern: 'single',
      tips: [],
      commonMistakes: [],
      minimalPairs: [],
      exampleSentences: [],
    };

    let result: unknown;
    service.analyze(req).subscribe((r) => (result = r));

    const httpReq = httpMock.expectOne(`${environment.apiUrl}/pronunciation/analyze`);
    expect(httpReq.request.method).toBe('POST');
    expect(httpReq.request.body).toEqual(req);
    httpReq.flush(mockResponse);

    expect(result).toEqual(mockResponse);
  });

  it('getFeedback() should POST to /api/pronunciation/feedback', () => {
    const req = {
      targetText: 'thought',
      recognizedText: 'tot',
      wordConfidences: [{ word: 'thought', confidence: 0.5 }],
    };

    service.getFeedback(req).subscribe();

    const httpReq = httpMock.expectOne(`${environment.apiUrl}/pronunciation/feedback`);
    expect(httpReq.request.method).toBe('POST');
    expect(httpReq.request.body).toEqual(req);
    httpReq.flush({ score: 72, wordFeedback: [], overallTip: '' });
  });

  it('getDrills() should GET /api/pronunciation/drills with level param', () => {
    service.getDrills('b1').subscribe();

    const httpReq = httpMock.expectOne(
      (r) =>
        r.url === `${environment.apiUrl}/pronunciation/drills` && r.params.get('level') === 'b1',
    );
    expect(httpReq.request.method).toBe('GET');
    httpReq.flush([]);
  });

  it('getDrills() should include focus param when provided', () => {
    service.getDrills('b1', 'th-sound').subscribe();

    const httpReq = httpMock.expectOne(
      (r) =>
        r.url === `${environment.apiUrl}/pronunciation/drills` &&
        r.params.get('level') === 'b1' &&
        r.params.get('focus') === 'th-sound',
    );
    httpReq.flush([]);
  });

  it('submitDrill() should POST to /api/pronunciation/drills/{id}/submit', () => {
    const id = 'drill-1';
    const req = { recognizedText: 'test', confidence: 0.8 };

    service.submitDrill(id, req).subscribe();

    const httpReq = httpMock.expectOne(`${environment.apiUrl}/pronunciation/drills/${id}/submit`);
    expect(httpReq.request.method).toBe('POST');
    httpReq.flush({ score: 85, feedback: 'Good', perfectStreak: 0 });
  });

  it('startMiniConversation() should POST to /api/pronunciation/mini-conversation', () => {
    service.startMiniConversation({ focus: 'th-sound', level: 'b1' }).subscribe();

    const httpReq = httpMock.expectOne(`${environment.apiUrl}/pronunciation/mini-conversation`);
    expect(httpReq.request.method).toBe('POST');
    httpReq.flush({ id: 'uuid', prompt: 'Say...', targetPhrase: 'hello' });
  });

  it('evaluateMiniConversation() should POST to /api/pronunciation/mini-conversation/{id}/evaluate', () => {
    const id = 'session-1';
    service
      .evaluateMiniConversation(id, { recognizedText: 'hello', wordConfidences: [] })
      .subscribe();

    const httpReq = httpMock.expectOne(
      `${environment.apiUrl}/pronunciation/mini-conversation/${id}/evaluate`,
    );
    expect(httpReq.request.method).toBe('POST');
    httpReq.flush({
      score: 80,
      wordFeedback: [],
      nextPrompt: '',
      nextTargetPhrase: '',
      isComplete: false,
    });
  });
});
