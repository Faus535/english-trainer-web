import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { WeakArea } from '../../../../shared/models/learning-path.model';

@Component({
  selector: 'app-dashboard-weak-areas',
  standalone: true,
  templateUrl: './weak-areas.html',
  styleUrl: './weak-areas.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardWeakAreas {
  readonly areas = input<WeakArea[]>([]);

  protected readonly sortedAreas = computed(() =>
    [...this.areas()].sort((a, b) => a.masteryScore - b.masteryScore),
  );
}
