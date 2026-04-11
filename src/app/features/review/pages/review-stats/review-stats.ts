import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { ReviewApiService } from '../../../../core/services/review-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ProgressRing } from '../../../../shared/components/progress-ring/progress-ring';

@Component({
  selector: 'app-review-stats',
  imports: [RouterLink, ProgressRing],
  templateUrl: './review-stats.html',
  styleUrl: './review-stats.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewStats implements OnInit {
  private readonly reviewApi = inject(ReviewApiService);
  private readonly auth = inject(AuthService);

  protected readonly totalItems = signal(0);
  protected readonly dueToday = signal(0);
  protected readonly totalMastered = signal(0);
  protected readonly weeklyReviewed = signal(0);
  protected readonly accuracyRate = signal(0);
  protected readonly retentionRate = signal(0);
  protected readonly averageInterval = signal(0);
  protected readonly loading = signal(true);

  protected readonly accuracyPercent = computed(() => Math.round(this.accuracyRate() * 100));
  protected readonly retentionPercent = computed(() => Math.round(this.retentionRate() * 100));
  protected readonly averageIntervalDisplay = computed(() => this.averageInterval().toFixed(1));

  ngOnInit(): void {
    const profileId = this.auth.profileId();
    if (!profileId) return;

    this.reviewApi.getReviewStats(profileId).subscribe({
      next: (stats) => {
        this.totalItems.set(stats.totalItems);
        this.dueToday.set(stats.dueToday);
        this.totalMastered.set(stats.totalMastered);
        this.weeklyReviewed.set(stats.weeklyReviewed);
        this.accuracyRate.set(stats.accuracyRate);
        this.retentionRate.set(stats.retentionRate ?? 0);
        this.averageInterval.set(stats.averageInterval ?? 0);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
