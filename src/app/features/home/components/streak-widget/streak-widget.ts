import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-streak-widget',
  templateUrl: './streak-widget.html',
  styleUrl: './streak-widget.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreakWidget {
  readonly streak = input(0);
}
