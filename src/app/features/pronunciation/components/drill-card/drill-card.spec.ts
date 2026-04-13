import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DrillCard } from './drill-card';
import { TtsService } from '../../../../shared/services/tts.service';
import { SpeechRecognitionService } from '../../../../shared/services/speech-recognition.service';
import { signal } from '@angular/core';
import { DrillItem, DrillSubmitResponse } from '../../models/pronunciation.model';

const mockDrill: DrillItem = {
  id: 'drill-1',
  phrase: 'The thought was thorough.',
  focus: 'th-sound',
  difficulty: 'MEDIUM',
  cefrLevel: 'b1',
};

const mockScore: DrillSubmitResponse = {
  score: 85,
  feedback: 'Great job!',
  perfectStreak: 2,
};

describe('DrillCard', () => {
  const ttsSpeakSpy = vi.fn();

  beforeEach(() => {
    ttsSpeakSpy.mockClear();

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
        {
          provide: SpeechRecognitionService,
          useValue: {
            supported: signal(true),
            state: signal('idle'),
            transcript: signal(''),
            wordConfidences: signal([]),
            startRecording: vi.fn(),
            stopRecording: vi.fn(),
          },
        },
      ],
    });
  });

  it('should call tts.speak with drill phrase on play click', () => {
    const fixture = TestBed.createComponent(DrillCard);
    fixture.componentRef.setInput('drill', mockDrill);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const playBtn = el.querySelector('.play-btn') as HTMLButtonElement;
    playBtn.click();

    expect(ttsSpeakSpy).toHaveBeenCalledWith(mockDrill.phrase);
  });

  it('should render score animation when scoreResult input is set', () => {
    const fixture = TestBed.createComponent(DrillCard);
    fixture.componentRef.setInput('drill', mockDrill);
    fixture.componentRef.setInput('scoreResult', mockScore);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.score-result')).not.toBeNull();
  });

  it('should show perfect streak badge when perfectStreak > 0', () => {
    const fixture = TestBed.createComponent(DrillCard);
    fixture.componentRef.setInput('drill', mockDrill);
    fixture.componentRef.setInput('scoreResult', mockScore);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const badge = el.querySelector('.streak-badge');
    expect(badge).not.toBeNull();
    expect(badge?.textContent).toContain('2');
  });

  it('should not show streak badge when perfectStreak is 0', () => {
    const fixture = TestBed.createComponent(DrillCard);
    fixture.componentRef.setInput('drill', mockDrill);
    fixture.componentRef.setInput('scoreResult', { ...mockScore, perfectStreak: 0 });
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.streak-badge')).toBeNull();
  });
});
