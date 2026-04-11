import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';
import { ArticleSummary } from './article-summary';
import {
  ArticleResponse,
  SavedWord,
  QuestionAnswer,
  AnswerResult,
} from '../../models/article.model';

const mockArticle: ArticleResponse = {
  id: 'art-1',
  title: 'Test Article',
  topic: 'AI',
  level: 'B2',
  status: 'READY',
  paragraphs: [],
  currentParagraphIndex: 0,
  currentQuestionIndex: 0,
};

const correctResult: AnswerResult = {
  isContentCorrect: true,
  grammarFeedback: 'Good.',
  styleFeedback: 'Clear.',
  correctionSummary: 'Well done!',
};

const incorrectResult: AnswerResult = {
  isContentCorrect: false,
  grammarFeedback: 'Needs work.',
  styleFeedback: 'Unclear.',
  correctionSummary: 'Try again.',
};

const nullEnrichment = {
  definition: null,
  phonetics: null,
  synonyms: null,
  exampleSentence: null,
  partOfSpeech: null,
};

const mockWords: SavedWord[] = [
  {
    id: 'w-1',
    wordOrPhrase: 'resilience',
    translation: 'resiliencia',
    englishDefinition: 'The ability to recover quickly.',
    contextSentence: 'Context.',
    ...nullEnrichment,
  },
  {
    id: 'w-2',
    wordOrPhrase: 'unprecedented',
    translation: 'sin precedentes',
    englishDefinition: 'Never done before.',
    contextSentence: 'Context.',
    ...nullEnrichment,
  },
  {
    id: 'w-3',
    wordOrPhrase: 'sustainable',
    translation: 'sostenible',
    englishDefinition: 'Able to be maintained.',
    contextSentence: 'Context.',
    ...nullEnrichment,
  },
];

const mockAnswers: QuestionAnswer[] = [
  { questionId: 'q-1', result: correctResult },
  { questionId: 'q-2', result: correctResult },
  { questionId: 'q-3', result: incorrectResult },
];

describe('ArticleSummary', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
  });

  it('should display correct/total question stats', () => {
    const fixture = TestBed.createComponent(ArticleSummary);
    fixture.componentRef.setInput('article', mockArticle);
    fixture.componentRef.setInput('savedWords', mockWords);
    fixture.componentRef.setInput('answers', mockAnswers);
    fixture.componentRef.setInput('totalQuestions', 5);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('2');
    expect(el.textContent).toContain('of 5 correct');
  });

  it('should display word count', () => {
    const fixture = TestBed.createComponent(ArticleSummary);
    fixture.componentRef.setInput('article', mockArticle);
    fixture.componentRef.setInput('savedWords', mockWords);
    fixture.componentRef.setInput('answers', mockAnswers);
    fixture.componentRef.setInput('totalQuestions', 5);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('3');
    expect(el.textContent).toContain('words saved');
  });

  it('should calculate XP breakdown correctly: 25 + (5 x correct) + (2 x words)', () => {
    const fixture = TestBed.createComponent(ArticleSummary);
    fixture.componentRef.setInput('article', mockArticle);
    fixture.componentRef.setInput('savedWords', mockWords);
    fixture.componentRef.setInput('answers', mockAnswers);
    fixture.componentRef.setInput('totalQuestions', 5);
    fixture.detectChanges();

    const stats = fixture.componentInstance['summaryStats']();

    expect(stats.xpBreakdown.baseXp).toBe(25);
    expect(stats.xpBreakdown.correctAnswerXp).toBe(10); // 2 correct * 5
    expect(stats.xpBreakdown.markedWordsXp).toBe(6); // 3 words * 2
    expect(stats.xpBreakdown.totalXp).toBe(41); // 25 + 10 + 6
  });

  it('should render all XP breakdown values in the template', () => {
    const fixture = TestBed.createComponent(ArticleSummary);
    fixture.componentRef.setInput('article', mockArticle);
    fixture.componentRef.setInput('savedWords', mockWords);
    fixture.componentRef.setInput('answers', mockAnswers);
    fixture.componentRef.setInput('totalQuestions', 5);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('25 XP');
    expect(el.textContent).toContain('10 XP');
    expect(el.textContent).toContain('6 XP');
    expect(el.textContent).toContain('41 XP');
  });

  it('should render saved words list', () => {
    const fixture = TestBed.createComponent(ArticleSummary);
    fixture.componentRef.setInput('article', mockArticle);
    fixture.componentRef.setInput('savedWords', mockWords);
    fixture.componentRef.setInput('answers', []);
    fixture.componentRef.setInput('totalQuestions', 0);
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.saved-item');
    expect(items.length).toBe(3);
    expect(items[0].textContent).toContain('resilience');
  });

  it('should not render saved words section when empty', () => {
    const fixture = TestBed.createComponent(ArticleSummary);
    fixture.componentRef.setInput('article', mockArticle);
    fixture.componentRef.setInput('savedWords', []);
    fixture.componentRef.setInput('answers', []);
    fixture.componentRef.setInput('totalQuestions', 0);
    fixture.detectChanges();

    const section = fixture.nativeElement.querySelector('.saved-section');
    expect(section).toBeNull();
  });
});
