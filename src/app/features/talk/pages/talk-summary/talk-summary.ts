import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { TalkStateService } from '../../services/talk-state.service';
import { TalkEvaluationCard } from '../../components/talk-evaluation-card/talk-evaluation-card';

@Component({
  selector: 'app-talk-summary',
  imports: [TalkEvaluationCard],
  templateUrl: './talk-summary.html',
  styleUrl: './talk-summary.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TalkSummary {
  private readonly router = inject(Router);
  private readonly talkState = inject(TalkStateService);

  protected readonly endResult = this.talkState.endResult;
  protected readonly status = this.talkState.status;

  protected readonly evaluation = computed(() => this.endResult()?.evaluation ?? null);
  protected readonly turnCount = computed(() => this.endResult()?.turnCount ?? 0);
  protected readonly errorCount = computed(() => this.endResult()?.errorCount ?? 0);
  protected readonly summary = computed(() => this.endResult()?.summary ?? '');

  protected newConversation(): void {
    this.talkState.resetConversation();
    this.router.navigate(['/talk']);
  }

  protected goHome(): void {
    this.talkState.resetConversation();
    this.router.navigate(['/home']);
  }
}
