import { Component, ChangeDetectionStrategy, input, signal, computed } from '@angular/core';
import { TalkCorrection } from '../../models/talk.model';
import { InlineCorrection } from '../inline-correction/inline-correction';

@Component({
  selector: 'app-talk-feedback-card',
  imports: [InlineCorrection],
  templateUrl: './talk-feedback-card.html',
  styleUrl: './talk-feedback-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TalkFeedbackCard {
  readonly correction = input.required<TalkCorrection>();

  protected readonly expanded = signal(false);

  protected readonly hasFeedback = computed(() => {
    const c = this.correction();
    return (
      c.grammarFixes.length > 0 ||
      c.vocabularySuggestions.length > 0 ||
      c.pronunciationTips.length > 0
    );
  });

  protected toggle(): void {
    this.expanded.update((v) => !v);
  }
}
