import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import PronunciationDrills from './pronunciation-drills';
import { PronunciationStateService } from '../../services/pronunciation-state.service';
import { SpeechRecognitionService } from '../../../../shared/services/speech-recognition.service';
import { TtsService } from '../../../../shared/services/tts.service';
import { signal, computed } from '@angular/core';
import { DrillItem } from '../../models/pronunciation.model';

const mockDrill: DrillItem = {
  id: 'drill-1',
  phrase: 'The thought was thorough.',
  focus: 'th-sound',
  difficulty: 'MEDIUM',
  cefrLevel: 'b1',
};

describe('PronunciationDrills', () => {
  const loadDrillsSpy = vi.fn();

  const mockState = {
    loadDrills: loadDrillsSpy,
    submitDrillAttempt: vi.fn(),
    drillLevel: signal('b1'),
    drillFocus: signal(null),
    currentDrill: signal(mockDrill),
    drillsComplete: computed(() => false),
    isDrillLoading: computed(() => false),
    isDrillSubmitting: computed(() => false),
    drillProgress: computed(() => ({ current: 1, total: 3 })),
    drillScoreFor: vi.fn().mockReturnValue(null),
  };

  beforeEach(() => {
    loadDrillsSpy.mockClear();

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

  it('should call state.loadDrills on ngOnInit', () => {
    const fixture = TestBed.createComponent(PronunciationDrills);
    fixture.detectChanges();

    expect(loadDrillsSpy).toHaveBeenCalledWith('b1', undefined);
  });

  it('should call state.loadDrills with new params on filter change', () => {
    const fixture = TestBed.createComponent(PronunciationDrills);
    fixture.detectChanges();
    loadDrillsSpy.mockClear();

    const component = fixture.componentInstance as any;
    component.onFilterChange({ level: 'c1', focus: 'th-sound' });

    expect(loadDrillsSpy).toHaveBeenCalledWith('c1', 'th-sound');
  });

  it('should show completion summary when drillsComplete is true', () => {
    mockState.drillsComplete = computed(() => true);
    mockState.currentDrill = signal(null) as any;

    const fixture = TestBed.createComponent(PronunciationDrills);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.completion-summary')).not.toBeNull();

    mockState.drillsComplete = computed(() => false);
    mockState.currentDrill = signal(mockDrill);
  });
});
