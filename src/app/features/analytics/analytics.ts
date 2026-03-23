import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { AnalyticsApiService } from './services/analytics-api.service';
import { AuthService } from '../../core/services/auth.service';
import { ErrorPatternService } from '../../shared/services/error-pattern.service';
import {
  AnalyticsSummaryResponse,
  ModuleLevelHistoryResponse,
  WeakAreaResponse,
} from '../../shared/models/api.model';
import { ErrorPattern, ErrorSummary } from '../../shared/models/error-pattern.model';
import { LevelChart } from './components/level-chart/level-chart';
import { ActivityHeatmap } from './components/activity-heatmap/activity-heatmap';
import { WeakAreas } from './components/weak-areas/weak-areas';
import { ErrorTrends } from './components/error-trends/error-trends';

@Component({
  selector: 'app-analytics',
  imports: [LevelChart, ActivityHeatmap, WeakAreas, ErrorTrends],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Analytics implements OnInit {
  private readonly analyticsApi = inject(AnalyticsApiService);
  private readonly errorPatternService = inject(ErrorPatternService);
  private readonly auth = inject(AuthService);
  protected readonly summary = signal<AnalyticsSummaryResponse | null>(null);
  protected readonly levelHistory = signal<ModuleLevelHistoryResponse[]>([]);
  protected readonly heatmapData = signal<Record<string, number>>({});
  protected readonly weakAreas = signal<WeakAreaResponse[]>([]);
  protected readonly errorPatterns = signal<ErrorPattern[]>([]);
  protected readonly errorSummary = signal<ErrorSummary | null>(null);
  protected readonly loading = signal(true);

  protected readonly sessionsChange = computed(() => {
    const s = this.summary();
    if (!s || s.sessionsLastWeek === 0) return null;
    return Math.round(((s.sessionsThisWeek - s.sessionsLastWeek) / s.sessionsLastWeek) * 100);
  });

  ngOnInit(): void {
    const pid = this.auth.profileId();
    if (!pid) return;
    this.analyticsApi.getSummary(pid).subscribe({ next: (s) => this.summary.set(s) });
    this.analyticsApi.getLevelHistory(pid).subscribe({ next: (h) => this.levelHistory.set(h) });
    this.analyticsApi.getHeatmap(pid).subscribe({
      next: (h) => {
        this.heatmapData.set(h.dates);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
    this.analyticsApi.getWeakAreas(pid).subscribe({ next: (w) => this.weakAreas.set(w) });
    this.errorPatternService.getErrorPatterns(pid).subscribe({
      next: (p) => this.errorPatterns.set(p),
    });
    this.errorPatternService.getErrorSummary(pid).subscribe({
      next: (s) => this.errorSummary.set(s),
    });
  }
}
