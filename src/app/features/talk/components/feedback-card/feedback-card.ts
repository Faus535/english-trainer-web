import { Component, ChangeDetectionStrategy, input, output, signal, computed } from '@angular/core';
import { Icon } from '../../../../shared/components/icon/icon';
import { VocabPopup } from '../../../../shared/components/vocab-popup/vocab-popup';
import { LucideIconData, ChevronDown, ChevronUp, Volume2, BookPlus } from 'lucide-angular';
import { TutorFeedback } from '../../models/talk.model';

@Component({
  selector: 'app-feedback-card',
  imports: [Icon, VocabPopup],
  templateUrl: './feedback-card.html',
  styleUrl: './feedback-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackCard {
  readonly feedback = input.required<TutorFeedback>();
  readonly speakWord = output<string>();
  readonly addToReview = output<string>();

  protected readonly expanded = signal(false);
  protected readonly expandIcon: LucideIconData = ChevronDown;
  protected readonly collapseIcon: LucideIconData = ChevronUp;
  protected readonly speakIcon: LucideIconData = Volume2;
  protected readonly addIcon: LucideIconData = BookPlus;

  protected readonly selectedVocabWord = signal('');
  protected readonly showVocabPopup = signal(false);

  protected readonly hasFeedback = computed(() => {
    const fb = this.feedback();
    return (
      fb.grammarCorrections.length > 0 ||
      fb.vocabularySuggestions.length > 0 ||
      fb.pronunciationTips.length > 0
    );
  });

  protected toggle(): void {
    this.expanded.update((v) => !v);
  }

  protected openVocabPopup(word: string): void {
    this.selectedVocabWord.set(word);
    this.showVocabPopup.set(true);
  }

  protected closeVocabPopup(): void {
    this.showVocabPopup.set(false);
  }

  protected onVocabAddToReview(word: string): void {
    this.addToReview.emit(word);
    this.showVocabPopup.set(false);
  }
}
