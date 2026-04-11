import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router, provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ArticleStateService } from './article-state.service';
import { environment } from '../../../core/services/environment';

@Component({ template: '', changeDetection: ChangeDetectionStrategy.OnPush })
class DummyComponent {}

describe('ArticleStateService', () => {
  let service: ArticleStateService;
  let httpMock: HttpTestingController;
  let router: Router;
  const base = `${environment.apiUrl}/article`;

  const readyArticle = {
    id: 'art-1',
    title: 'Test Article',
    topic: 'AI',
    level: 'B2',
    status: 'READY',
    paragraphs: [
      { id: 'p-1', content: 'First paragraph.', orderIndex: 0, speaker: 'AI' },
      { id: 'p-2', content: 'Second paragraph.', orderIndex: 1, speaker: 'USER' },
    ],
    currentParagraphIndex: 0,
    currentQuestionIndex: 0,
  };

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: '**', component: DummyComponent }]),
      ],
    });
    service = TestBed.inject(ArticleStateService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    service.cancelGeneration();
    httpMock.verify();
    vi.useRealTimers();
  });

  it('should start with empty state', () => {
    expect(service.article()).toBeNull();
    expect(service.loading()).toBe(false);
    expect(service.generating()).toBe(false);
    expect(service.generationStep()).toBe('idle');
    expect(service.generationProgress()).toBe(0);
    expect(service.generationError()).toBeNull();
    expect(service.currentParagraphIndex()).toBe(0);
    expect(service.readingComplete()).toBe(false);
  });

  describe('generate()', () => {
    it('should set generating=true and step=sending after POST', () => {
      service.generate({ topic: 'AI', level: 'B2' });

      const req = httpMock.expectOne(`${base}/generate`);
      req.flush({ id: 'art-1', status: 'IN_PROGRESS' });

      expect(service.generating()).toBe(true);
      expect(service.generationStep()).toBe('sending');

      service.cancelGeneration();
    });

    it('should start polling when status is PENDING', () => {
      service.generate({ topic: 'AI', level: 'B2' });

      const postReq = httpMock.expectOne(`${base}/generate`);
      postReq.flush({ id: 'art-1', status: 'PENDING' });

      vi.advanceTimersByTime(2000);
      const pollReq = httpMock.expectOne(`${base}/art-1`);
      pollReq.flush({ ...readyArticle, status: 'PROCESSING' });

      expect(service.generating()).toBe(true);

      service.cancelGeneration();
    });

    it('should navigate to /article/:id when poll returns READY', () => {
      const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
      service.generate({ topic: 'AI', level: 'B2' });

      const postReq = httpMock.expectOne(`${base}/generate`);
      postReq.flush({ id: 'art-1', status: 'IN_PROGRESS' });

      vi.advanceTimersByTime(2000);
      const pollReq = httpMock.expectOne(`${base}/art-1`);
      pollReq.flush(readyArticle);

      expect(service.generating()).toBe(false);
      expect(navigateSpy).toHaveBeenCalledWith(['/article', 'art-1']);
    });

    it('should set generationError when poll returns FAILED', () => {
      service.generate({ topic: 'AI', level: 'B2' });

      const postReq = httpMock.expectOne(`${base}/generate`);
      postReq.flush({ id: 'art-1', status: 'IN_PROGRESS' });

      vi.advanceTimersByTime(2000);
      const pollReq = httpMock.expectOne(`${base}/art-1`);
      pollReq.flush({ ...readyArticle, status: 'FAILED' });

      expect(service.generationError()).toBe('Article generation failed. Please try again.');
    });

    it('should set generationError when POST fails', () => {
      service.generate({ topic: 'AI', level: 'B2' });

      const postReq = httpMock.expectOne(`${base}/generate`);
      postReq.flush(
        { message: 'Server error' },
        { status: 500, statusText: 'Internal Server Error' },
      );

      expect(service.generationError()).toBe('Server error');
    });
  });

  describe('loadArticle()', () => {
    it('should set loading=true then set article signal on success', () => {
      service.loadArticle('art-1');
      expect(service.loading()).toBe(true);

      const req = httpMock.expectOne(`${base}/art-1`);
      req.flush(readyArticle);

      expect(service.loading()).toBe(false);
      expect(service.article()?.id).toBe('art-1');
      expect(service.article()?.title).toBe('Test Article');
    });

    it('should set error on failure', () => {
      service.loadArticle('art-1');

      const req = httpMock.expectOne(`${base}/art-1`);
      req.flush({}, { status: 404, statusText: 'Not Found' });

      expect(service.loading()).toBe(false);
      expect(service.error()).toBe('Could not load article');
    });
  });

  describe('advanceParagraph()', () => {
    beforeEach(() => {
      service.loadArticle('art-1');
      const req = httpMock.expectOne(`${base}/art-1`);
      req.flush(readyArticle);
    });

    it('should increment currentParagraphIndex', () => {
      expect(service.currentParagraphIndex()).toBe(0);
      service.advanceParagraph();
      httpMock
        .expectOne(`${base}/art-1/progress`)
        .flush(null, { status: 204, statusText: 'No Content' });
      expect(service.currentParagraphIndex()).toBe(1);
    });

    it('should set readingComplete when past last paragraph', () => {
      service.advanceParagraph(); // move to index 1
      httpMock
        .expectOne(`${base}/art-1/progress`)
        .flush(null, { status: 204, statusText: 'No Content' });
      service.advanceParagraph(); // past last (2 paragraphs, index 0 and 1) — no progress call when complete
      expect(service.readingComplete()).toBe(true);
    });
  });

  describe('reset()', () => {
    it('should clear all signals', () => {
      service.loadArticle('art-1');
      const req = httpMock.expectOne(`${base}/art-1`);
      req.flush(readyArticle);

      service.reset();

      expect(service.article()).toBeNull();
      expect(service.currentParagraphIndex()).toBe(0);
      expect(service.readingComplete()).toBe(false);
      expect(service.generating()).toBe(false);
      expect(service.generationError()).toBeNull();
    });
  });
});

