import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { LevelSelector } from './level-selector';

describe('LevelSelector', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LevelSelector);
    fixture.componentRef.setInput('level', 'a1');
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should display all 5 level buttons', () => {
    const fixture = TestBed.createComponent(LevelSelector);
    fixture.componentRef.setInput('level', 'a1');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.level-btn');
    expect(buttons.length).toBe(5);
    expect(buttons[0].textContent.trim()).toBe('A1');
    expect(buttons[4].textContent.trim()).toBe('C1');
  });

  it('should mark the active level', () => {
    const fixture = TestBed.createComponent(LevelSelector);
    fixture.componentRef.setInput('level', 'b1');
    fixture.detectChanges();

    const activeBtn = fixture.nativeElement.querySelector('.level-btn.active');
    expect(activeBtn.textContent.trim()).toBe('B1');
  });

  it('should emit levelChange on click', () => {
    const fixture = TestBed.createComponent(LevelSelector);
    fixture.componentRef.setInput('level', 'a1');
    fixture.detectChanges();

    const spy = vi.fn();
    fixture.componentInstance.levelChange.subscribe(spy);

    const buttons = fixture.nativeElement.querySelectorAll('.level-btn');
    buttons[2].click(); // B1

    expect(spy).toHaveBeenCalledWith('b1');
  });
});
