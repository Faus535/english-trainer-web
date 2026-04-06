import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { Icon } from '../../../../shared/components/icon/icon';
import { LucideIconData, Check, ArrowUp, Award } from 'lucide-angular';
import { TalkEvaluation } from '../../models/talk.model';

interface ScoreBar {
  label: string;
  value: number;
  cssClass: string;
}

@Component({
  selector: 'app-evaluation-card',
  imports: [Icon],
  templateUrl: './evaluation-card.html',
  styleUrl: './evaluation-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluationCard {
  readonly evaluation = input.required<TalkEvaluation>();
  readonly selectedLevel = input<string>();

  protected readonly checkIcon: LucideIconData = Check;
  protected readonly arrowUpIcon: LucideIconData = ArrowUp;
  protected readonly awardIcon: LucideIconData = Award;

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

  protected readonly levelComparison = computed(() => {
    const selected = this.selectedLevel();
    const demonstrated = this.evaluation().levelDemonstrated;
    if (!selected) return null;
    if (selected.toLowerCase() === demonstrated.toLowerCase()) return null;
    return { selected: selected.toUpperCase(), demonstrated: demonstrated.toUpperCase() };
  });

  private scoreClass(value: number): string {
    if (value >= 70) return 'score--good';
    if (value >= 50) return 'score--ok';
    return 'score--low';
  }
}
