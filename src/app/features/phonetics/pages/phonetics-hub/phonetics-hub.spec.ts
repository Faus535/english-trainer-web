import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { describe, expect, it, beforeEach } from 'vitest';
import { of } from 'rxjs';

import { PhoneticsHub } from './phonetics-hub';
import { PhoneticsApiService } from '../../services/phonetics-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { PhonemeResponse } from '../../models/phonetics.model';

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

const mockPhoneticsApi = {
  getPhonemes: () => of(samplePhonemes),
  getTodayPhoneme: () => of(null),
  getProgress: () => of([]),
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

  it('should show completed count', () => {
    const fixture = TestBed.createComponent(PhoneticsHub);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.page-subtitle')?.textContent).toContain('0/3');
  });

  it('should render filter chips', () => {
    const fixture = TestBed.createComponent(PhoneticsHub);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const chips = el.querySelectorAll('.chip');
    expect(chips.length).toBe(4);
    expect(chips[0].textContent).toContain('Todos');
  });
});
