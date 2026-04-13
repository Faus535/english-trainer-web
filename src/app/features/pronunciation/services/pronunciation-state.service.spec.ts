import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { PronunciationStateService } from './pronunciation-state.service';
import { environment } from '../../../core/services/environment';

describe('PronunciationStateService', () => {
  let service: PronunciationStateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PronunciationStateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should update analysisResult after successful analyze call', () => {
    const mockResponse = {
      text: 'thought',
      ipa: '/θɔːt/',
      syllables: '1',
      stressPattern: 'single',
      tips: ['tip'],
      commonMistakes: [],
      minimalPairs: [],
      exampleSentences: [],
    };

    service.analyze('thought', 'b1');

    const req = httpMock.expectOne(`${environment.apiUrl}/pronunciation/analyze`);
    req.flush(mockResponse);

    expect(service.analysisResult()).toEqual(mockResponse);
    expect(service.isAnalyzing()).toBe(false);
  });

  it('should update feedbackResult after successful submitFeedback call', () => {
    const mockResponse = {
      score: 72,
      wordFeedback: [],
      overallTip: 'Good job',
    };

    service.submitFeedback('thought', 'tot', [{ word: 'thought', confidence: 0.5 }]);

    const req = httpMock.expectOne(`${environment.apiUrl}/pronunciation/feedback`);
    req.flush(mockResponse);

    expect(service.feedbackResult()).toEqual(mockResponse);
    expect(service.isFeedbackLoading()).toBe(false);
  });

  it('should reset drillIndex to 0 when loadDrills is called', () => {
    service.loadDrills('b1');

    const req = httpMock.expectOne((r) => r.url === `${environment.apiUrl}/pronunciation/drills`);
    req.flush([
      { id: 'd1', phrase: 'Test', focus: 'th-sound', difficulty: 'EASY', cefrLevel: 'b1' },
    ]);

    expect(service.currentDrill()?.id).toBe('d1');
    expect(service.drillProgress().current).toBe(1);
  });

  it('should set isMiniConvComplete to true when evaluateTurn response has isComplete true', () => {
    // First start a session
    service.startMiniConversation('th-sound', 'b1');
    const startReq = httpMock.expectOne(`${environment.apiUrl}/pronunciation/mini-conversation`);
    startReq.flush({ id: 'session-1', prompt: 'Say...', targetPhrase: 'hello' });

    expect(service.miniConvId()).toBe('session-1');

    // Then evaluate
    service.evaluateTurn('hello', [{ word: 'hello', confidence: 0.9 }]);
    const evalReq = httpMock.expectOne(
      `${environment.apiUrl}/pronunciation/mini-conversation/session-1/evaluate`,
    );
    evalReq.flush({
      score: 90,
      wordFeedback: [],
      nextPrompt: '',
      nextTargetPhrase: '',
      isComplete: true,
    });

    expect(service.isMiniConvComplete()).toBe(true);
  });
});
