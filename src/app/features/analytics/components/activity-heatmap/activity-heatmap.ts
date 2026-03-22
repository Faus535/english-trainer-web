import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'app-activity-heatmap',
  templateUrl: './activity-heatmap.html',
  styleUrl: './activity-heatmap.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityHeatmap {
  readonly dates = input.required<Record<string, number>>();

  protected readonly cells = computed(() => {
    const dateMap = this.dates();
    const cells: { date: string; level: number }[] = [];
    const today = new Date();
    const start = new Date(today);
    start.setDate(start.getDate() - 364);
    for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      const key = d.toISOString().slice(0, 10);
      const count = dateMap[key] ?? 0;
      cells.push({
        date: key,
        level: count === 0 ? 0 : count <= 1 ? 1 : count <= 3 ? 2 : count <= 5 ? 3 : 4,
      });
    }
    return cells;
  });

  protected readonly months = computed(() => {
    const labels: string[] = [];
    const today = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      labels.push(d.toLocaleDateString('es-ES', { month: 'short' }));
    }
    return labels;
  });

  protected readonly totalActiveDays = computed(
    () => this.cells().filter((c) => c.level > 0).length,
  );
}
