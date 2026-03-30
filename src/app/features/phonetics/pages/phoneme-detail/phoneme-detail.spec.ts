import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { describe, expect, it, beforeEach } from 'vitest';
import { of } from 'rxjs';

import { PhonemeDetail } from './phoneme-detail';
import { PhoneticsApiService } from '../../services/phonetics-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SpeechRecognitionService } from '../../../speak/services/speech-recognition.service';
import { TtsService } from '../../../speak/services/tts.service';
import { ActivatedRoute } from '@angular/router';
import { PhonemeDetailResponse, PhraseResponse } from '../../models/phonetics.model';

const samplePhoneme: PhonemeDetailResponse = {
  id: 'p1',
  symbol: '/iː/',
  name: 'Long E',
  category: 'vowel',
  subcategory: 'long_vowel',
  exampleWords: ['see', 'beach'],
  description: 'A long, high-front vowel',
  mouthPosition: 'Spread lips, tongue high',
  tips: ['Think of smiling wide'],
};

const samplePhrases: PhraseResponse[] = [
  {
    id: 'ph1',
    text: 'She sees the sea',
    difficulty: 'easy',
    targetWords: ['see', 'sea'],
    phonemeId: 'p1',
  },
  {
    id: 'ph2',
    text: 'Keep reading please',
    difficulty: 'medium',
    targetWords: ['keep', 'reading'],
    phonemeId: 'p1',
  },
  {
    id: 'ph3',
    text: 'We need to leave',
    difficulty: 'hard',
    targetWords: ['need', 'leave'],
    phonemeId: 'p1',
  },
];

const mockPhoneticsApi = {
  getPhonemeDetail: () => of(samplePhoneme),
  getPhrases: () => of(samplePhrases),
  submitAttempt: () =>
    of({ id: 'a1', score: 85, passed: true, phraseId: 'ph1', phonemeId: 'p1', createdAt: '' }),
  completePhoneme: () => of({ phonemeId: 'p1', completed: true, completedAt: '' }),
};

const mockAuth = {
  profileId: signal('profile-1'),
  isAuthenticated: signal(true),
  token: signal('token'),
};

const mockSpeechRecognition = {
  supported: signal(true),
  state: signal('idle' as const),
  result: signal(null),
  startRecording: () => {},
  stopRecording: () => {},
  reset: () => {},
};

const mockTts = {
  speak: () => {},
  stop: () => {},
  speaking: signal(false),
};

describe('PhonemeDetail', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: PhoneticsApiService, useValue: mockPhoneticsApi },
        { provide: AuthService, useValue: mockAuth },
        { provide: SpeechRecognitionService, useValue: mockSpeechRecognition },
        { provide: TtsService, useValue: mockTts },
        { provide: ActivatedRoute, useValue: { params: of({ id: 'p1' }) } },
      ],
    });
  });

  it('should create and show phoneme info', () => {
    const fixture = TestBed.createComponent(PhonemeDetail);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(fixture.componentInstance).toBeTruthy();
    expect(el.querySelector('.page-title')?.textContent).toContain('Long E');
  });

  it('should render symbol, description, and mouth position', () => {
    const fixture = TestBed.createComponent(PhonemeDetail);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.symbol-large')?.textContent?.trim()).toBe('/iː/');
    expect(el.querySelector('.phoneme-description')?.textContent).toContain('high-front vowel');
    expect(el.querySelector('.info-text')?.textContent).toContain('Spread lips');
  });

  it('should render example words with TTS buttons', () => {
    const fixture = TestBed.createComponent(PhonemeDetail);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const wordBtns = el.querySelectorAll('.example-word-btn');
    expect(wordBtns.length).toBe(2);
    expect(wordBtns[0].textContent).toContain('see');
  });

  it('should render tips list', () => {
    const fixture = TestBed.createComponent(PhonemeDetail);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const tips = el.querySelectorAll('.tips-list li');
    expect(tips.length).toBe(1);
    expect(tips[0].textContent).toContain('smiling wide');
  });

  it('should show start practice button with phrase count', () => {
    const fixture = TestBed.createComponent(PhonemeDetail);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const btn = el.querySelector('.btn-start') as HTMLButtonElement;
    expect(btn).toBeTruthy();
    expect(btn.textContent).toContain('3 frases');
    expect(btn.disabled).toBe(false);
  });
});
