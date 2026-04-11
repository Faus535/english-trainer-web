import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { ReviewItem, ReviewRating } from '../../models/review.model';

@Component({
  selector: 'app-flashcard',
  templateUrl: './flashcard.html',
  styleUrl: './flashcard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Flashcard {
  readonly item = input.required<ReviewItem>();
  readonly rated = output<ReviewRating>();

  protected readonly _flipped = signal(false);
  protected readonly _rating = signal<ReviewRating | null>(null);

  protected flip(): void {
    if (!this._flipped()) {
      this._flipped.set(true);
    }
  }

  protected rate(rating: ReviewRating): void {
    this._rating.set(rating);
    this.rated.emit(rating);
  }
}
