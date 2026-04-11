import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SuggestedActionCard } from './suggested-action-card';

describe('SuggestedActionCard', () => {
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockRouter = { navigate: vi.fn().mockResolvedValue(true) };
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: Router, useValue: mockRouter }],
    });
  });

  it('should show REVIEW config when suggestedModule is REVIEW', () => {
    const fixture = TestBed.createComponent(SuggestedActionCard);
    fixture.componentRef.setInput('suggestedModule', 'REVIEW');
    fixture.componentRef.setInput('dueReviewCount', 5);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.card-title')?.textContent?.trim()).toBe('Time to review!');
  });

  it('should show due count badge for REVIEW module', () => {
    const fixture = TestBed.createComponent(SuggestedActionCard);
    fixture.componentRef.setInput('suggestedModule', 'REVIEW');
    fixture.componentRef.setInput('dueReviewCount', 7);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.due-badge')?.textContent?.trim()).toBe('7');
  });

  it('should not show due badge when dueReviewCount is 0', () => {
    const fixture = TestBed.createComponent(SuggestedActionCard);
    fixture.componentRef.setInput('suggestedModule', 'REVIEW');
    fixture.componentRef.setInput('dueReviewCount', 0);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.due-badge')).toBeNull();
  });

  it('should show ARTICLE config when suggestedModule is ARTICLE', () => {
    const fixture = TestBed.createComponent(SuggestedActionCard);
    fixture.componentRef.setInput('suggestedModule', 'ARTICLE');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.card-title')?.textContent?.trim()).toBe('Read an article');
  });

  it('should navigate to correct route on click', () => {
    const fixture = TestBed.createComponent(SuggestedActionCard);
    fixture.componentRef.setInput('suggestedModule', 'TALK');
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('.card') as HTMLButtonElement;
    btn.click();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/talk']);
  });
});
