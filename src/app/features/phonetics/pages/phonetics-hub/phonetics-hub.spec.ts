import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { describe, expect, it, beforeEach } from 'vitest';
import { of } from 'rxjs';

import { PhoneticsHub } from './phonetics-hub';
import { PhoneticsApiService } from '../../services/phonetics-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PhonemeResponse, PhonemeProgressItem } from '../../models/phonetics.model';

const samplePhonemes: PhonemeResponse[] = [
  {
    id: '1',
    symbol: '/iː/',
    name: 'Long E',
    category: 'vowel',
    subcategory: 'long_vowel',
    exampleWords: ['see'],
    description: 'A long vowel',
  },
  {
    id: '2',
    symbol: '/æ/',
    name: 'Short A',
    category: 'vowel',
    subcategory: 'short_vowel',
    exampleWords: ['cat'],
    description: 'A short vowel',
  },
  {
    id: '3',
    symbol: '/θ/',
    name: 'Voiceless TH',
    category: 'consonant',
    subcategory: 'fricative',
    exampleWords: ['think'],
    description: 'A fricative',
  },
];

const sampleProgress: PhonemeProgressItem[] = [
  {
    phonemeId: '1',
    symbol: '/iː/',
    name: 'Long E',
    category: 'vowel',
    difficultyOrder: 1,
    completed: true,
    completedAt: '2026-03-28T10:00:00Z',
  },
  {
    phonemeId: '2',
    symbol: '/æ/',
    name: 'Short A',
    category: 'vowel',
    difficultyOrder: 2,
    completed: false,
    completedAt: null,
  },
  {
    phonemeId: '3',
    symbol: '/θ/',
    name: 'Voiceless TH',
    category: 'consonant',
    difficultyOrder: 3,
    completed: false,
    completedAt: null,
  },
];

const mockPhoneticsApi = {
  getPhonemes: () => of(samplePhonemes),
  getProgress: () => of(sampleProgress),
  getTodayPhoneme: () => of(null),
};

const mockAuth = {
  profileId: signal('profile-1'),
  isAuthenticated: signal(true),
  token: signal('token'),
};

describe('PhoneticsHub', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: PhoneticsApiService, useValue: mockPhoneticsApi },
        { provide: AuthService, useValue: mockAuth },
      ],
    });
  });

  it('should create and show page title', () => {
    const fixture = TestBed.createComponent(PhoneticsHub);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(fixture.componentInstance).toBeTruthy();
    expect(el.querySelector('.page-title')?.textContent).toContain('Fonetica');
  });

  it('should render phoneme cards after loading', () => {
    const fixture = TestBed.createComponent(PhoneticsHub);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const cards = el.querySelectorAll('app-phoneme-card');
    expect(cards.length).toBe(3);
  });

  it('should show progress bar with correct counts', () => {
    const fixture = TestBed.createComponent(PhoneticsHub);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const progressBar = el.querySelector('app-phonetics-progress-bar');
    expect(progressBar).toBeTruthy();
  });

  it('should show next phoneme banner for first incomplete phoneme', () => {
    const fixture = TestBed.createComponent(PhoneticsHub);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const banner = el.querySelector('app-next-phoneme-banner');
    expect(banner).toBeTruthy();
  });

  it('should not show filter chips (removed)', () => {
    const fixture = TestBed.createComponent(PhoneticsHub);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const chips = el.querySelectorAll('.chip');
    expect(chips.length).toBe(0);
  });
});
