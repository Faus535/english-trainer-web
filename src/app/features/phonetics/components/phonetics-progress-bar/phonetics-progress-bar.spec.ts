import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { PhoneticsProgressBar } from './phonetics-progress-bar';

describe('PhoneticsProgressBar', () => {
  it('should display correct completed/total text', () => {
    const fixture = TestBed.createComponent(PhoneticsProgressBar);
    fixture.componentRef.setInput('completed', 5);
    fixture.componentRef.setInput('total', 44);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.progress-text')?.textContent).toContain('5/44');
  });

  it('should display correct percentage', () => {
    const fixture = TestBed.createComponent(PhoneticsProgressBar);
    fixture.componentRef.setInput('completed', 10);
    fixture.componentRef.setInput('total', 20);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.progress-percentage')?.textContent).toContain('50%');
  });

  it('should handle zero total', () => {
    const fixture = TestBed.createComponent(PhoneticsProgressBar);
    fixture.componentRef.setInput('completed', 0);
    fixture.componentRef.setInput('total', 0);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.progress-percentage')?.textContent).toContain('0%');
  });
});
