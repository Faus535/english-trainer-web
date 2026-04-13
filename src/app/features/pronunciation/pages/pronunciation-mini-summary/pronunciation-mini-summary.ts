import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PronunciationStateService } from '../../services/pronunciation-state.service';
import { ProgressRing } from '../../../../shared/components/progress-ring/progress-ring';

@Component({
  selector: 'app-pronunciation-mini-summary',
  imports: [ProgressRing],
  templateUrl: './pronunciation-mini-summary.html',
  styleUrl: './pronunciation-mini-summary.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PronunciationMiniSummary implements OnInit {
  protected readonly state = inject(PronunciationStateService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    if (this.state.miniConvTurns().length === 0) {
      this.router.navigate(['/pronunciation/mini-conversation']);
    }
  }

  protected onTryAgain(): void {
    this.state.resetMiniConversation();
    this.router.navigate(['/pronunciation/mini-conversation']);
  }

  protected onBackToLab(): void {
    this.router.navigate(['/pronunciation']);
  }
}
