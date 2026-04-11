import { Component, ChangeDetectionStrategy, input } from '@angular/core';

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

@Component({
  selector: 'app-streak-widget',
  imports: [],
  templateUrl: './streak-widget.html',
  styleUrl: './streak-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreakWidget {
  readonly streakDays = input.required<number>();
  readonly weeklyActivity = input.required<boolean[]>();

  protected readonly dayLabels = DAY_LABELS;
}
