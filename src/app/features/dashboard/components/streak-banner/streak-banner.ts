import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { StateService } from '../../../../shared/services/state.service';

@Component({
  selector: 'app-streak-banner',
  templateUrl: './streak-banner.html',
  styleUrl: './streak-banner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreakBanner {
  private readonly state = inject(StateService);

  protected readonly streak = this.state.streak;

  protected readonly hasStreak = computed(() => this.streak() > 0);

  protected readonly hoursRemaining = computed(() => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    return Math.floor((midnight.getTime() - now.getTime()) / 3600000);
  });

  protected readonly message = computed(() => {
    const s = this.streak();
    if (s === 0) return 'Empieza tu racha hoy';
    return `Racha de ${s} dias! Practica hoy para no perderla`;
  });
}
