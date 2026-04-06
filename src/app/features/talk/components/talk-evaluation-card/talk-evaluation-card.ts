import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { TalkEvaluation } from '../../models/talk.model';

interface ScoreBar {
  label: string;
  value: number;
  cssClass: string;
}

@Component({
  selector: 'app-talk-evaluation-card',
  templateUrl: './talk-evaluation-card.html',
  styleUrl: './talk-evaluation-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TalkEvaluationCard {
  readonly evaluation = input.required<TalkEvaluation>();

  protected readonly scores = computed<ScoreBar[]>(() => {
    const ev = this.evaluation();
    return [
      {
        label: 'Grammar',
        value: ev.grammarAccuracy,
        cssClass: this.scoreClass(ev.grammarAccuracy),
      },
      {
        label: 'Vocabulary',
        value: ev.vocabularyRange,
        cssClass: this.scoreClass(ev.vocabularyRange),
      },
      { label: 'Fluency', value: ev.fluency, cssClass: this.scoreClass(ev.fluency) },
      { label: 'Task', value: ev.taskCompletion, cssClass: this.scoreClass(ev.taskCompletion) },
    ];
  });

  protected readonly overallClass = computed(() => this.scoreClass(this.evaluation().overallScore));

  private scoreClass(value: number): string {
    if (value >= 70) return 'score--good';
    if (value >= 50) return 'score--ok';
    return 'score--low';
  }
}
