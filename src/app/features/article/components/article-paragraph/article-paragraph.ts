import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  output,
  effect,
  DestroyRef,
} from '@angular/core';
import { TtsService } from '../../../../shared/services/tts.service';
import { ArticleParagraphDto, SavedWordDraft } from '../../models/article.model';

@Component({
  selector: 'app-article-paragraph',
  templateUrl: './article-paragraph.html',
  styleUrl: './article-paragraph.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleParagraph {
  protected readonly tts = inject(TtsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly paragraph = input.required<ArticleParagraphDto>();
  readonly isActive = input.required<boolean>();

  readonly readCompleted = output<void>();
  readonly wordSelected = output<SavedWordDraft>();

  constructor() {
    effect(() => {
      const para = this.paragraph();
      const active = this.isActive();

      if (active && para.speaker === 'AI') {
        this.tts.speak(para.content, () => this.readCompleted.emit());
      } else if (!active && this.tts.speaking()) {
        this.tts.stop();
      }
    });

    this.destroyRef.onDestroy(() => this.tts.stop());
  }

  protected onMarkRead(): void {
    this.readCompleted.emit();
  }

  protected onSkipTts(): void {
    this.tts.stop();
    this.readCompleted.emit();
  }

  protected onTextSelect(): void {
    window.setTimeout(() => {
      const selection = window.getSelection()?.toString().trim();
      if (!selection) return;
      this.wordSelected.emit({
        wordOrPhrase: selection,
        contextSentence: this.paragraph().content,
      });
    }, 0);
  }
}
