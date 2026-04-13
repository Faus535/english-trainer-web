import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ProgressRing } from '../../../../shared/components/progress-ring/progress-ring';
import { PronunciationFeedbackResponse, WordFeedback } from '../../models/pronunciation.model';

@Component({
  selector: 'app-feedback-panel',
  imports: [ProgressRing],
  templateUrl: './feedback-panel.html',
  styleUrl: './feedback-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackPanel {
  readonly result = input.required<PronunciationFeedbackResponse>();

  protected scoreClass(score: number): string {
    if (score < 50) return 'score-low';
    if (score < 80) return 'score-mid';
    return 'score-ok';
  }

  protected scoreLabel(word: WordFeedback): string {
    return `${word.word} — score: ${word.score}`;
  }
}
