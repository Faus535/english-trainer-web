import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Onboarding } from './onboarding';
import { ProfileStateService } from '../../services/profile-state.service';

describe('Onboarding', () => {
  let fixture: ComponentFixture<Onboarding>;
  let component: Onboarding;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [Onboarding],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    fixture = TestBed.createComponent(Onboarding);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render welcome step initially', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.step-welcome')).toBeTruthy();
    expect(el.querySelector('.step-level')).toBeFalsy();
    expect(el.querySelector('.step-ready')).toBeFalsy();
  });

  it('should advance to level step on Get Started click', () => {
    const el: HTMLElement = fixture.nativeElement;
    const btn = el.querySelector<HTMLButtonElement>('.btn-primary');
    btn?.click();
    fixture.detectChanges();

    expect(el.querySelector('.step-level')).toBeTruthy();
    expect(el.querySelector('.step-welcome')).toBeFalsy();
  });

  it('should enable Continue only when level is selected', () => {
    // Advance to level step
    const el: HTMLElement = fixture.nativeElement;
    el.querySelector<HTMLButtonElement>('.btn-primary')?.click();
    fixture.detectChanges();

    const continueBtn = el.querySelector<HTMLButtonElement>('.btn-primary');
    expect(continueBtn?.disabled).toBe(true);

    // Select a level
    el.querySelector<HTMLButtonElement>('.level-card')?.click();
    fixture.detectChanges();

    expect(continueBtn?.disabled).toBe(false);
  });

  it('should call updateEnglishLevel and advance to ready step', () => {
    const profileState = TestBed.inject(ProfileStateService);
    const updateSpy = vi.spyOn(profileState, 'updateEnglishLevel');

    const el: HTMLElement = fixture.nativeElement;
    // Go to level step
    el.querySelector<HTMLButtonElement>('.btn-primary')?.click();
    fixture.detectChanges();

    // Select B1
    const cards = el.querySelectorAll<HTMLButtonElement>('.level-card');
    cards[2]?.click(); // B1 is index 2
    fixture.detectChanges();

    // Click Continue
    el.querySelector<HTMLButtonElement>('.btn-primary')?.click();
    fixture.detectChanges();

    expect(updateSpy).toHaveBeenCalledWith('B1');
    expect(el.querySelector('.step-ready')).toBeTruthy();
  });

  it('should emit completed on Start Learning', () => {
    const completedSpy = vi.fn();
    component.completed.subscribe(completedSpy);

    const el: HTMLElement = fixture.nativeElement;
    // Go to level step
    el.querySelector<HTMLButtonElement>('.btn-primary')?.click();
    fixture.detectChanges();
    // Select level
    el.querySelector<HTMLButtonElement>('.level-card')?.click();
    fixture.detectChanges();
    // Continue
    el.querySelector<HTMLButtonElement>('.btn-primary')?.click();
    fixture.detectChanges();
    // Start Learning
    el.querySelector<HTMLButtonElement>('.btn-primary')?.click();
    fixture.detectChanges();

    expect(completedSpy).toHaveBeenCalled();
  });
});
