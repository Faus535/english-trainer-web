import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';

import { PhoneticsCompletion } from './phonetics-completion';

describe('PhoneticsCompletion', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
  });

  it('should display completion message', () => {
    const fixture = TestBed.createComponent(PhoneticsCompletion);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.completion-title')?.textContent).toContain('completados');
  });

  it('should have review and back links', () => {
    const fixture = TestBed.createComponent(PhoneticsCompletion);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const links = el.querySelectorAll('a');
    const hrefs = Array.from(links).map((a) => a.getAttribute('href'));
    expect(hrefs).toContain('/phonetics');
    expect(hrefs).toContain('/speak');
  });
});
