import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, beforeEach } from 'vitest';
import { ImmerseStateService } from './immerse-state.service';
import { environment } from '../../../core/services/environment';
import { VocabEntry } from '../models/immerse.model';

describe('ImmerseStateService', () => {
  let service: ImmerseStateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    service = TestBed.inject(ImmerseStateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should start with empty state', () => {
    expect(service.content()).toBeNull();
    expect(service.loading()).toBe(false);
    expect(service.capturedVocab()).toEqual([]);
    expect(service.exercises()).toEqual([]);
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
});
