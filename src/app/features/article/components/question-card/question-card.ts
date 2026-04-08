import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { ArticleQuestion, AnswerResult } from '../../models/article.model';

@Component({
  selector: 'app-question-card',
  imports: [ReactiveFormsModule],
  templateUrl: './question-card.html',
  styleUrl: './question-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionCard {
  readonly question = input.required<ArticleQuestion>();
  readonly answered = input(false);
  readonly previousAnswer = input<AnswerResult | undefined>(undefined);
  readonly hint = input<string | null>(null);
  readonly submitting = input(false);
  readonly result = input<AnswerResult | null>(null);

  readonly answerSubmitted = output<string>();
  readonly hintRequested = output<void>();
  readonly nextRequested = output<void>();

  protected readonly answerCtrl = new FormControl('');

  private readonly answerValue = toSignal(this.answerCtrl.valueChanges, { initialValue: '' });

  protected readonly wordCount = computed(() => {
    const value = this.answerValue() ?? '';
    return value.trim().split(/\s+/).filter(Boolean).length;
  });

  protected readonly minWords = computed(() => this.question().minWords ?? 40);

  protected readonly canSubmit = computed(
    () => this.wordCount() >= this.minWords() && !this.submitting() && !this.result(),
  );

  protected onSubmit(): void {
    if (!this.canSubmit()) return;
    this.answerSubmitted.emit(this.answerCtrl.value!.trim());
  }
}
