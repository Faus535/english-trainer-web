import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { QuickStart } from './components/quick-start/quick-start';
import { ModuleCard } from './components/module-card/module-card';
import { StatsSummary } from './components/stats-summary/stats-summary';
import { SoundOfDay } from './components/sound-of-day/sound-of-day';
import { PhraseRoulette } from './components/phrase-roulette/phrase-roulette';
import { Motivation } from './components/motivation/motivation';
import { CurrentLevels } from './components/current-levels/current-levels';

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
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {
  private readonly router = inject(Router);

  protected onSessionStarted(): void {
    this.router.navigate(['/session']);
  }
}
