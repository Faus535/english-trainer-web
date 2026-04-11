import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ReviewApiService } from '../../../../core/services/review-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ReviewItem, ReviewRating } from '../../models/review.model';
import { Flashcard } from '../../components/flashcard/flashcard';

@Component({
  selector: 'app-review-page',
  imports: [Flashcard, RouterLink],
  templateUrl: './review-page.html',
  styleUrl: './review-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewPage implements OnInit {
  private readonly reviewApi = inject(ReviewApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly _items = signal<ReviewItem[]>([]);
  protected readonly _currentIndex = signal(0);
  protected readonly _correctCount = signal(0);
  protected readonly _done = signal(false);
  protected readonly _loading = signal(true);

  protected readonly _currentItem = computed(() => this._items()[this._currentIndex()]);

  protected readonly _remaining = computed(() => this._items().length - this._currentIndex());

  ngOnInit(): void {
    const profileId = this.auth.profileId();
    if (!profileId) return;

    this.reviewApi.getDueReviews(profileId).subscribe({
      next: (items) => {
        this._items.set(items);
        this._loading.set(false);
        if (items.length === 0) {
          this._done.set(true);
        }
      },
      error: () => {
        this._loading.set(false);
        this._done.set(true);
      },
    });
  }

  protected onRated(rating: ReviewRating): void {
    const item = this._currentItem();
    const profileId = this.auth.profileId();
    if (!item || !profileId) return;

    if (rating === 'EASY' || rating === 'GOOD') {
      this._correctCount.update((c) => c + 1);
    }

    this.reviewApi.submitResult(profileId, item.id, rating).subscribe();

    const nextIndex = this._currentIndex() + 1;
    if (nextIndex >= this._items().length) {
      this._done.set(true);
    } else {
      this._currentIndex.set(nextIndex);
    }
  }

  protected goBack(): void {
    this.router.navigate(['/home']);
  }
}
