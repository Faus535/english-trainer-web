import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { GamificationService } from '../../services/gamification.service';
import { StateService } from '../../../../shared/services/state.service';

@Component({
  selector: 'app-achievements',
  templateUrl: './achievements.html',
  styleUrl: './achievements.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Achievements {
  private readonly gamification = inject(GamificationService);
  private readonly state = inject(StateService);

  protected readonly level = this.gamification.level;
  protected readonly streak = this.state.streak;
  protected readonly bestStreak = this.state.bestStreak;
  protected readonly totalSessions = this.state.totalSessions;
  protected readonly flashcards = this.state.flashcardCount;
  protected readonly allAchievements = this.gamification.allAchievements;
  protected readonly unlockedIds = computed(() =>
    new Set(this.gamification.unlockedAchievements().map(a => a.id))
  );

  protected readonly progressPercent = computed(() =>
    Math.round(this.level().progress * 100)
  );

  protected isUnlocked(id: string): boolean {
    return this.unlockedIds().has(id);
  }
}
