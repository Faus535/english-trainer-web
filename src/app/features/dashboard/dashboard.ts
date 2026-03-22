import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { QuickStart } from './components/quick-start/quick-start';
import { ModuleCard } from './components/module-card/module-card';
import { StatsSummary } from './components/stats-summary/stats-summary';
import { SoundOfDay } from './components/sound-of-day/sound-of-day';
import { PhraseRoulette } from './components/phrase-roulette/phrase-roulette';
import { Motivation } from './components/motivation/motivation';
import { CurrentLevels } from './components/current-levels/current-levels';
import { StateService } from '../../shared/services/state.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    QuickStart,
    ModuleCard,
    StatsSummary,
    SoundOfDay,
    PhraseRoulette,
    Motivation,
    CurrentLevels,
    RouterLink,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private readonly router = inject(Router);
  private readonly state = inject(StateService);

  protected readonly testCompleted = this.state.testCompleted;

  ngOnInit(): void {
    this.state.loadFromBackend();
  }

  protected onSessionStarted(): void {
    this.router.navigate(['/session']);
  }
}
