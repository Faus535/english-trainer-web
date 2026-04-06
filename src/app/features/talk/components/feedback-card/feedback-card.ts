import { Component, ChangeDetectionStrategy, input, signal, computed } from '@angular/core';
import { Icon } from '../../../../shared/components/icon/icon';
import { LucideIconData, ChevronDown, ChevronUp } from 'lucide-angular';
import { TalkCorrection } from '../../models/talk.model';

@Component({
  selector: 'app-feedback-card',
  imports: [Icon],
  templateUrl: './feedback-card.html',
  styleUrl: './feedback-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackCard {
  readonly feedback = input.required<TalkCorrection>();

  protected readonly expanded = signal(false);
  protected readonly expandIcon: LucideIconData = ChevronDown;
  protected readonly collapseIcon: LucideIconData = ChevronUp;

  protected readonly hasFeedback = computed(() => {
    const fb = this.feedback();
    return (
      fb.grammarFixes.length > 0 ||
      fb.vocabularySuggestions.length > 0 ||
      fb.pronunciationTips.length > 0
    );
  });

  protected toggle(): void {
    this.expanded.update((v) => !v);
  }
}
