import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ArticleStateService } from '../../services/article-state.service';
import { ArticleStatus } from '../../models/article.model';

@Component({
  selector: 'app-article-history',
  imports: [RouterLink],
  templateUrl: './article-history.html',
  styleUrl: './article-history.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleHistory {
  private readonly state = inject(ArticleStateService);
  private readonly router = inject(Router);

  protected readonly history = this.state.history;
  protected readonly historyLoading = this.state.historyLoading;
  protected readonly hasHistory = this.state.hasHistory;
  protected readonly confirmingDeleteId = signal<string | null>(null);

  constructor() {
    this.state.loadHistory();
  }

  protected resume(articleId: string): void {
    this.router.navigate(['/article', articleId]);
  }

  protected requestDelete(articleId: string): void {
    this.confirmingDeleteId.set(articleId);
  }

  protected cancelDelete(): void {
    this.confirmingDeleteId.set(null);
  }

  protected confirmDelete(articleId: string): void {
    this.state.deleteArticleFromHistory(articleId);
    this.confirmingDeleteId.set(null);
  }

  protected statusLabel(status: ArticleStatus): string {
    const labels: Record<ArticleStatus, string> = {
      PENDING: 'Pending',
      PROCESSING: 'Processing...',
      READY: 'Ready',
      FAILED: 'Failed',
      IN_PROGRESS: 'In Progress',
      COMPLETED: 'Completed',
    };
    return labels[status] ?? status;
  }

  protected formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}
