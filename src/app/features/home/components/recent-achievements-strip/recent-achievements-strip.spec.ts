import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { RecentAchievementsStrip } from './recent-achievements-strip';
import { RecentAchievement } from '../../models/home.model';

const mockAchievements: RecentAchievement[] = [
  { title: 'First Read', icon: '📖', xpReward: 50 },
  { title: 'Streak 7', icon: '🔥', xpReward: 100 },
];

describe('RecentAchievementsStrip', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should not render when achievements is empty', () => {
    const fixture = TestBed.createComponent(RecentAchievementsStrip);
    fixture.componentRef.setInput('achievements', []);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.strip-section')).toBeNull();
  });

  it('should render one badge per achievement', () => {
    const fixture = TestBed.createComponent(RecentAchievementsStrip);
    fixture.componentRef.setInput('achievements', mockAchievements);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const badges = el.querySelectorAll('.badge-card');
    expect(badges.length).toBe(2);
  });

  it('should display achievement icon and title', () => {
    const fixture = TestBed.createComponent(RecentAchievementsStrip);
    fixture.componentRef.setInput('achievements', mockAchievements);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const firstBadge = el.querySelectorAll('.badge-card')[0];
    expect(firstBadge.querySelector('.badge-icon')?.textContent?.trim()).toBe('📖');
    expect(firstBadge.querySelector('.badge-title')?.textContent?.trim()).toBe('First Read');
  });
});
