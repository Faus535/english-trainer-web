import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import PronunciationMiniConversation from './pronunciation-mini-conversation';
import { PronunciationStateService } from '../../services/pronunciation-state.service';
import { SpeechRecognitionService } from '../../../../shared/services/speech-recognition.service';
import { TtsService } from '../../../../shared/services/tts.service';
import { signal, computed } from '@angular/core';

describe('PronunciationMiniConversation', () => {
  const startSpy = vi.fn();
  const navigateSpy = vi.fn();

  const mockState = {
    miniConvId: signal<string | null>(null),
    miniConvTurns: signal([]),
    miniConvStatus: signal<'idle' | 'starting' | 'evaluating' | 'complete' | 'error'>('idle'),
    currentTurn: signal(null),
    isMiniConvComplete: computed(() => false),
    startMiniConversation: startSpy,
    evaluateTurn: vi.fn(),
    resetMiniConversation: vi.fn(),
  };

  beforeEach(() => {
    startSpy.mockClear();
    navigateSpy.mockClear();
    mockState.miniConvId = signal(null);
    mockState.isMiniConvComplete = computed(() => false);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: PronunciationStateService, useValue: mockState },
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
        {
          provide: TtsService,
          useValue: { speak: vi.fn(), stop: vi.fn(), speaking: signal(false) },
        },
      ],
    });
  });

  it('should show start form when no active session', () => {
    const fixture = TestBed.createComponent(PronunciationMiniConversation);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.start-form')).not.toBeNull();
  });

  it('should call state.startMiniConversation with correct params on start', () => {
    const fixture = TestBed.createComponent(PronunciationMiniConversation);
    fixture.detectChanges();

    const component = fixture.componentInstance as any;
    component.startForm.setValue({ focus: 'vowels', level: 'c1' });
    component.onStart();

    expect(startSpy).toHaveBeenCalledWith('vowels', 'c1');
  });

  it('should navigate to summary when isMiniConvComplete becomes true', async () => {
    const router = TestBed.inject(Router);
    const routerSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    mockState.isMiniConvComplete = computed(() => true);

    const fixture = TestBed.createComponent(PronunciationMiniConversation);
    fixture.detectChanges();

    await fixture.whenStable();
    expect(routerSpy).toHaveBeenCalledWith(['/pronunciation/mini-conversation/summary']);
  });

  it('should call state.evaluateTurn when speech recognition ends with transcript', () => {
    const evaluateSpy = vi.fn();
    mockState.evaluateTurn = evaluateSpy;
    mockState.miniConvId = signal('session-1');

    const speechState = signal<'idle' | 'recording' | 'error'>('recording');
    const transcriptSig = signal('');
    const confidencesSig = signal([{ word: 'hello', confidence: 0.9 }]);

    TestBed.overrideProvider(SpeechRecognitionService, {
      useValue: {
        supported: signal(true),
        state: speechState,
        transcript: transcriptSig,
        wordConfidences: confidencesSig,
        startRecording: vi.fn(),
        stopRecording: vi.fn(),
      },
    });

    const fixture = TestBed.createComponent(PronunciationMiniConversation);
    fixture.detectChanges();

    transcriptSig.set('hello world');
    speechState.set('idle');
    fixture.detectChanges();

    expect(evaluateSpy).toHaveBeenCalledWith('hello world', [{ word: 'hello', confidence: 0.9 }]);
  });
});
