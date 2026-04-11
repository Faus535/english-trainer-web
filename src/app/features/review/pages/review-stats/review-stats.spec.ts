import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ReviewStats } from './review-stats';
import { ReviewApiService } from '../../../../core/services/review-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { of } from 'rxjs';

const mockStats = {
  totalItems: 100,
  dueToday: 10,
  averageQuality: 3.5,
  totalMastered: 42,
  weeklyReviewed: 35,
  accuracyRate: 0.78,
};

describe('ReviewStats', () => {
  function setup() {
    const reviewApi = {
      getReviewStats: vi.fn().mockReturnValue(of(mockStats)),
    };
    const auth = { profileId: () => 'profile-1' };

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ReviewApiService, useValue: reviewApi },
        { provide: AuthService, useValue: auth },
      ],
    });
  }

  it('should display accuracyRate as percentage in ring', async () => {
    setup();
    const fixture = TestBed.createComponent(ReviewStats);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('78%');
  });

  it('should display totalMastered count', async () => {
    setup();
    const fixture = TestBed.createComponent(ReviewStats);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('42');
  });
});
