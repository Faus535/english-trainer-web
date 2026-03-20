import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { StateService } from '../../../../shared/services/state.service';

@Component({
  selector: 'app-stats-summary',
  templateUrl: './stats-summary.html',
  styleUrl: './stats-summary.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatsSummary {
  private readonly state = inject(StateService);

  protected readonly totalSessions = this.state.totalSessions;
  protected readonly sessionsWeek = this.state.sessionsThisWeek;
  protected readonly streak = this.state.streak;
  protected readonly overallLevel = this.state.overallLevel;
}
