import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AnalysisPanel } from './analysis-panel';
import { TtsService } from '../../../../shared/services/tts.service';
import { signal } from '@angular/core';
import { PronunciationAnalyzeResponse } from '../../models/pronunciation.model';

const mockResult: PronunciationAnalyzeResponse = {
  text: 'thought',
  ipa: '/θɔːt/',
  syllables: 'thought (1 syllable)',
  stressPattern: 'single syllable',
  tips: ['Use the "th" sound'],
  commonMistakes: ['Pronouncing as "t"'],
  minimalPairs: ['thought/taught', 'thought/taut'],
  exampleSentences: ['I thought about it.'],
};

describe('AnalysisPanel', () => {
  let ttsSpeakSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    ttsSpeakSpy = vi.fn();
    TestBed.configureTestingModule({
      providers: [
        {
          provide: TtsService,
          useValue: {
            speak: ttsSpeakSpy,
            stop: vi.fn(),
            speaking: signal(false),
          },
        },
      ],
    });
  });

  it('should render IPA text', () => {
    const fixture = TestBed.createComponent(AnalysisPanel);
    fixture.componentRef.setInput('result', mockResult);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.ipa-text')?.textContent?.trim()).toBe('/θɔːt/');
  });

  it('should render syllables and stress pattern', () => {
    const fixture = TestBed.createComponent(AnalysisPanel);
    fixture.componentRef.setInput('result', mockResult);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.syllables-chip')?.textContent?.trim()).toBe('thought (1 syllable)');
    expect(el.querySelector('.stress-chip')?.textContent?.trim()).toBe('single syllable');
  });

  it('should render tips list', () => {
    const fixture = TestBed.createComponent(AnalysisPanel);
    fixture.componentRef.setInput('result', mockResult);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const tips = el.querySelectorAll('.tips-list li');
    expect(tips.length).toBeGreaterThan(0);
  });

  it('should render minimal pair pills', () => {
    const fixture = TestBed.createComponent(AnalysisPanel);
    fixture.componentRef.setInput('result', mockResult);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const pills = el.querySelectorAll('.pair-pill');
    expect(pills.length).toBe(2);
  });

  it('should call tts.speak with pair text when pill clicked', () => {
    const fixture = TestBed.createComponent(AnalysisPanel);
    fixture.componentRef.setInput('result', mockResult);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const firstPill = el.querySelector('.pair-pill') as HTMLButtonElement;
    firstPill.click();

    expect(ttsSpeakSpy).toHaveBeenCalledWith('thought/taught');
  });

  it('should render example sentences', () => {
    const fixture = TestBed.createComponent(AnalysisPanel);
    fixture.componentRef.setInput('result', mockResult);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const sentences = el.querySelectorAll('.sentence-item');
    expect(sentences.length).toBe(1);
  });
});
