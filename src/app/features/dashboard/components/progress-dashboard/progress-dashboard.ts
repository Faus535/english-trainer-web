import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ProgressApiService } from '../../../../core/services/progress-api.service';
import { ReviewApiService } from '../../../../core/services/review-api.service';
import { ActivityApiService } from '../../../../core/services/activity-api.service';
import { GamificationApiService } from '../../../../core/services/gamification-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import {
  ModuleProgressResponse,
  StreakResponse,
  XpLevelResponse,
} from '../../../../shared/models/api.model';

@Component({
  selector: 'app-progress-dashboard',
  templateUrl: './progress-dashboard.html',
  styleUrl: './progress-dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressDashboard implements OnInit {
  private readonly progressApi = inject(ProgressApiService);
  private readonly reviewApi = inject(ReviewApiService);
  private readonly activityApi = inject(ActivityApiService);
  private readonly gamificationApi = inject(GamificationApiService);
  private readonly auth = inject(AuthService);

  protected readonly moduleProgress = signal<ModuleProgressResponse[]>([]);
  protected readonly reviewStats = signal<{
    totalItems: number;
    dueToday: number;
    completedToday: number;
  } | null>(null);
  protected readonly streak = signal<StreakResponse | null>(null);
  protected readonly xpLevel = signal<XpLevelResponse | null>(null);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    const profileId = this.auth.profileId() ?? sessionStorage.getItem('et_profile_id');
    if (!profileId) return;

    forkJoin({
      progress: this.progressApi.getAllProgress(profileId),
      reviews: this.reviewApi.getReviewStats(profileId),
      streak: this.activityApi.getStreak(profileId),
      xp: this.gamificationApi.getXpLevel(profileId),
    }).subscribe({
      next: (data) => {
        this.moduleProgress.set(data.progress);
        this.reviewStats.set(data.reviews);
        this.streak.set(data.streak);
        this.xpLevel.set(data.xp);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected progressPercent(mod: ModuleProgressResponse): number {
    return mod.totalUnits > 0 ? Math.round((mod.completedUnits.length / mod.totalUnits) * 100) : 0;
  }

  protected moduleLabel(name: string): string {
    const labels: Record<string, string> = {
      listening: 'Listening',
      pronunciation: 'Pronunciacion',
      vocabulary: 'Vocabulario',
      grammar: 'Gramatica',
      phrases: 'Frases',
    };
    return labels[name] ?? name;
  }
}
