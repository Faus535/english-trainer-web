import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  output,
  signal,
  computed,
} from '@angular/core';
import { ReviewApiService } from '../../../../../core/services/review-api.service';
import { SpacedRepetitionItemResponse } from '../../../../../shared/models/api.model';

@Component({
  selector: 'app-review-exercise',
  templateUrl: './review-exercise.html',
  styleUrl: './exercises.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewExercise {
  readonly items = input.required<SpacedRepetitionItemResponse[]>();
  readonly profileId = input.required<string>();
  readonly completed = output<void>();

  private readonly reviewApi = inject(ReviewApiService);

  protected readonly currentIndex = signal(0);
  protected readonly revealed = signal(false);
  protected readonly results = signal<boolean[]>([]);
  protected readonly finished = signal(false);

  protected readonly current = computed(() => this.items()[this.currentIndex()] ?? null);
  protected readonly progress = computed(() => {
    const total = this.items().length;
    return total > 0
      ? Math.round(((this.currentIndex() + (this.finished() ? 1 : 0)) / total) * 100)
      : 0;
  });
  protected readonly correctCount = computed(() => this.results().filter((r) => r).length);

  protected displayLabel(item: SpacedRepetitionItemResponse): string {
    if (item.itemType === 'vocabulary-word') {
      return item.unitReference;
    }
    return `${item.moduleName} — Unidad ${item.unitIndex}`;
  }

  protected reveal(): void {
    this.revealed.set(true);
  }

  protected rate(knew: boolean): void {
    const item = this.current();
    if (!item) return;
    this.reviewApi.completeReview(this.profileId(), item.id, knew ? 5 : 1).subscribe();
    this.results.update((r) => [...r, knew]);
    this.advance();
  }

  private advance(): void {
    const next = this.currentIndex() + 1;
    if (next >= this.items().length) {
      this.finished.set(true);
    } else {
      this.currentIndex.set(next);
      this.revealed.set(false);
    }
  }

  protected finish(): void {
    this.completed.emit();
  }
}
