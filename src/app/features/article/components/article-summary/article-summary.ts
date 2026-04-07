import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ArticleResponse, SavedWord, QuestionAnswer } from '../../models/article.model';

@Component({
  selector: 'app-article-summary',
  templateUrl: './article-summary.html',
  styleUrl: './article-summary.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleSummary {
  private readonly router = inject(Router);

  readonly article = input.required<ArticleResponse>();
  readonly savedWords = input.required<SavedWord[]>();
  readonly answers = input.required<QuestionAnswer[]>();

  protected goHome(): void {
    this.router.navigate(['/home']);
  }
}
