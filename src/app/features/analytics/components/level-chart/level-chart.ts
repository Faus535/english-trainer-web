import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { ModuleLevelHistoryResponse } from '../../../../shared/models/api.model';

const LEVEL_INDEX: Record<string, number> = { a1: 0, a2: 1, b1: 2, b2: 3, c1: 4 };
const MODULE_COLORS: Record<string, string> = {
  listening: '#f97316',
  vocabulary: '#22c55e',
  grammar: '#8b5cf6',
  phrases: '#eab308',
  pronunciation: '#6366f1',
};

@Component({
  selector: 'app-level-chart',
  imports: [UpperCasePipe],
  templateUrl: './level-chart.html',
  styleUrl: './level-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelChart {
  readonly history = input.required<ModuleLevelHistoryResponse[]>();
  protected readonly chartData = computed(() =>
    this.history().map((mod) => ({
      name: mod.moduleName,
      color: MODULE_COLORS[mod.moduleName] ?? '#6366f1',
      currentLevel: mod.history.length > 0 ? mod.history[mod.history.length - 1].level : 'a1',
      progress:
        mod.history.length > 0
          ? (((LEVEL_INDEX[mod.history[mod.history.length - 1].level] ?? 0) + 1) / 5) * 100
          : 20,
    })),
  );
  protected readonly levels = ['A1', 'A2', 'B1', 'B2', 'C1'];
}
