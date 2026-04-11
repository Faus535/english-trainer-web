import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

const WEEKLY_XP_GOAL = 500;

@Component({
  selector: 'app-daily-progress',
  imports: [],
  templateUrl: './daily-progress.html',
  styleUrl: './daily-progress.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DailyProgress {
  readonly recentXpThisWeek = input.required<number>();

  protected readonly fillPercent = computed(() =>
    Math.min((this.recentXpThisWeek() / WEEKLY_XP_GOAL) * 100, 100),
  );
}
