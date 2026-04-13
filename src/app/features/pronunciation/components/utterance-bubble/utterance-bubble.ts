import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { ProgressRing } from '../../../../shared/components/progress-ring/progress-ring';
import { MiniConversationTurn, WordFeedback } from '../../models/pronunciation.model';

@Component({
  selector: 'app-utterance-bubble',
  imports: [ProgressRing],
  templateUrl: './utterance-bubble.html',
  styleUrl: './utterance-bubble.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UtteranceBubble {
  readonly turn = input.required<MiniConversationTurn>();

  protected scoreClass(score: number): string {
    if (score < 50) return 'score-low';
    if (score < 80) return 'score-mid';
    return 'score-ok';
  }

  protected wordLabel(wf: WordFeedback): string {
    const band = wf.score < 50 ? 'low score' : wf.score < 80 ? 'mid score' : 'good score';
    return `${wf.word} — ${band}: pronounced as '${wf.recognized}'`;
  }

  protected wordFeedbackFor(word: string): WordFeedback | undefined {
    return this.turn().wordFeedback.find((wf) => wf.word === word);
  }

  protected get recognizedWords(): string[] {
    const text = this.turn().recognizedText;
    return text ? text.split(/\s+/) : [];
  }
}
