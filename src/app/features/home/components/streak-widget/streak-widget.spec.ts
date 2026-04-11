import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { StreakWidget } from './streak-widget';

describe('StreakWidget', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should render 7 day dots', () => {
    const fixture = TestBed.createComponent(StreakWidget);
    fixture.componentRef.setInput('streakDays', 3);
    fixture.componentRef.setInput('weeklyActivity', [true, true, true, false, false, false, false]);
    fixture.detectChanges();

    const dots = fixture.nativeElement.querySelectorAll('.dot');
    expect(dots.length).toBe(7);
  });

  it('should fill teal dots for active days', () => {
    const fixture = TestBed.createComponent(StreakWidget);
    fixture.componentRef.setInput('streakDays', 2);
    fixture.componentRef.setInput('weeklyActivity', [
      true,
      true,
      false,
      false,
      false,
      false,
      false,
    ]);
    fixture.detectChanges();

    const dots = fixture.nativeElement.querySelectorAll('.dot') as NodeListOf<HTMLElement>;
    expect(dots[0].classList.contains('dot--active')).toBe(true);
    expect(dots[1].classList.contains('dot--active')).toBe(true);
    expect(dots[2].classList.contains('dot--active')).toBe(false);
  });

  it('should display streak count', () => {
    const fixture = TestBed.createComponent(StreakWidget);
    fixture.componentRef.setInput('streakDays', 5);
    fixture.componentRef.setInput('weeklyActivity', [
      false,
      false,
      false,
      false,
      false,
      true,
      true,
    ]);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.streak-count')?.textContent?.trim()).toBe('5');
  });
});
