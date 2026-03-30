import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { PracticeProgressBar } from './practice-progress-bar';

describe('PracticeProgressBar', () => {
  it('should render correct number of segments', () => {
    const fixture = TestBed.createComponent(PracticeProgressBar);
    fixture.componentRef.setInput('current', 1);
    fixture.componentRef.setInput('total', 5);
    fixture.componentRef.setInput('results', new Map([[0, true]]));
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const dots = el.querySelectorAll('.progress-dot');
    expect(dots.length).toBe(5);
  });

  it('should show progress label', () => {
    const fixture = TestBed.createComponent(PracticeProgressBar);
    fixture.componentRef.setInput('current', 2);
    fixture.componentRef.setInput('total', 5);
    fixture.componentRef.setInput('results', new Map());
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.progress-label')?.textContent?.trim()).toBe('3 / 5');
  });

  it('should mark pass and fail dots correctly', () => {
    const results = new Map<number, boolean>([
      [0, true],
      [1, false],
    ]);
    const fixture = TestBed.createComponent(PracticeProgressBar);
    fixture.componentRef.setInput('current', 2);
    fixture.componentRef.setInput('total', 4);
    fixture.componentRef.setInput('results', results);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const dots = el.querySelectorAll('.progress-dot');
    expect(dots[0].classList.contains('progress-dot--pass')).toBe(true);
    expect(dots[1].classList.contains('progress-dot--fail')).toBe(true);
    expect(dots[2].classList.contains('progress-dot--current')).toBe(true);
  });
});
