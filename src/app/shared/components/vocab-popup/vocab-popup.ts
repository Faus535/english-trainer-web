import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';

import { Icon } from '../icon/icon';
import { LucideIconData, Volume2, X, BookPlus } from 'lucide-angular';
import { TtsService } from '../../services/tts.service';

function generateExamples(word: string): string[] {
  const clean = word.toLowerCase().replace(/[^a-z'-]/g, '');
  return [
    `I need to use the word "${clean}" in a sentence.`,
    `Can you explain what "${clean}" means?`,
  ];
}

@Component({
  selector: 'app-vocab-popup',
  imports: [Icon],
  templateUrl: './vocab-popup.html',
  styleUrl: './vocab-popup.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VocabPopup {
  private readonly tts = inject(TtsService);

  readonly word = input.required<string>();
  readonly visible = input.required<boolean>();

  readonly closed = output<void>();
  readonly addToReview = output<string>();

  protected readonly speakIcon: LucideIconData = Volume2;
  protected readonly closeIcon: LucideIconData = X;
  protected readonly addIcon: LucideIconData = BookPlus;

  protected readonly examples = computed(() => generateExamples(this.word()));

  protected speak(): void {
    this.tts.speak(this.word());
  }

  protected close(): void {
    this.closed.emit();
  }

  protected add(): void {
    this.addToReview.emit(this.word());
  }

  protected onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('backdrop')) {
      this.close();
    }
  }
}
