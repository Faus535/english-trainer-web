import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ArticleApiService } from './article-api.service';
import { environment } from '../../../core/services/environment';

describe('ArticleApiService', () => {
  let service: ArticleApiService;
  let httpMock: HttpTestingController;
  const base = `${environment.apiUrl}/article`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ArticleApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('generate() should POST to /article/generate with body', () => {
    service.generate({ topic: 'AI', level: 'B2' }).subscribe();

    const req = httpMock.expectOne(`${base}/generate`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ topic: 'AI', level: 'B2' });
    req.flush({ id: 'art-1', status: 'IN_PROGRESS' });
  });

  it('getArticle() should GET /article/:id', () => {
    service.getArticle('art-1').subscribe();

    const req = httpMock.expectOne(`${base}/art-1`);
    expect(req.request.method).toBe('GET');
    req.flush({
      id: 'art-1',
      title: 'Test',
      topic: 'AI',
      level: 'B2',
      status: 'READY',
      paragraphs: [],
    });
  });

  it('completeArticle() should POST to /article/:id/complete with null body', () => {
    service.completeArticle('art-1').subscribe();

    const req = httpMock.expectOne(`${base}/art-1/complete`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toBeNull();
    req.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('saveWord() should POST to /article/:id/words with body', () => {
    service
      .saveWord('art-1', {
        wordOrPhrase: 'unprecedented',
        contextSentence: 'An unprecedented event.',
      })
      .subscribe();

    const req = httpMock.expectOne(`${base}/art-1/words`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      wordOrPhrase: 'unprecedented',
      contextSentence: 'An unprecedented event.',
    });
    req.flush({
      id: 'w-1',
      wordOrPhrase: 'unprecedented',
      translation: 'sin precedentes',
      contextSentence: 'An unprecedented event.',
    });
  });

  it('getWords() should GET /article/:id/words', () => {
    service.getWords('art-1').subscribe();

    const req = httpMock.expectOne(`${base}/art-1/words`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('getQuestions() should GET /article/:id/questions', () => {
    service.getQuestions('art-1').subscribe();

    const req = httpMock.expectOne(`${base}/art-1/questions`);
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });

  it('submitAnswer() should POST to /article/:id/questions/:qId/answer', () => {
    service.submitAnswer('art-1', 'q-1', { answer: 'My answer here.' }).subscribe();

    const req = httpMock.expectOne(`${base}/art-1/questions/q-1/answer`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ answer: 'My answer here.' });
    req.flush({
      isContentCorrect: true,
      grammarFeedback: 'Good',
      styleFeedback: 'Good',
      correctionSummary: 'Well done',
    });
  });

  it('getHint() should GET /article/:id/questions/:qId/hint', () => {
    service.getHint('art-1', 'q-1').subscribe();

    const req = httpMock.expectOne(`${base}/art-1/questions/q-1/hint`);
    expect(req.request.method).toBe('GET');
    req.flush({ hint: 'Think about paragraph 2.' });
  });
});
