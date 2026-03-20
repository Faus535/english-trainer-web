import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, beforeEach } from 'vitest';
import { Dashboard } from './dashboard';

describe('Dashboard', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideRouter([])],
    });
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display quick start', () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-quick-start')).toBeTruthy();
  });

  it('should display module cards', () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    const cards = el.querySelectorAll('app-module-card');
    expect(cards.length).toBe(5);
  });

  it('should display stats summary', () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-stats-summary')).toBeTruthy();
  });

  it('should display widgets', () => {
    const fixture = TestBed.createComponent(Dashboard);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-sound-of-day')).toBeTruthy();
    expect(el.querySelector('app-phrase-roulette')).toBeTruthy();
  });
});
