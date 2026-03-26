import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Milestone } from '../../../../shared/models/learning-path.model';

const MILESTONE_ICONS: Record<string, string> = {
  UNIT_MASTERED: '🏆',
  LEVEL_COMPLETED: '⭐',
  STREAK_MILESTONE: '🔥',
  WORDS_LEARNED: '📖',
};

const DEFAULT_ICON = '✅';

@Component({
  selector: 'app-milestone-feed',
  imports: [DatePipe],
  templateUrl: './milestone-feed.html',
  styleUrl: './milestone-feed.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MilestoneFeed {
  readonly milestones = input<Milestone[]>([]);

  protected readonly recentMilestones = computed(() => this.milestones().slice(-3));

  protected iconFor(type: string): string {
    return MILESTONE_ICONS[type] ?? DEFAULT_ICON;
  }
}
