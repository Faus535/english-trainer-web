import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { Icon } from '../../../../shared/components/icon/icon';
import { ReviewApiService } from '../../../../core/services/review-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { SpacedRepetitionItemResponse } from '../../../../shared/models/api.model';
import { LucideIconData, ArrowLeft, RotateCcw } from 'lucide-angular';

@Component({
  selector: 'app-review-page',
  imports: [Icon],
  templateUrl: './review-page.html',
  styleUrl: './review-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewPage implements OnInit {
  private readonly reviewApi = inject(ReviewApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly arrowLeftIcon: LucideIconData = ArrowLeft;
  protected readonly repeatIcon: LucideIconData = RotateCcw;

  protected readonly items = signal<SpacedRepetitionItemResponse[]>([]);
  protected readonly currentIndex = signal(0);
  protected readonly flipped = signal(false);
  protected readonly loading = signal(true);
  protected readonly completedToday = signal(0);
  protected readonly totalItems = signal(0);
  protected readonly dueToday = signal(0);

  protected readonly currentItem = computed(() => {
    const list = this.items();
    const idx = this.currentIndex();
    return idx < list.length ? list[idx] : null;
  });

  protected readonly progress = computed(() => {
    const total = this.items().length;
    return total > 0 ? Math.round((this.currentIndex() / total) * 100) : 0;
  });

  protected readonly allDone = computed(() => {
    return (
      !this.loading() && (this.items().length === 0 || this.currentIndex() >= this.items().length)
    );
  });

  ngOnInit(): void {
    this.loadData();
  }

  protected flipCard(): void {
    this.flipped.set(true);
  }

  protected rateQuality(quality: number): void {
    const item = this.currentItem();
    const profileId = this.auth.profileId();
    if (!item || !profileId) return;

    this.reviewApi.completeReview(profileId, item.id, quality).subscribe({
      next: () => {
        this.completedToday.update((c) => c + 1);
        this.currentIndex.update((i) => i + 1);
        this.flipped.set(false);
      },
    });
  }

  protected goBack(): void {
    this.router.navigate(['/home']);
  }

  private loadData(): void {
    const profileId = this.auth.profileId();
    if (!profileId) return;

    this.reviewApi.getReviewStats(profileId).subscribe({
      next: (stats) => {
        this.totalItems.set(stats.totalItems);
        this.dueToday.set(stats.dueToday);
        this.completedToday.set(stats.completedToday);
      },
    });

    this.reviewApi.getDueReviews(profileId).subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
