import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { RecentAchievement } from '../../models/home.model';

@Component({
  selector: 'app-recent-achievements-strip',
  imports: [],
  templateUrl: './recent-achievements-strip.html',
  styleUrl: './recent-achievements-strip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentAchievementsStrip {
  readonly achievements = input.required<RecentAchievement[]>();
}
