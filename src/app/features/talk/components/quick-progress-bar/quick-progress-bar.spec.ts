import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { QuickProgressBar } from './quick-progress-bar';

describe('QuickProgressBar', () => {
  let fixture: ComponentFixture<QuickProgressBar>;

  function create(
    exchangeCount: number,
    totalExchanges = 3,
    challengeTitle: string | null = null,
  ): void {
    fixture = TestBed.createComponent(QuickProgressBar);
    fixture.componentRef.setInput('exchangeCount', exchangeCount);
    fixture.componentRef.setInput('totalExchanges', totalExchanges);
    fixture.componentRef.setInput('challengeTitle', challengeTitle);
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should display exchangeCount of totalExchanges', () => {
    create(2, 3);
    const label = fixture.nativeElement.querySelector('.progress-label');
    expect(label.textContent.trim()).toBe('Exchange 2 of 3');
  });

  it('should fill bar proportionally', () => {
    create(1, 3);
    const fill = fixture.nativeElement.querySelector('.progress-fill');
    expect(fill.style.width).toBe('33.33333333333333%');
  });

  it('should show challenge title when provided', () => {
    create(1, 3, 'Order Coffee');
    const title = fixture.nativeElement.querySelector('.challenge-title');
    expect(title).not.toBeNull();
    expect(title.textContent.trim()).toBe('Order Coffee');
  });

  it('should not show challenge title when null', () => {
    create(1, 3, null);
    const title = fixture.nativeElement.querySelector('.challenge-title');
    expect(title).toBeNull();
  });

  it('should cap fill at 100% when exchange count exceeds total', () => {
    create(5, 3);
    const fill = fixture.nativeElement.querySelector('.progress-fill');
    expect(fill.style.width).toBe('100%');
  });
});
