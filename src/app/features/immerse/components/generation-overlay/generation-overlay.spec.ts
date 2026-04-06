import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { GenerationOverlay } from './generation-overlay';
import { GENERATION_STEPS } from '../../models/immerse.model';

describe('GenerationOverlay', () => {
  it('should render all steps from GENERATION_STEPS', () => {
    const fixture = TestBed.createComponent(GenerationOverlay);
    fixture.componentRef.setInput('step', 'sending');
    fixture.componentRef.setInput('progress', 10);
    fixture.componentRef.setInput('error', null);
    fixture.detectChanges();

    const stepRows = fixture.nativeElement.querySelectorAll('.step-row');
    expect(stepRows.length).toBe(GENERATION_STEPS.length);

    fixture.destroy();
  });

  it('should mark active step with .active class', () => {
    const fixture = TestBed.createComponent(GenerationOverlay);
    fixture.componentRef.setInput('step', 'writing');
    fixture.componentRef.setInput('progress', 30);
    fixture.componentRef.setInput('error', null);
    fixture.detectChanges();

    const stepRows = fixture.nativeElement.querySelectorAll('.step-row');
    const writingIndex = GENERATION_STEPS.findIndex((s) => s.key === 'writing');
    expect(stepRows[writingIndex].classList.contains('active')).toBe(true);

    fixture.destroy();
  });

  it('should mark completed steps with .done class', () => {
    const fixture = TestBed.createComponent(GenerationOverlay);
    fixture.componentRef.setInput('step', 'writing');
    fixture.componentRef.setInput('progress', 30);
    fixture.componentRef.setInput('error', null);
    fixture.detectChanges();

    const stepRows = fixture.nativeElement.querySelectorAll('.step-row');
    const writingIndex = GENERATION_STEPS.findIndex((s) => s.key === 'writing');

    for (let i = 0; i < writingIndex; i++) {
      expect(stepRows[i].classList.contains('done')).toBe(true);
    }

    fixture.destroy();
  });

  it('should set progress bar width from input', () => {
    const fixture = TestBed.createComponent(GenerationOverlay);
    fixture.componentRef.setInput('step', 'sending');
    fixture.componentRef.setInput('progress', 45);
    fixture.componentRef.setInput('error', null);
    fixture.detectChanges();

    const fill: HTMLElement = fixture.nativeElement.querySelector('.progress-bar-fill');
    expect(fill.style.width).toBe('45%');

    fixture.destroy();
  });

  it('should emit cancelled when cancel button clicked', () => {
    const fixture = TestBed.createComponent(GenerationOverlay);
    fixture.componentRef.setInput('step', 'sending');
    fixture.componentRef.setInput('progress', 10);
    fixture.componentRef.setInput('error', null);
    fixture.detectChanges();

    const spy = vi.fn();
    fixture.componentInstance.cancelled.subscribe(spy);

    const cancelBtn = fixture.nativeElement.querySelector('.cancel-btn');
    cancelBtn.click();

    expect(spy).toHaveBeenCalled();

    fixture.destroy();
  });

  it('should render error state when error input is non-null', () => {
    const fixture = TestBed.createComponent(GenerationOverlay);
    fixture.componentRef.setInput('step', 'sending');
    fixture.componentRef.setInput('progress', 0);
    fixture.componentRef.setInput('error', 'Something went wrong');
    fixture.detectChanges();

    const errorState = fixture.nativeElement.querySelector('.error-state');
    expect(errorState).not.toBeNull();
    expect(errorState.textContent).toContain('Something went wrong');

    fixture.destroy();
  });

  it('should emit retried when retry button clicked in error state', () => {
    const fixture = TestBed.createComponent(GenerationOverlay);
    fixture.componentRef.setInput('step', 'sending');
    fixture.componentRef.setInput('progress', 0);
    fixture.componentRef.setInput('error', 'Failed');
    fixture.detectChanges();

    const spy = vi.fn();
    fixture.componentInstance.retried.subscribe(spy);

    const retryBtn = fixture.nativeElement.querySelector('.retry-btn');
    retryBtn.click();

    expect(spy).toHaveBeenCalled();

    fixture.destroy();
  });

  it('should increment elapsed time every second', () => {
    vi.useFakeTimers();

    const fixture = TestBed.createComponent(GenerationOverlay);
    fixture.componentRef.setInput('step', 'sending');
    fixture.componentRef.setInput('progress', 10);
    fixture.componentRef.setInput('error', null);
    fixture.detectChanges();

    vi.advanceTimersByTime(3000);
    fixture.detectChanges();

    const elapsed: HTMLElement = fixture.nativeElement.querySelector('.overlay-elapsed');
    expect(elapsed.textContent).toContain('0m 3s');

    fixture.destroy();
    vi.useRealTimers();
  });
});
