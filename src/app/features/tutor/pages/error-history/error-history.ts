import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../../../shared/components/icon/icon';
import { LucideIconData, ArrowLeft, Check, AlertTriangle, BarChart3 } from 'lucide-angular';
import { AuthService } from '../../../../core/services/auth.service';
import { ErrorPatternService } from '../../../../shared/services/error-pattern.service';
import {
  ErrorPattern,
  ErrorCategory,
  ErrorSummary,
} from '../../../../shared/models/error-pattern.model';

type TabId = 'grammar' | 'vocabulary' | 'pronunciation';

interface Tab {
  id: TabId;
  label: string;
  categories: ErrorCategory[];
}

const TABS: Tab[] = [
  {
    id: 'grammar',
    label: 'Gramatica',
    categories: [
      'TENSE',
      'ARTICLE',
      'PREPOSITION',
      'WORD_ORDER',
      'SUBJECT_VERB_AGREEMENT',
      'PUNCTUATION',
    ],
  },
  {
    id: 'vocabulary',
    label: 'Vocabulario',
    categories: ['VOCABULARY', 'SPELLING'],
  },
  {
    id: 'pronunciation',
    label: 'Pronunciacion',
    categories: ['OTHER'],
  },
];

@Component({
  selector: 'app-error-history',
  imports: [RouterLink, Icon],
  templateUrl: './error-history.html',
  styleUrl: './error-history.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorHistory implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly errorService = inject(ErrorPatternService);

  protected readonly backIcon: LucideIconData = ArrowLeft;
  protected readonly checkIcon: LucideIconData = Check;
  protected readonly alertIcon: LucideIconData = AlertTriangle;
  protected readonly chartIcon: LucideIconData = BarChart3;

  protected readonly tabs = TABS;
  protected readonly activeTab = signal<TabId>('grammar');
  protected readonly loading = signal(true);
  protected readonly allPatterns = signal<ErrorPattern[]>([]);
  protected readonly summary = signal<ErrorSummary | null>(null);

  protected readonly activeCount = computed(() => {
    const s = this.summary();
    if (!s) return 0;
    return s.totalErrors - s.resolvedCount;
  });

  protected readonly filteredPatterns = computed(() => {
    const tab = TABS.find((t) => t.id === this.activeTab());
    if (!tab) return [];
    return this.allPatterns()
      .filter((p) => tab.categories.includes(p.category))
      .sort((a, b) => b.occurrenceCount - a.occurrenceCount);
  });

  protected readonly categoryBars = computed(() => {
    const s = this.summary();
    if (!s) return [];
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

  protected readonly tabCounts = computed(() => {
    const patterns = this.allPatterns();
    const counts: Record<TabId, number> = { grammar: 0, vocabulary: 0, pronunciation: 0 };
    for (const tab of TABS) {
      counts[tab.id] = patterns.filter((p) => tab.categories.includes(p.category)).length;
    }
    return counts;
  });

  ngOnInit(): void {
    this.loadErrors();
  }

  protected setTab(tabId: TabId): void {
    this.activeTab.set(tabId);
  }

  protected formatCategory(category: string): string {
    return category
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  protected formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  }

  private loadErrors(): void {
    const profileId = this.auth.profileId();
    if (!profileId) {
      this.loading.set(false);
      return;
    }

    this.errorService.getErrorPatterns(profileId).subscribe({
      next: (patterns) => {
        this.allPatterns.set(patterns);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.errorService.getErrorSummary(profileId).subscribe({
      next: (summary) => this.summary.set(summary),
    });
  }
}
