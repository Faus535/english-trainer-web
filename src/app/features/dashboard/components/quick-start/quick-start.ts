import { Component, ChangeDetectionStrategy, inject, output, computed } from '@angular/core';
import { StateService } from '../../../../shared/services/state.service';
import { SessionService } from '../../services/session.service';
import { GamificationService } from '../../services/gamification.service';
import { WeaknessService } from '../../services/weakness.service';
import { SessionMode } from '../../models/session.model';

@Component({
  selector: 'app-quick-start',
  templateUrl: './quick-start.html',
  styleUrl: './quick-start.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickStart {
  private readonly state = inject(StateService);
  private readonly sessionService = inject(SessionService);
  private readonly gamification = inject(GamificationService);
  private readonly weakness = inject(WeaknessService);

  protected readonly pendingSession = this.sessionService.currentSession;
  protected readonly streak = this.state.streak;
  protected readonly level = this.gamification.level;
  protected readonly weaknessHints = computed(() => this.weakness.weaknessExplanation());

  readonly sessionStarted = output<void>();

  protected get nextUnitLabel(): string {
    const next = this.state.getNextUnit('listening');
    return next ? next.unit.title : 'Todo completado';
  }

  protected startSession(mode: SessionMode): void {
    this.sessionService.startSession(mode);
    this.sessionStarted.emit();
  }

  protected resumeSession(): void {
    this.sessionService.resumeSession();
    this.sessionStarted.emit();
  }

  protected abandonSession(): void {
    this.sessionService.abandonSession();
  }
}
