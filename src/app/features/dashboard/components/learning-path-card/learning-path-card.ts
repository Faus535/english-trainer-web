import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { LearningStatus } from '../../../../shared/models/learning-path.model';

@Component({
  selector: 'app-learning-path-card',
  standalone: true,
  templateUrl: './learning-path-card.html',
  styleUrl: './learning-path-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LearningPathCard {
  readonly status = input.required<LearningStatus>();

  protected readonly currentUnitName = computed(() => this.status().currentUnit.name);

  protected readonly masteryScore = computed(() => this.status().currentUnit.masteryScore);

  protected readonly progressPercent = computed(
    () => this.status().overallProgress.percentComplete,
  );

  protected readonly unitsCompleted = computed(() => this.status().overallProgress.unitsCompleted);

  protected readonly totalUnits = computed(() => this.status().overallProgress.totalUnits);

  protected readonly nextUnitName = computed(() => this.status().nextUnit?.name ?? null);
}
