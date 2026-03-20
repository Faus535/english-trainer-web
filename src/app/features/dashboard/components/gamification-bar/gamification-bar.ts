import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GamificationService } from '../../services/gamification.service';
import { StateService } from '../../../../shared/services/state.service';

@Component({
  selector: 'app-gamification-bar',
  imports: [RouterLink],
  templateUrl: './gamification-bar.html',
  styleUrl: './gamification-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamificationBar {
  private readonly gamification = inject(GamificationService);
  private readonly state = inject(StateService);

  protected readonly level = this.gamification.level;
  protected readonly streak = this.state.streak;
  protected readonly unlockedCount = this.gamification.unlockedAchievements;
  protected readonly totalAchievements = this.gamification.allAchievements.length;

  protected readonly streakFireIcon = '\u{1F525}';
  protected readonly streakEmptyIcon = '\u26AA';
  protected readonly badgeIcon = '\u2B50';

  protected get progressPercent(): number {
    return Math.round(this.level().progress * 100);
  }
}
