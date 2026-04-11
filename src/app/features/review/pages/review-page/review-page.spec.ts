import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ReviewPage } from './review-page';
import { ReviewApiService } from '../../../../core/services/review-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { of } from 'rxjs';
import { ReviewItem } from '../../models/review.model';

const mockItems: ReviewItem[] = [
  {
    id: 'item-1',
    word: 'run',
    translation: 'correr',
    quality: 3,
    interval: 3,
    sourceType: 'ARTICLE',
  },
  {
    id: 'item-2',
    word: 'jump',
    translation: 'saltar',
    quality: 2,
    interval: 1,
    sourceType: 'TALK',
  },
];

function createMocks(items = mockItems) {
  const reviewApi = {
    getDueReviews: vi.fn().mockReturnValue(of(items)),
    submitResult: vi.fn().mockReturnValue(of({})),
    getReviewStats: vi.fn().mockReturnValue(of({})),
  };
  const auth = { profileId: () => 'profile-1' };
  return { reviewApi, auth };
}

describe('ReviewPage', () => {
  it('should advance to next card after rating', async () => {
    const { reviewApi, auth } = createMocks();

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ReviewApiService, useValue: reviewApi },
        { provide: AuthService, useValue: auth },
      ],
    });

    const fixture = TestBed.createComponent(ReviewPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const component = fixture.componentInstance as any;
    expect(component._currentIndex()).toBe(0);

    component.onRated('EASY');
    fixture.detectChanges();

    expect(component._currentIndex()).toBe(1);
  });

  it('should show done state when all items reviewed', async () => {
    const { reviewApi, auth } = createMocks();

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ReviewApiService, useValue: reviewApi },
        { provide: AuthService, useValue: auth },
      ],
    });

    const fixture = TestBed.createComponent(ReviewPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const component = fixture.componentInstance as any;
    component.onRated('EASY');
    component.onRated('HARD');
    fixture.detectChanges();

    expect(component._done()).toBe(true);
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Session complete!');
  });

  it('should count correct ratings', async () => {
    const { reviewApi, auth } = createMocks();

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ReviewApiService, useValue: reviewApi },
        { provide: AuthService, useValue: auth },
      ],
    });

    const fixture = TestBed.createComponent(ReviewPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const component = fixture.componentInstance as any;
    component.onRated('GOOD');
    component.onRated('HARD');
    fixture.detectChanges();

    expect(component._correctCount()).toBe(1);
  });

  it('should count GOOD rating as correct', async () => {
    const { reviewApi, auth } = createMocks();

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ReviewApiService, useValue: reviewApi },
        { provide: AuthService, useValue: auth },
      ],
    });

    const fixture = TestBed.createComponent(ReviewPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const component = fixture.componentInstance as any;
    component.onRated('GOOD');
    fixture.detectChanges();

    expect(component._correctCount()).toBe(1);
  });

  it('should not count HARD rating as correct', async () => {
    const { reviewApi, auth } = createMocks([mockItems[0]]);

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: ReviewApiService, useValue: reviewApi },
        { provide: AuthService, useValue: auth },
      ],
    });

    const fixture = TestBed.createComponent(ReviewPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const component = fixture.componentInstance as any;
    component.onRated('HARD');
    fixture.detectChanges();

    expect(component._correctCount()).toBe(0);
  });
});
