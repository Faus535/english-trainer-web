import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it, beforeEach } from 'vitest';
import { HomePage } from './home-page';
import { AuthService } from '../../../../core/services/auth.service';
import { environment } from '../../../../core/services/environment';

describe('HomePage', () => {
  let fixture: ComponentFixture<HomePage>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        {
          provide: AuthService,
          useValue: { profileId: () => 'test-profile' },
        },
      ],
    });
    fixture = TestBed.createComponent(HomePage);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should show skeleton while loading', () => {
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('[aria-busy="true"]')).toBeTruthy();
  });

  it('should render suggested-action-card when data loads', () => {
    fixture.detectChanges();

    const req = httpMock.expectOne(`${environment.apiUrl}/profiles/test-profile/home`);
    req.flush({
      suggestedAction: {
        type: 'talk',
        title: 'Practice speaking',
        description: 'Start a new conversation',
        targetRoute: '/talk',
      },
      progress: { xpToday: 50, xpGoal: 200, streak: 3 },
      recentActivity: { reviewDueCount: 5 },
    });

    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-suggested-action-card')).toBeTruthy();
    expect(el.querySelector('app-daily-progress')).toBeTruthy();
    expect(el.querySelector('app-streak-widget')).toBeTruthy();
  });
});
