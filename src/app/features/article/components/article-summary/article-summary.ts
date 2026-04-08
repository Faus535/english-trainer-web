import { Component, ChangeDetectionStrategy, inject, input, computed } from '@angular/core';
import { Router } from '@angular/router';
import {
  ArticleResponse,
  SavedWord,
  QuestionAnswer,
  SummaryStats,
} from '../../models/article.model';

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
  readonly totalQuestions = input(0);

  protected readonly summaryStats = computed<SummaryStats>(() => {
    const answers = this.answers();
    const savedWords = this.savedWords();

    const answeredCorrectly = answers.filter((a) => a.result.isContentCorrect).length;
    const totalWords = savedWords.length;

    const baseXp = 25;
    const correctAnswerXp = answeredCorrectly * 5;
    const markedWordsXp = totalWords * 2;
    const totalXp = baseXp + correctAnswerXp + markedWordsXp;

    return {
      totalQuestions: this.totalQuestions(),
      answeredCorrectly,
      totalWords,
      xpBreakdown: {
        baseXp,
        correctAnswerXp,
        markedWordsXp,
        totalXp,
      },
    };
  });

  protected goHome(): void {
    this.router.navigate(['/home']);
  }
}
