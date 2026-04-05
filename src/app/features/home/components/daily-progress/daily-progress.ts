import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { ProgressRing } from '../../../../shared/components/progress-ring/progress-ring';

@Component({
  selector: 'app-daily-progress',
  imports: [ProgressRing],
  templateUrl: './daily-progress.html',
  styleUrl: './daily-progress.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyProgress {
  readonly xpToday = input(0);
  readonly xpGoal = input(200);

  protected readonly percentage = computed(() => {
    const goal = this.xpGoal();
    if (goal <= 0) return 0;
    return Math.min(Math.round((this.xpToday() / goal) * 100), 100);
  });
}
