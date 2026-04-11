import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { By } from '@angular/platform-browser';
import { QuickChallengeCard } from './quick-challenge-card';
import { QuickChallenge } from '../../models/talk.model';

const EASY_CHALLENGE: QuickChallenge = {
  id: 'order-coffee',
  title: 'Order Coffee',
  description: 'Practice ordering at a café.',
  difficulty: 'EASY',
  category: 'Food & Dining',
};

describe('QuickChallengeCard', () => {
  let fixture: ComponentFixture<QuickChallengeCard>;
  let component: QuickChallengeCard;

  function create(challenge: QuickChallenge = EASY_CHALLENGE): void {
    fixture = TestBed.createComponent(QuickChallengeCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('challenge', challenge);
    fixture.detectChanges();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should show title and difficulty badge', () => {
    create();
    const title = fixture.nativeElement.querySelector('.card-title');
    const badge = fixture.nativeElement.querySelector('.card-badge');
    expect(title.textContent.trim()).toBe('Order Coffee');
    expect(badge.textContent.trim()).toBe('EASY');
  });

  it('should emit started with challenge on Start click', () => {
    create();
    const emitted: QuickChallenge[] = [];
    component.started.subscribe((c) => emitted.push(c));

    const btn = fixture.debugElement.query(By.css('.card-start'));
    btn.nativeElement.click();

    expect(emitted.length).toBe(1);
    expect(emitted[0]).toEqual(EASY_CHALLENGE);
  });

  it('should show correct difficulty color for EASY', () => {
    create();
    const badge = fixture.nativeElement.querySelector('.card-badge');
    expect(badge.classList.contains('badge--easy')).toBe(true);
  });

  it('should apply medium class for MEDIUM difficulty', () => {
    create({ ...EASY_CHALLENGE, difficulty: 'MEDIUM' });
    const badge = fixture.nativeElement.querySelector('.card-badge');
    expect(badge.classList.contains('badge--medium')).toBe(true);
  });

  it('should apply hard class for HARD difficulty', () => {
    create({ ...EASY_CHALLENGE, difficulty: 'HARD' });
    const badge = fixture.nativeElement.querySelector('.card-badge');
    expect(badge.classList.contains('badge--hard')).toBe(true);
  });
});
