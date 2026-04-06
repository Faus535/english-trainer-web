import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TalkApiService } from '../../services/talk-api.service';
import { ScenarioCategory, Scenario } from '../../models/talk.model';
import { ScenarioCard } from '../../components/scenario-card/scenario-card';

@Component({
  selector: 'app-scenario-select',
  imports: [ScenarioCard],
  templateUrl: './scenario-select.html',
  styleUrl: './scenario-select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScenarioSelect implements OnInit {
  private readonly talkApi = inject(TalkApiService);
  private readonly router = inject(Router);

  protected readonly categories = signal<ScenarioCategory[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly skeletons = Array.from({ length: 6 });

  ngOnInit(): void {
    this.loadScenarios();
  }

  private loadScenarios(): void {
    this.loading.set(true);
    this.error.set(null);

    this.talkApi.listScenarios().subscribe({
      next: (data) => {
        this.categories.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load scenarios');
        this.loading.set(false);
      },
    });
  }

  protected onScenarioSelected(scenario: Scenario): void {
    this.router.navigate(['/talk', 'conversation'], {
      queryParams: { scenarioId: scenario.id, level: scenario.cefrLevel },
    });
  }

  protected retry(): void {
    this.loadScenarios();
  }
}
