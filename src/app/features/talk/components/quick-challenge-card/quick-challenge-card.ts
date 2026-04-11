import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { QuickChallenge } from '../../models/talk.model';

@Component({
  selector: 'app-quick-challenge-card',
  imports: [],
  templateUrl: './quick-challenge-card.html',
  styleUrl: './quick-challenge-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickChallengeCard {
  readonly challenge = input.required<QuickChallenge>();
  readonly started = output<QuickChallenge>();

  protected readonly difficultyClass = computed(() => {
    const d = this.challenge().difficulty;
    if (d === 'EASY') return 'easy';
    if (d === 'MEDIUM') return 'medium';
    return 'hard';
  });

  protected onStart(): void {
    this.started.emit(this.challenge());
  }
}
