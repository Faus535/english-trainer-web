import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { DailyProgress } from './daily-progress';

describe('DailyProgress', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should show XP bar filled proportionally', () => {
    const fixture = TestBed.createComponent(DailyProgress);
    fixture.componentRef.setInput('recentXpThisWeek', 250);
    fixture.detectChanges();

    const fill = fixture.nativeElement.querySelector('.xp-bar-fill') as HTMLElement;
    expect(fill.style.width).toBe('50%');
  });

  it('should cap bar at 100% when XP exceeds goal', () => {
    const fixture = TestBed.createComponent(DailyProgress);
    fixture.componentRef.setInput('recentXpThisWeek', 600);
    fixture.detectChanges();

    const fill = fixture.nativeElement.querySelector('.xp-bar-fill') as HTMLElement;
    expect(fill.style.width).toBe('100%');
  });

  it('should display XP value', () => {
    const fixture = TestBed.createComponent(DailyProgress);
    fixture.componentRef.setInput('recentXpThisWeek', 120);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.xp-value')?.textContent?.trim()).toBe('120');
  });
});
