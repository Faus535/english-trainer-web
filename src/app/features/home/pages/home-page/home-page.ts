import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { HomeApiService } from '../../services/home-api.service';
import { HomeResponse } from '../../models/home.model';
import { SuggestedActionCard } from '../../components/suggested-action-card/suggested-action-card';
import { DailyProgress } from '../../components/daily-progress/daily-progress';
import { StreakWidget } from '../../components/streak-widget/streak-widget';
import { LevelBadge } from '../../components/level-badge/level-badge';
import { RecentAchievementsStrip } from '../../components/recent-achievements-strip/recent-achievements-strip';

@Component({
  selector: 'app-home-page',
  imports: [SuggestedActionCard, DailyProgress, StreakWidget, LevelBadge, RecentAchievementsStrip],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage implements OnInit {
  private readonly homeApi = inject(HomeApiService);

  protected readonly data = signal<HomeResponse | null>(null);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    this.homeApi.getHome().subscribe({
      next: (response) => {
        this.data.set(response);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
