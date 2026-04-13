import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import PronunciationLab from './pronunciation-lab';
import { PronunciationStateService } from '../../services/pronunciation-state.service';
import { TtsService } from '../../../../shared/services/tts.service';
import { signal, computed } from '@angular/core';

describe('PronunciationLab', () => {
  const analyzeSpy = vi.fn();
  const speakSpy = vi.fn();

  const mockState = {
    analyze: analyzeSpy,
    analysisResult: signal(null),
    isAnalyzing: computed(() => false),
    analysisError: computed(() => false),
    feedbackResult: signal(null),
    isFeedbackLoading: computed(() => false),
    feedbackError: computed(() => false),
    submitFeedback: vi.fn(),
  };

  const mockTts = {
    speak: speakSpy,
    stop: vi.fn(),
    speaking: signal(false),
  };

  beforeEach(() => {
    analyzeSpy.mockClear();
    speakSpy.mockClear();

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: PronunciationStateService, useValue: mockState },
        { provide: TtsService, useValue: mockTts },
      ],
    });
  });

  it('should call state.analyze() on form submit with valid input', () => {
    const fixture = TestBed.createComponent(PronunciationLab);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const input = el.querySelector('.text-input') as HTMLInputElement;
    input.value = 'thought';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const component = fixture.componentInstance as any;
    component.form.setValue({ text: 'thought', level: 'b1' });
    fixture.detectChanges();

    const form = el.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));

    expect(analyzeSpy).toHaveBeenCalledWith('thought', 'b1');
  });

  it('should not show analysis panel when result is null', () => {
    const fixture = TestBed.createComponent(PronunciationLab);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-analysis-panel')).toBeNull();
  });

  it('should show analysis panel when result is non-null', () => {
    const result = {
      text: 'thought',
      ipa: '/θɔːt/',
      syllables: '1',
      stressPattern: 'single',
      tips: [],
      commonMistakes: [],
      minimalPairs: [],
      exampleSentences: [],
    };
    mockState.analysisResult = signal(result) as any;

    const fixture = TestBed.createComponent(PronunciationLab);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-analysis-panel')).not.toBeNull();
  });
});
