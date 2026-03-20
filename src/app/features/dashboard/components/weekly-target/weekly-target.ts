import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { StateService } from '../../../../shared/services/state.service';

@Component({
  selector: 'app-weekly-target',
  templateUrl: './weekly-target.html',
  styleUrl: './weekly-target.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeeklyTarget {
  private readonly state = inject(StateService);

  protected readonly sessionsWeek = this.state.sessionsThisWeek;
  protected readonly done = computed(() => this.sessionsWeek() >= 3);
  protected readonly remaining = computed(() => Math.max(0, 3 - this.sessionsWeek()));
}
