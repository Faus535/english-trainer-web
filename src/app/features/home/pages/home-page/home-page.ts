import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HomeApiService, HomeSummaryResponse } from '../../services/home-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SuggestedActionCard } from '../../components/suggested-action-card/suggested-action-card';
import { DailyProgress } from '../../components/daily-progress/daily-progress';
import { StreakWidget } from '../../components/streak-widget/streak-widget';

@Component({
  selector: 'app-home-page',
  imports: [SuggestedActionCard, DailyProgress, StreakWidget],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit {
  private readonly homeApi = inject(HomeApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly data = signal<HomeSummaryResponse | null>(null);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    const profileId = this.auth.profileId();
    if (!profileId) return;

    this.homeApi.getHomeSummary(profileId).subscribe({
      next: (summary) => {
        this.data.set(summary);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  protected onActionTapped(route: string): void {
    this.router.navigate([route]);
  }

  protected goToProfile(): void {
    this.router.navigate(['/profile']);
  }
}
