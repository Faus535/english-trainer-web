import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { Icon } from '../../../../shared/components/icon/icon';
import { LucideIconData, Check, TrendingDown } from 'lucide-angular';
import { ErrorPattern, ErrorSummary } from '../../../../shared/models/error-pattern.model';

interface CategoryBar {
  category: string;
  count: number;
  percentage: number;
}

@Component({
  selector: 'app-error-trends',
  imports: [Icon],
  templateUrl: './error-trends.html',
  styleUrl: './error-trends.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorTrends {
  readonly summary = input.required<ErrorSummary>();
  readonly patterns = input.required<ErrorPattern[]>();

  protected readonly checkIcon: LucideIconData = Check;
  protected readonly trendIcon: LucideIconData = TrendingDown;

  protected readonly categoryBars = computed<CategoryBar[]>(() => {
    const s = this.summary();
    const max = Math.max(...Object.values(s.categoryCounts), 1);
    return Object.entries(s.categoryCounts)
      .filter(([, count]) => count > 0)
      .sort(([, a], [, b]) => b - a)
      .map(([category, count]) => ({
        category: this.formatCategory(category),
        count,
        percentage: Math.round((count / max) * 100),
      }));
  });

  protected readonly topPatterns = computed(() => {
    return this.patterns()
      .filter((p) => !p.resolved)
      .sort((a, b) => b.occurrenceCount - a.occurrenceCount)
      .slice(0, 5);
  });

  protected readonly resolvedPatterns = computed(() => {
    return this.patterns().filter((p) => p.resolved);
  });

  private formatCategory(category: string): string {
    return category
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }
}
