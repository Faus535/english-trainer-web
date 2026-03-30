import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';

import { PracticeCompletion } from './practice-completion';

describe('PracticeCompletion', () => {
  it('should render stats correctly', () => {
    const fixture = TestBed.createComponent(PracticeCompletion);
    fixture.componentRef.setInput('phonemeName', 'Long E');
    fixture.componentRef.setInput('phonemeSymbol', '/iː/');
    fixture.componentRef.setInput('totalPhrases', 3);
    fixture.componentRef.setInput('passedCount', 2);
    fixture.componentRef.setInput('results', [
      { phrase: 'She sees the sea', passed: true, score: 85 },
      { phrase: 'Keep reading', passed: true, score: 72 },
      { phrase: 'We need to leave', passed: false, score: 45 },
    ]);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.completion-symbol')?.textContent?.trim()).toBe('/iː/');
    expect(el.querySelector('.completion-subtitle')?.textContent).toContain('Long E');

    const statValues = el.querySelectorAll('.stat-value');
    expect(statValues[0].textContent?.trim()).toBe('2');
    expect(statValues[1].textContent?.trim()).toBe('3');
  });

  it('should render result rows', () => {
    const fixture = TestBed.createComponent(PracticeCompletion);
    fixture.componentRef.setInput('phonemeName', 'Long E');
    fixture.componentRef.setInput('phonemeSymbol', '/iː/');
    fixture.componentRef.setInput('totalPhrases', 2);
    fixture.componentRef.setInput('passedCount', 1);
    fixture.componentRef.setInput('results', [
      { phrase: 'She sees', passed: true, score: 90 },
      { phrase: 'Keep reading', passed: false, score: 40 },
    ]);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const rows = el.querySelectorAll('.result-row');
    expect(rows.length).toBe(2);
    expect(rows[0].classList.contains('result-row--pass')).toBe(true);
    expect(rows[1].classList.contains('result-row--fail')).toBe(true);
  });

  it('should emit retry event', () => {
    const fixture = TestBed.createComponent(PracticeCompletion);
    fixture.componentRef.setInput('phonemeName', 'Long E');
    fixture.componentRef.setInput('phonemeSymbol', '/iː/');
    fixture.componentRef.setInput('totalPhrases', 1);
    fixture.componentRef.setInput('passedCount', 0);
    fixture.componentRef.setInput('results', [{ phrase: 'test', passed: false, score: 30 }]);
    fixture.detectChanges();

    const spy = vi.fn();
    fixture.componentInstance.retry.subscribe(spy);

    const retryBtn = fixture.nativeElement.querySelector('.btn-secondary') as HTMLButtonElement;
    retryBtn.click();
    expect(spy).toHaveBeenCalled();
  });
});
