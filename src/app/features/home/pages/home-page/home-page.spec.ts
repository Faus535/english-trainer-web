import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, beforeEach } from 'vitest';
import { HomePage } from './home-page';
import { environment } from '../../../../core/services/environment';
import { HomeResponse } from '../../models/home.model';

const mockHomeResponse: HomeResponse = {
  dueReviewCount: 5,
  streakDays: 3,
  weeklyActivity: [true, true, false, true, false, false, false],
  suggestedModule: 'REVIEW',
  recentXpThisWeek: 120,
  recentAchievements: [{ title: 'First Read', icon: '📖', xpReward: 50 }],
  englishLevel: 'B2',
};

describe('HomePage', () => {
  let fixture: ComponentFixture<HomePage>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    fixture = TestBed.createComponent(HomePage);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should show skeleton while loading', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[aria-busy="true"]')).toBeTruthy();
  });

  it('should render all dashboard widgets when data loads', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(`${environment.apiUrl}/home`);
    req.flush(mockHomeResponse);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-streak-widget')).toBeTruthy();
    expect(el.querySelector('app-level-badge')).toBeTruthy();
    expect(el.querySelector('app-daily-progress')).toBeTruthy();
    expect(el.querySelector('app-suggested-action-card')).toBeTruthy();
    expect(el.querySelector('app-recent-achievements-strip')).toBeTruthy();
  });
});
