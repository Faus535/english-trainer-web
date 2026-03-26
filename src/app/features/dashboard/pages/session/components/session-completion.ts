import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { ExerciseResult } from '../../../../../shared/models/exercise-result.model';

@Component({
  selector: 'app-session-completion',
  standalone: true,
  templateUrl: './session-completion.html',
  styleUrl: './session-completion.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionCompletion {
  readonly duration = input.required<number>();
  readonly blockCount = input.required<number>();
  readonly xpEarned = input.required<number>();
  readonly accumulatedXp = input(0);
  readonly improvedAreas = input<string[]>([]);
  readonly practiceAreas = input<string[]>([]);
  readonly unitMasteryScore = input<number | null>(null);
  readonly unitStatus = input<string | null>(null);
  readonly blockResults = input<Map<number, ExerciseResult>>(new Map());

  readonly startNext = output<void>();
  readonly exit = output<void>();

  protected readonly totalXp = computed(() => {
    const base = this.xpEarned();
    const accumulated = this.accumulatedXp();
    return accumulated > 0 ? accumulated : base;
  });

  protected readonly averageScore = computed(() => {
    const results = this.blockResults();
    if (results.size === 0) return null;
    let total = 0;
    results.forEach((r) => (total += r.score));
    return Math.round(total / results.size);
  });

  protected readonly isMastered = computed(() => this.unitStatus() === 'MASTERED');
}
