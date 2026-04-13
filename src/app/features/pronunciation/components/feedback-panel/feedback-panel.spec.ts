import { TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { FeedbackPanel } from './feedback-panel';
import { PronunciationFeedbackResponse } from '../../models/pronunciation.model';

const mockResult: PronunciationFeedbackResponse = {
  score: 72,
  wordFeedback: [
    { word: 'I', recognized: 'I', tip: '', score: 90 },
    { word: 'thought', recognized: 'tot', tip: 'Use th sound', score: 40 },
    { word: 'about', recognized: 'about', tip: '', score: 65 },
  ],
  overallTip: 'Focus on the "th" sound in English.',
};

describe('FeedbackPanel', () => {
  it('should apply score-low class to words with score < 50', () => {
    const fixture = TestBed.createComponent(FeedbackPanel);
    fixture.componentRef.setInput('result', mockResult);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const spans = el.querySelectorAll('.word-span.score-low');
    expect(spans.length).toBe(1);
    expect(spans[0].textContent?.trim()).toBe('thought');
  });

  it('should apply score-mid class to words with score 50–79', () => {
    const fixture = TestBed.createComponent(FeedbackPanel);
    fixture.componentRef.setInput('result', mockResult);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const spans = el.querySelectorAll('.word-span.score-mid');
    expect(spans.length).toBe(1);
    expect(spans[0].textContent?.trim()).toBe('about');
  });

  it('should apply score-ok class to words with score >= 80', () => {
    const fixture = TestBed.createComponent(FeedbackPanel);
    fixture.componentRef.setInput('result', mockResult);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const spans = el.querySelectorAll('.word-span.score-ok');
    expect(spans.length).toBe(1);
    expect(spans[0].textContent?.trim()).toBe('I');
  });

  it('should render overallTip text', () => {
    const fixture = TestBed.createComponent(FeedbackPanel);
    fixture.componentRef.setInput('result', mockResult);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.overall-tip')?.textContent?.trim()).toBe(
      'Focus on the "th" sound in English.',
    );
  });

  it('should pass correct value to progress ring', () => {
    const fixture = TestBed.createComponent(FeedbackPanel);
    fixture.componentRef.setInput('result', mockResult);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const ring = el.querySelector('app-progress-ring');
    expect(ring).not.toBeNull();
    expect(el.querySelector('.score-number')?.textContent).toContain('72');
  });
});
