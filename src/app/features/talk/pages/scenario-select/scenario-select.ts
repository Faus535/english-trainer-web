import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { TalkApiService } from '../../services/talk-api.service';
import { ScenarioCategory, Scenario, QuickChallenge } from '../../models/talk.model';
import { ScenarioCard } from '../../components/scenario-card/scenario-card';
import { QuickChallengeCard } from '../../components/quick-challenge-card/quick-challenge-card';

@Component({
  selector: 'app-scenario-select',
  imports: [ScenarioCard, QuickChallengeCard],
  templateUrl: './scenario-select.html',
  styleUrl: './scenario-select.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScenarioSelect implements OnInit {
  private readonly talkApi = inject(TalkApiService);
  private readonly router = inject(Router);

  protected readonly categories = signal<ScenarioCategory[]>([]);
  protected readonly quickChallenges = signal<QuickChallenge[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  protected readonly skeletons = Array.from({ length: 6 });

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.set(true);
    this.error.set(null);

    forkJoin({
      scenarios: this.talkApi.listScenarios(),
      challenges: this.talkApi.listQuickChallenges(),
    }).subscribe({
      next: ({ scenarios, challenges }) => {
        this.categories.set(scenarios);
        this.quickChallenges.set(challenges);
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

  protected onQuickChallengeSelected(challenge: QuickChallenge): void {
    this.router.navigate(['/talk', 'conversation'], {
      queryParams: {
        mode: 'QUICK',
        challengeId: challenge.id,
        title: encodeURIComponent(challenge.title),
      },
    });
  }

  protected retry(): void {
    this.loadData();
  }
}
