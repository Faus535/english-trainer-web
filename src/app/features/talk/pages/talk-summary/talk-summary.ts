import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { TalkStateService } from '../../services/talk-state.service';
import { EvaluationCard } from '../../components/evaluation-card/evaluation-card';
import { GoalsTracker } from '../../components/goals-tracker/goals-tracker';
import { AuthService } from '../../../../core/services/auth.service';
import { ReviewApiService } from '../../../../core/services/review-api.service';

@Component({
  selector: 'app-talk-summary',
  imports: [EvaluationCard, GoalsTracker],
  templateUrl: './talk-summary.html',
  styleUrl: './talk-summary.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TalkSummary {
  private readonly router = inject(Router);
  private readonly talkState = inject(TalkStateService);
  private readonly auth = inject(AuthService);
  private readonly reviewApi = inject(ReviewApiService);

  protected readonly endResult = this.talkState.endResult;
  protected readonly status = this.talkState.status;

  protected readonly evaluation = computed(() => this.endResult()?.evaluation ?? null);
  protected readonly messagesCount = computed(() => this.endResult()?.messagesCount ?? 0);
  protected readonly xpEarned = computed(() => this.endResult()?.xpEarned ?? 0);
  protected readonly summary = computed(() => this.endResult()?.summary ?? '');
  protected readonly goalResults = computed(() => this.endResult()?.evaluation?.goalResults ?? []);
  protected readonly goalDescriptions = computed(() =>
    this.goalResults().map((g) => g.goalDescription),
  );

  protected sendToReview(): void {
    const profileId = this.auth.profileId();
    const eval_ = this.evaluation();
    if (!profileId || !eval_) return;

    const areasToImprove = eval_.areasToImprove ?? [];
    for (const area of areasToImprove) {
      this.reviewApi.addWordToReview(profileId, area, 'a2').subscribe();
    }
  }

  protected newConversation(): void {
    this.talkState.resetConversation();
    this.router.navigate(['/talk']);
  }

  protected goHome(): void {
    this.talkState.resetConversation();
    this.router.navigate(['/home']);
  }
}
