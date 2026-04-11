import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { TalkStateService } from '../../services/talk-state.service';
import { TalkEvaluationCard } from '../../components/talk-evaluation-card/talk-evaluation-card';
import { GrammarNotesSection } from '../../components/grammar-notes-section/grammar-notes-section';
import { VocabSection } from '../../components/vocab-section/vocab-section';
import { GrammarNote, VocabItem } from '../../models/talk.model';

@Component({
  selector: 'app-talk-summary',
  imports: [TalkEvaluationCard, GrammarNotesSection, VocabSection],
  templateUrl: './talk-summary.html',
  styleUrl: './talk-summary.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TalkSummary {
  private readonly router = inject(Router);
  private readonly talkState = inject(TalkStateService);

  protected readonly endResult = this.talkState.endResult;
  protected readonly status = this.talkState.status;
  protected readonly quickMode = this.talkState.quickMode;

  protected readonly evaluation = computed(() => this.endResult()?.evaluation ?? null);
  protected readonly turnCount = computed(() => this.endResult()?.turnCount ?? 0);
  protected readonly errorCount = computed(() => this.endResult()?.errorCount ?? 0);
  protected readonly summary = computed(() => this.endResult()?.summary ?? '');
  protected readonly grammarNotes = computed<GrammarNote[]>(
    () => this.endResult()?.grammarNotes ?? [],
  );
  protected readonly newVocabulary = computed<VocabItem[]>(
    () => this.endResult()?.newVocabulary ?? [],
  );

  // Quick mode result fields — backend may include these in the end response
  protected readonly taskCompleted = computed(() => {
    const r = this.endResult() as Record<string, unknown> | null;
    return r ? ((r['taskCompleted'] as boolean | undefined) ?? false) : false;
  });
  protected readonly top3Corrections = computed(() => {
    const r = this.endResult() as Record<string, unknown> | null;
    return r ? ((r['top3Corrections'] as string[] | undefined) ?? []) : [];
  });
  protected readonly encouragementNote = computed(() => {
    const r = this.endResult() as Record<string, unknown> | null;
    return r ? ((r['encouragementNote'] as string | undefined) ?? '') : '';
  });

  protected newConversation(): void {
    this.talkState.resetConversation();
    this.router.navigate(['/talk']);
  }

  protected goHome(): void {
    this.talkState.resetConversation();
    this.router.navigate(['/home']);
  }
}
