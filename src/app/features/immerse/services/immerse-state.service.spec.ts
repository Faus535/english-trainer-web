import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, provideRouter } from '@angular/router';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { ImmerseStateService } from './immerse-state.service';

@Component({ template: '', changeDetection: ChangeDetectionStrategy.OnPush })
class DummyComponent {}
import { environment } from '../../../core/services/environment';
import { VocabEntry } from '../models/immerse.model';

describe('ImmerseStateService', () => {
  let service: ImmerseStateService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: '**', component: DummyComponent }]),
      ],
    });
    service = TestBed.inject(ImmerseStateService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    service.cancelGeneration();
    httpMock.verify();
    vi.useRealTimers();
  });

  it('should start with empty state', () => {
    expect(service.content()).toBeNull();
    expect(service.loading()).toBe(false);
    expect(service.capturedVocab()).toEqual([]);
    expect(service.exercises()).toEqual([]);
    expect(service.generating()).toBe(false);
    expect(service.generationStep()).toBe('idle');
    expect(service.generationProgress()).toBe(0);
    expect(service.generationError()).toBeNull();
  });

  it('submitContent() should set loading and content signal', () => {
    service.submitContent({ url: 'https://example.com/article' });
    expect(service.loading()).toBe(true);

    const req = httpMock.expectOne(`${environment.apiUrl}/immerse/content`);
    expect(req.request.method).toBe('POST');
    req.flush({
      id: 'content-1',
      title: 'Test Article',
      paragraphs: [],
      difficulty: 'b1',
      wordCount: 100,
    });

    expect(service.loading()).toBe(false);
    expect(service.content()?.id).toBe('content-1');
  });

  it('saveWord() should add to capturedVocab signal', () => {
    expect(service.capturedVocab().length).toBe(0);

    const entry: VocabEntry = {
      word: 'test',
      definition: 'a trial',
      partOfSpeech: 'noun',
      level: 'a1',
      contextSentence: 'This is a test.',
    };
    service.saveWord(entry);

    expect(service.capturedVocab().length).toBe(1);
    expect(service.capturedVocab()[0].word).toBe('test');
  });

  it('capturedVocabCount should return correct count', () => {
    expect(service.capturedVocabCount()).toBe(0);

    service.saveWord({
      word: 'hello',
      definition: 'greeting',
      partOfSpeech: 'interjection',
      level: 'a1',
      contextSentence: 'Hello world',
    });

    expect(service.capturedVocabCount()).toBe(1);
  });

  it('loadExercises() should populate exercises signal', () => {
    service.loadExercises('content-1');
    expect(service.loading()).toBe(true);

    const req = httpMock.expectOne(`${environment.apiUrl}/immerse/content/content-1/exercises`);
    req.flush([{ id: 'ex-1', type: 'fill-blank', prompt: 'The ___ fox', correctAnswer: 'quick' }]);

    expect(service.loading()).toBe(false);
    expect(service.exercises().length).toBe(1);
  });

  it('submitAnswer() should update exerciseProgress', () => {
    service.submitAnswer('content-1', 'ex-1', 'quick');

    const req = httpMock.expectOne(
      `${environment.apiUrl}/immerse/content/content-1/exercises/ex-1/submit`,
    );
    req.flush({ exerciseId: 'ex-1', correct: true, userAnswer: 'quick' });

    expect(service.exerciseProgress().length).toBe(1);
    expect(service.exerciseProgress()[0].correct).toBe(true);
  });

  describe('generateContent() polling', () => {
    const pendingResponse = { id: 'gen-1', status: 'PENDING' };
    const pollPending = {
      id: 'gen-1',
      status: 'PENDING',
      title: '',
      paragraphs: [],
      difficulty: 'b1',
      wordCount: 0,
    };
    const pollProcessed = {
      id: 'gen-1',
      status: 'PROCESSED',
      title: 'Test',
      paragraphs: [],
      difficulty: 'b1',
      wordCount: 100,
    };
    const pollFailed = {
      id: 'gen-1',
      status: 'FAILED',
      title: '',
      paragraphs: [],
      difficulty: 'b1',
      wordCount: 0,
    };

    it('should set generating to true after POST returns PENDING', () => {
      service.generateContent({ contentType: 'TEXT', level: 'b1' });

      const req = httpMock.expectOne(`${environment.apiUrl}/immerse/generate`);
      req.flush(pendingResponse);

      expect(service.generating()).toBe(true);
      expect(service.generationStep()).toBe('sending');

      service.cancelGeneration();
    });

    it('should poll getContent every 2 seconds after PENDING', () => {
      service.generateContent({ contentType: 'TEXT', level: 'b1' });

      const postReq = httpMock.expectOne(`${environment.apiUrl}/immerse/generate`);
      postReq.flush(pendingResponse);

      // First poll at 2s
      vi.advanceTimersByTime(2000);
      const pollReq1 = httpMock.expectOne(`${environment.apiUrl}/immerse/content/gen-1`);
      pollReq1.flush(pollPending);

      // Second poll at 4s
      vi.advanceTimersByTime(2000);
      const pollReq2 = httpMock.expectOne(`${environment.apiUrl}/immerse/content/gen-1`);
      pollReq2.flush(pollPending);

      expect(service.generating()).toBe(true);

      service.cancelGeneration();
    });

    it('should navigate to /immerse/:id when poll returns PROCESSED', () => {
      const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
      service.generateContent({ contentType: 'TEXT', level: 'b1' });

      const postReq = httpMock.expectOne(`${environment.apiUrl}/immerse/generate`);
      postReq.flush(pendingResponse);

      vi.advanceTimersByTime(2000);
      const pollReq = httpMock.expectOne(`${environment.apiUrl}/immerse/content/gen-1`);
      pollReq.flush(pollProcessed);

      expect(service.generating()).toBe(false);
      expect(navigateSpy).toHaveBeenCalledWith(['/immerse', 'gen-1']);
    });

    it('should set generationError when poll returns FAILED', () => {
      service.generateContent({ contentType: 'TEXT', level: 'b1' });

      const postReq = httpMock.expectOne(`${environment.apiUrl}/immerse/generate`);
      postReq.flush(pendingResponse);

      vi.advanceTimersByTime(2000);
      const pollReq = httpMock.expectOne(`${environment.apiUrl}/immerse/content/gen-1`);
      pollReq.flush(pollFailed);

      expect(service.generationError()).toBe('Content generation failed. Please try again.');
    });

    it('should cancelGeneration and reset all generation signals', () => {
      service.generateContent({ contentType: 'TEXT', level: 'b1' });

      const postReq = httpMock.expectOne(`${environment.apiUrl}/immerse/generate`);
      postReq.flush(pendingResponse);

      expect(service.generating()).toBe(true);

      service.cancelGeneration();

      expect(service.generating()).toBe(false);
      expect(service.generationStep()).toBe('idle');
      expect(service.generationProgress()).toBe(0);
      expect(service.generationError()).toBeNull();
    });

    it('should progress generationStep based on elapsed time', () => {
      service.generateContent({ contentType: 'TEXT', level: 'b1' });

      const postReq = httpMock.expectOne(`${environment.apiUrl}/immerse/generate`);
      postReq.flush(pendingResponse);

      // Advance in 2s increments to flush polls as they arrive
      for (let i = 0; i < 2; i++) {
        vi.advanceTimersByTime(2000);
        httpMock
          .match(`${environment.apiUrl}/immerse/content/gen-1`)
          .filter((r) => !r.cancelled)
          .forEach((r) => r.flush(pollPending));
      }
      // After 4 seconds, step should be 'analyzing' (threshold 3)
      expect(service.generationStep()).toBe('analyzing');

      // Advance to 10s total
      for (let i = 0; i < 3; i++) {
        vi.advanceTimersByTime(2000);
        httpMock
          .match(`${environment.apiUrl}/immerse/content/gen-1`)
          .filter((r) => !r.cancelled)
          .forEach((r) => r.flush(pollPending));
      }
      expect(service.generationStep()).toBe('writing');

      service.cancelGeneration();
    });

    it('should increase generationProgress towards 90 over time', () => {
      service.generateContent({ contentType: 'TEXT', level: 'b1' });

      const postReq = httpMock.expectOne(`${environment.apiUrl}/immerse/generate`);
      postReq.flush(pendingResponse);

      // Advance in 2s increments to flush polls properly
      for (let i = 0; i < 5; i++) {
        vi.advanceTimersByTime(2000);
        httpMock
          .match(`${environment.apiUrl}/immerse/content/gen-1`)
          .filter((r) => !r.cancelled)
          .forEach((r) => r.flush(pollPending));
      }

      expect(service.generationProgress()).toBeGreaterThan(0);
      expect(service.generationProgress()).toBeLessThanOrEqual(90);

      service.cancelGeneration();
    });

    it('should reset generation on reset()', () => {
      service.generateContent({ contentType: 'TEXT', level: 'b1' });

      const postReq = httpMock.expectOne(`${environment.apiUrl}/immerse/generate`);
      postReq.flush(pendingResponse);

      service.reset();

      expect(service.generating()).toBe(false);
      expect(service.generationStep()).toBe('idle');
    });

    it('should not start polling if POST fails', () => {
      service.generateContent({ contentType: 'TEXT', level: 'b1' });

      const postReq = httpMock.expectOne(`${environment.apiUrl}/immerse/generate`);
      postReq.flush(
        { message: 'Service unavailable' },
        { status: 503, statusText: 'Service Unavailable' },
      );

      expect(service.generationError()).toBe('Service unavailable');

      // No polling should start
      vi.advanceTimersByTime(3000);
      httpMock.expectNone(`${environment.apiUrl}/immerse/content`);

      service.cancelGeneration();
    });

    it('should navigate immediately if POST returns PROCESSED', () => {
      const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
      service.generateContent({ contentType: 'TEXT', level: 'b1' });

      const postReq = httpMock.expectOne(`${environment.apiUrl}/immerse/generate`);
      postReq.flush({ id: 'gen-1', status: 'PROCESSED' });

      expect(service.generating()).toBe(false);
      expect(navigateSpy).toHaveBeenCalledWith(['/immerse', 'gen-1']);
    });
  });
});
