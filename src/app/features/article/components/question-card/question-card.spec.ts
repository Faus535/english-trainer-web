import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QuestionCard } from './question-card';
import { ArticleQuestion, AnswerResult } from '../../models/article.model';

const mockQuestion: ArticleQuestion = {
  id: 'q-1',
  questionText: 'What is the main argument of the article?',
  orderIndex: 0,
  minWords: 40,
  answered: false,
};

describe('QuestionCard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should show word count updating as user types', () => {
    const fixture = TestBed.createComponent(QuestionCard);
    fixture.componentRef.setInput('question', mockQuestion);
    fixture.detectChanges();

    expect(fixture.componentInstance['wordCount']()).toBe(0);

    fixture.componentInstance['answerCtrl'].setValue('one two three');
    fixture.detectChanges();

    expect(fixture.componentInstance['wordCount']()).toBe(3);
  });

  it('should disable Submit button when word count is below minWords', () => {
    const fixture = TestBed.createComponent(QuestionCard);
    fixture.componentRef.setInput('question', mockQuestion);
    fixture.detectChanges();

    fixture.componentInstance['answerCtrl'].setValue('too short');
    fixture.detectChanges();

    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.submit-btn');
    expect(btn.disabled).toBe(true);
  });

  it('should enable Submit button when word count meets minWords', () => {
    const fixture = TestBed.createComponent(QuestionCard);
    fixture.componentRef.setInput('question', mockQuestion);
    fixture.detectChanges();

    const longAnswer = Array(41).fill('word').join(' ');
    fixture.componentInstance['answerCtrl'].setValue(longAnswer);
    fixture.detectChanges();

    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.submit-btn');
    expect(btn.disabled).toBe(false);
  });

  it('should emit answerSubmitted with trimmed answer when Submit clicked', () => {
    const fixture = TestBed.createComponent(QuestionCard);
    fixture.componentRef.setInput('question', mockQuestion);
    fixture.detectChanges();

    const spy = vi.fn();
    fixture.componentInstance.answerSubmitted.subscribe(spy);

    const longAnswer = Array(41).fill('word').join(' ');
    fixture.componentInstance['answerCtrl'].setValue(longAnswer);
    fixture.detectChanges();

    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.submit-btn');
    btn.click();

    expect(spy).toHaveBeenCalledWith(longAnswer.trim());
  });

  it('should emit hintRequested when Get a hint is clicked', () => {
    const fixture = TestBed.createComponent(QuestionCard);
    fixture.componentRef.setInput('question', mockQuestion);
    fixture.detectChanges();

    const spy = vi.fn();
    fixture.componentInstance.hintRequested.subscribe(spy);

    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.hint-btn');
    btn.click();

    expect(spy).toHaveBeenCalledOnce();
  });

  it('should show hint text when hint input is set', () => {
    const fixture = TestBed.createComponent(QuestionCard);
    fixture.componentRef.setInput('question', mockQuestion);
    fixture.componentRef.setInput('hint', 'Think about paragraph 2.');
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Think about paragraph 2.');
  });

  it('should show correction and hide submit/hint when result is set', () => {
    const result: AnswerResult = {
      isContentCorrect: true,
      grammarFeedback: 'Grammar is good.',
      styleFeedback: 'Style is clear.',
      correctionSummary: 'Well done!',
    };
    const fixture = TestBed.createComponent(QuestionCard);
    fixture.componentRef.setInput('question', mockQuestion);
    fixture.componentRef.setInput('result', result);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Well done!');
    expect(el.textContent).toContain('Grammar is good.');
    expect(el.querySelector('.submit-btn')).toBeNull();
    expect(el.querySelector('.hint-btn')).toBeNull();
    expect(el.querySelector('.next-btn')).not.toBeNull();
  });

  it('should emit nextRequested when Next question is clicked', () => {
    const result: AnswerResult = {
      isContentCorrect: true,
      grammarFeedback: 'Good.',
      styleFeedback: 'Good.',
      correctionSummary: 'Great!',
    };
    const fixture = TestBed.createComponent(QuestionCard);
    fixture.componentRef.setInput('question', mockQuestion);
    fixture.componentRef.setInput('result', result);
    fixture.detectChanges();

    const spy = vi.fn();
    fixture.componentInstance.nextRequested.subscribe(spy);

    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.next-btn');
    btn.click();

    expect(spy).toHaveBeenCalledOnce();
  });
});