describe('ArticleStateService — session recording', () => {
  let service: ArticleStateService;
  let httpMock: HttpTestingController;
  const base = `${environment.apiUrl}/article`;
  const readyArticle = {
    id: 'art-1',
    title: 'Test',
    topic: 'AI',
    level: 'B2',
    status: 'READY',
    paragraphs: [{ id: 'p-1', content: 'First.', orderIndex: 0, speaker: 'AI' }],
    currentParagraphIndex: 0,
    currentQuestionIndex: 0,
  };

  beforeEach(() => {
    sessionStorage.setItem('et_profile_id', 'profile-1');
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([{ path: '**', component: DummyComponent }]),
      ],
    });
    service = TestBed.inject(ArticleStateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    sessionStorage.removeItem('et_profile_id');
    service.cancelGeneration();
    httpMock.verify();
    vi.useRealTimers();
  });

  it('completeReading should call recordSession with ARTICLE module', () => {
    service.loadArticle('art-1');
    httpMock.expectOne(`${base}/art-1`).flush(readyArticle);

    service.completeReading();
    httpMock
      .expectOne(`${base}/art-1/complete`)
      .flush(null, { status: 204, statusText: 'No Content' });
    httpMock.expectOne(`${base}/art-1/questions`).flush([]);

    const sessionReq = httpMock.expectOne(`${environment.apiUrl}/profiles/profile-1/sessions`);
    expect(sessionReq.request.method).toBe('POST');
    expect(sessionReq.request.body.module).toBe('ARTICLE');
    expect(sessionReq.request.body.durationSeconds).toBeGreaterThanOrEqual(1);
    sessionReq.flush(null, { status: 201, statusText: 'Created' });
  });
});
