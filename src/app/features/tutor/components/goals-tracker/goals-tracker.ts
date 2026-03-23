import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { Icon } from '../../../../shared/components/icon/icon';
import { LucideIconData, Target, Check, Circle } from 'lucide-angular';

export interface GoalProgress {
  description: string;
  completed: boolean;
  progress?: string;
}

@Component({
  selector: 'app-goals-tracker',
  imports: [Icon],
  templateUrl: './goals-tracker.html',
  styleUrl: './goals-tracker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoalsTracker {
  readonly goals = input.required<string[]>();

  protected readonly targetIcon: LucideIconData = Target;
  protected readonly checkIcon: LucideIconData = Check;
  protected readonly circleIcon: LucideIconData = Circle;
}
