import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'app-quick-progress-bar',
  imports: [],
  templateUrl: './quick-progress-bar.html',
  styleUrl: './quick-progress-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickProgressBar {
  readonly exchangeCount = input.required<number>();
  readonly totalExchanges = input<number>(3);
  readonly challengeTitle = input<string | null>(null);

  protected readonly fillPercent = computed(() => {
    const total = this.totalExchanges();
    if (total === 0) return 0;
    return Math.min(100, (this.exchangeCount() / total) * 100);
  });
}
