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
import {
  AnalyticsSummaryResponse,
  ModuleLevelHistoryResponse,
  WeakAreaResponse,
} from '../../shared/models/api.model';
import { LevelChart } from './components/level-chart/level-chart';
import { ActivityHeatmap } from './components/activity-heatmap/activity-heatmap';
import { WeakAreas } from './components/weak-areas/weak-areas';

@Component({
  selector: 'app-analytics',
  imports: [LevelChart, ActivityHeatmap, WeakAreas],
  templateUrl: './analytics.html',
  styleUrl: './analytics.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Analytics implements OnInit {
  private readonly analyticsApi = inject(AnalyticsApiService);
  private readonly auth = inject(AuthService);
  protected readonly summary = signal<AnalyticsSummaryResponse | null>(null);
  protected readonly levelHistory = signal<ModuleLevelHistoryResponse[]>([]);
  protected readonly heatmapData = signal<Record<string, number>>({});
  protected readonly weakAreas = signal<WeakAreaResponse[]>([]);
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
  }
}
