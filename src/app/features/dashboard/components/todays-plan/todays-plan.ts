import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { TodaysPlan } from '../../../../shared/models/learning-path.model';

@Component({
  selector: 'app-todays-plan',
  standalone: true,
  templateUrl: './todays-plan.html',
  styleUrl: './todays-plan.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodaysPlanComponent {
  readonly plan = input.required<TodaysPlan>();

  readonly sessionStarted = output<string>();

  protected readonly totalItems = computed(
    () => this.plan().newItemsCount + this.plan().reviewItemsCount,
  );

  protected readonly sessionLabel = computed(() => {
    const mode = this.plan().suggestedSessionMode;
    switch (mode) {
      case 'short':
        return 'Sesion corta';
      case 'full':
        return 'Sesion completa';
      case 'extended':
        return 'Sesion extendida';
    }
  });

  protected startSession(): void {
    this.sessionStarted.emit(this.plan().suggestedSessionMode);
  }
}
