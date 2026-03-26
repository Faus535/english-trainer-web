import { Component, ChangeDetectionStrategy, inject, OnInit, effect } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { QuickStart } from './components/quick-start/quick-start';
import { ModuleCard } from './components/module-card/module-card';
import { StatsSummary } from './components/stats-summary/stats-summary';
import { SoundOfDay } from './components/sound-of-day/sound-of-day';
import { PhraseRoulette } from './components/phrase-roulette/phrase-roulette';
import { Motivation } from './components/motivation/motivation';
import { CurrentLevels } from './components/current-levels/current-levels';
import { StreakBanner } from './components/streak-banner/streak-banner';
import { LevelUpPopup } from './components/level-up-popup/level-up-popup';
import { LearningPathCard } from './components/learning-path-card/learning-path-card';
import { TodaysPlanComponent } from './components/todays-plan/todays-plan';
import { DashboardWeakAreas } from './components/weak-areas/weak-areas';
import { MilestoneFeed } from './components/milestone-feed/milestone-feed';
import { StateService } from '../../shared/services/state.service';
import { GamificationService } from './services/gamification.service';
import { AuthService } from '../../core/services/auth.service';

import { ReviewWidget } from './components/review-widget/review-widget';
import { GamesWidget } from './components/games-widget/games-widget';

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
    StreakBanner,
    LevelUpPopup,
    LearningPathCard,
    TodaysPlanComponent,
    DashboardWeakAreas,
    MilestoneFeed,
    RouterLink,
    ReviewWidget,
    GamesWidget,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard implements OnInit {
  private readonly router = inject(Router);
  private readonly state = inject(StateService);
  private readonly gamification = inject(GamificationService);
  private readonly auth = inject(AuthService);

  protected readonly testCompleted = this.state.testCompleted;
  protected readonly pendingLevelUp = this.gamification.pendingLevelUp;

  protected readonly learningStatus = this.state.learningPath.learningStatus;
  protected readonly hasPath = this.state.learningPath.hasPath;
  protected readonly isLoadingPath = this.state.learningPath.isLoading;

  constructor() {
    effect(() => {
      this.gamification.level();
      this.gamification.checkForLevelUp();
    });
  }

  ngOnInit(): void {
    this.state.loadFromBackend();

    const profileId = this.auth.profileId();
    if (profileId) {
      this.state.learningPath.loadStatus(profileId);
    }
  }

  protected onSessionStarted(): void {
    this.router.navigate(['/session']);
  }

  protected onLevelUpDismissed(): void {
    this.gamification.dismissLevelUp();
  }
}
