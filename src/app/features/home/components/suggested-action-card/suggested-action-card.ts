import { Component, ChangeDetectionStrategy, input, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { SuggestedModule } from '../../models/home.model';

interface ModuleConfig {
  title: string;
  subtitle: string;
  route: string;
  icon: string;
  dataType: string;
}

const MODULE_CONFIGS: Record<SuggestedModule, ModuleConfig> = {
  REVIEW: {
    title: 'Time to review!',
    subtitle: 'words due',
    route: '/review',
    icon: '🔁',
    dataType: 'review',
  },
  ARTICLE: {
    title: 'Read an article',
    subtitle: 'Build your reading skills',
    route: '/article',
    icon: '📖',
    dataType: 'article',
  },
  IMMERSE: {
    title: 'Immerse yourself',
    subtitle: 'Context-based learning',
    route: '/immerse',
    icon: '🎧',
    dataType: 'immerse',
  },
  TALK: {
    title: 'Practice speaking',
    subtitle: 'Quick conversation',
    route: '/talk',
    icon: '💬',
    dataType: 'talk',
  },
};

@Component({
  selector: 'app-suggested-action-card',
  imports: [],
  templateUrl: './suggested-action-card.html',
  styleUrl: './suggested-action-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestedActionCard {
  readonly suggestedModule = input.required<SuggestedModule>();
  readonly dueReviewCount = input<number>(0);
  private readonly router = inject(Router);

  protected readonly config = computed<ModuleConfig>(() => MODULE_CONFIGS[this.suggestedModule()]);

  protected readonly subtitle = computed(() => {
    const cfg = this.config();
    if (this.suggestedModule() === 'REVIEW') {
      return `${this.dueReviewCount()} ${cfg.subtitle}`;
    }
    return cfg.subtitle;
  });

  protected navigate(): void {
    this.router.navigate([this.config().route]);
  }
}
