import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { IdleService } from '../../../core/services/idle.service';

@Component({
  selector: 'app-idle-warning-modal',
  templateUrl: './idle-warning-modal.html',
  styleUrl: './idle-warning-modal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IdleWarningModal {
  private readonly idle = inject(IdleService);

  protected readonly showWarning = this.idle.showWarning;
  protected readonly remainingDisplay = this.idle.remainingDisplay;
  protected readonly remainingSeconds = this.idle.remainingSeconds;

  readonly logoutRequested = output<void>();

  protected continueSession(): void {
    this.idle.reset();
  }

  protected closeSession(): void {
    this.logoutRequested.emit();
  }
}
