import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideRouter } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { LevelBadge } from './level-badge';

describe('LevelBadge', () => {
  let mockRouter: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockRouter = { navigate: vi.fn().mockResolvedValue(true) };
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: Router, useValue: mockRouter }],
    });
  });

  it('should display level text', () => {
    const fixture = TestBed.createComponent(LevelBadge);
    fixture.componentRef.setInput('level', 'B2');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.level-pill')?.textContent?.trim()).toBe('B2');
  });

  it('should not render when level is null', () => {
    const fixture = TestBed.createComponent(LevelBadge);
    fixture.componentRef.setInput('level', null);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.level-pill')).toBeNull();
  });

  it('should navigate to /profile on click', () => {
    const fixture = TestBed.createComponent(LevelBadge);
    fixture.componentRef.setInput('level', 'A2');
    fixture.detectChanges();

    const pill = fixture.nativeElement.querySelector('.level-pill') as HTMLButtonElement;
    pill.click();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/profile']);
  });
});
