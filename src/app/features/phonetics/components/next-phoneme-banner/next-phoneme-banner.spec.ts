import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { NextPhonemeBanner } from './next-phoneme-banner';

describe('NextPhonemeBanner', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
  });

  it('should display phoneme symbol and name', () => {
    const fixture = TestBed.createComponent(NextPhonemeBanner);
    fixture.componentRef.setInput('phoneme', {
      phonemeId: '1',
      symbol: '/iː/',
      name: 'Long E',
      category: 'vowel',
      difficultyOrder: 1,
      completed: false,
      completedAt: null,
    });
    fixture.componentRef.setInput('position', 3);
    fixture.componentRef.setInput('total', 44);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.next-symbol')?.textContent?.trim()).toBe('/iː/');
    expect(el.querySelector('.next-name')?.textContent?.trim()).toBe('Long E');
    expect(el.querySelector('.next-position')?.textContent).toContain('3 de 44');
  });

  it('should link to phoneme detail', () => {
    const fixture = TestBed.createComponent(NextPhonemeBanner);
    fixture.componentRef.setInput('phoneme', {
      phonemeId: 'abc',
      symbol: '/θ/',
      name: 'TH',
      category: 'consonant',
      difficultyOrder: 5,
      completed: false,
      completedAt: null,
    });
    fixture.componentRef.setInput('position', 1);
    fixture.componentRef.setInput('total', 10);
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('.next-banner') as HTMLAnchorElement;
    expect(link.getAttribute('href')).toBe('/phonetics/abc');
  });
});
