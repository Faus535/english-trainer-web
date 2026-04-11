import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal, computed } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ArticleQuestions } from './article-questions';
import { ArticleStateService } from '../../services/article-state.service';
import {
  ArticleResponse,
  ArticleQuestion,
  SavedWord,
  QuestionAnswer,
  AnswerResult,
} from '../../models/article.model';

const mockArticle: ArticleResponse = {
  id: 'art-1',
  title: 'Test',
  topic: 'AI',
  level: 'B2',
  status: 'READY',
  paragraphs: [],
  currentParagraphIndex: 0,
  currentQuestionIndex: 0,
};

const mockQuestions: ArticleQuestion[] = [
  { id: 'q-1', questionText: 'Question 1?', orderIndex: 0, minWords: 40, answered: false },
  { id: 'q-2', questionText: 'Question 2?', orderIndex: 1, minWords: 40, answered: false },
];

const mockResult: AnswerResult = {
  isContentCorrect: true,
  grammarFeedback: 'Good.',
  styleFeedback: 'Good.',
  correctionSummary: 'Well done!',
};

describe('ArticleQuestions', () => {
  const questionsSignal = signal<ArticleQuestion[]>([]);
  const answersSignal = signal<QuestionAnswer[]>([]);
  const currentQuestionIndexSignal = signal(0);

  const mockState = {
    article: signal<ArticleResponse | null>(mockArticle),
    questions: questionsSignal,
    answers: answersSignal,
    currentQuestionIndex: currentQuestionIndexSignal,
    currentQuestion: computed(() => questionsSignal()[currentQuestionIndexSignal()] ?? null),
    qaComplete: signal(false),
    activeHint: signal<string | null>(null),
    savedWords: signal<SavedWord[]>([]),
    allQuestionsAnswered: computed(
      () => answersSignal().length >= questionsSignal().length && questionsSignal().length > 0,
    ),
    loadQuestions: vi.fn(),
    submitAnswer: vi.fn(),
    loadHint: vi.fn(),
    advanceQuestion: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    questionsSignal.set([]);
    answersSignal.set([]);
    currentQuestionIndexSignal.set(0);
    mockState.qaComplete.set(false);
    mockState.activeHint.set(null);

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: ArticleStateService, useValue: mockState }],
    });
  });

  it('should call loadQuestions() on init if questions are empty', () => {
    TestBed.createComponent(ArticleQuestions);
    // No articleId from route in test, so loadQuestions not called
    expect(mockState.loadQuestions).not.toHaveBeenCalled();
  });

  it('should call state.submitAnswer() when onAnswerSubmitted() is invoked', () => {
    questionsSignal.set(mockQuestions);
    const fixture = TestBed.createComponent(ArticleQuestions);
    fixture.detectChanges();

    fixture.componentInstance['onAnswerSubmitted']('My long answer here...');

    expect(mockState.submitAnswer).toHaveBeenCalledWith('', 'q-1', 'My long answer here...');
  });

  it('should call state.loadHint() when onHintRequested() is invoked', () => {
    questionsSignal.set(mockQuestions);
    const fixture = TestBed.createComponent(ArticleQuestions);
    fixture.detectChanges();

    fixture.componentInstance['onHintRequested']();

    expect(mockState.loadHint).toHaveBeenCalledWith('', 'q-1');
  });

  it('should call state.advanceQuestion() when onNextQuestion() is invoked', () => {
    questionsSignal.set(mockQuestions);
    const fixture = TestBed.createComponent(ArticleQuestions);
    fixture.detectChanges();

    fixture.componentInstance['onNextQuestion']();

    expect(mockState.advanceQuestion).toHaveBeenCalledOnce();
  });

  it('should show summary when qaComplete is true', () => {
    mockState.qaComplete.set(true);
    const fixture = TestBed.createComponent(ArticleQuestions);
    fixture.detectChanges();

    const summary = fixture.nativeElement.querySelector('app-article-summary');
    expect(summary).not.toBeNull();
  });

  it('should compute currentResult correctly for the current question', () => {
    questionsSignal.set(mockQuestions);
    answersSignal.set([{ questionId: 'q-1', result: mockResult }]);
    const fixture = TestBed.createComponent(ArticleQuestions);
    fixture.detectChanges();

    expect(fixture.componentInstance['currentResult']()).toEqual(mockResult);
  });

  it('should return null currentResult for unanswered question', () => {
    questionsSignal.set(mockQuestions);
    const fixture = TestBed.createComponent(ArticleQuestions);
    fixture.detectChanges();

    expect(fixture.componentInstance['currentResult']()).toBeNull();
  });
});
