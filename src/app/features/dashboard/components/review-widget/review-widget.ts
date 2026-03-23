import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../../../shared/components/icon/icon';
import { ReviewApiService } from '../../../../core/services/review-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { LucideIconData, RotateCcw, ChevronRight } from 'lucide-angular';

@Component({
  selector: 'app-review-widget',
  imports: [RouterLink, Icon],
  templateUrl: './review-widget.html',
  styleUrl: './review-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewWidget implements OnInit {
  private readonly reviewApi = inject(ReviewApiService);
  private readonly auth = inject(AuthService);

  protected readonly repeatIcon: LucideIconData = RotateCcw;
  protected readonly chevronIcon: LucideIconData = ChevronRight;

  protected readonly dueToday = signal(0);
  protected readonly completedToday = signal(0);
  protected readonly loaded = signal(false);

  ngOnInit(): void {
    const profileId = this.auth.profileId();
    if (!profileId) return;

    this.reviewApi.getReviewStats(profileId).subscribe({
      next: (stats) => {
        this.dueToday.set(stats.dueToday);
        this.completedToday.set(stats.completedToday);
        this.loaded.set(true);
      },
      error: () => {
        this.loaded.set(true);
      },
    });
  }
}
