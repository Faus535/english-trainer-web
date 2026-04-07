import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticleStateService } from '../../services/article-state.service';
import { QuestionCard } from '../../components/question-card/question-card';
import { ArticleSummary } from '../../components/article-summary/article-summary';

@Component({
  selector: 'app-article-questions',
  imports: [QuestionCard, ArticleSummary],
  templateUrl: './article-questions.html',
  styleUrl: './article-questions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArticleQuestions {
  protected readonly state = inject(ArticleStateService);
  private readonly route = inject(ActivatedRoute);

  protected readonly article = this.state.article;
  protected readonly currentQuestion = this.state.currentQuestion;
  protected readonly currentQuestionIndex = this.state.currentQuestionIndex;
  protected readonly qaComplete = this.state.qaComplete;
  protected readonly activeHint = this.state.activeHint;
  protected readonly savedWords = this.state.savedWords;

  protected readonly currentResult = computed(
    () =>
      this.state.answers().find((a) => a.questionId === this.state.currentQuestion()?.id)?.result ??
      null,
  );

  private readonly articleId: string;

  constructor() {
    this.articleId = this.route.snapshot.paramMap.get('articleId') ?? '';
    if (this.state.questions().length === 0 && this.articleId) {
      this.state.loadQuestions(this.articleId);
    }
  }

  protected onAnswerSubmitted(answer: string): void {
    const question = this.state.currentQuestion();
    if (!question) return;
    this.state.submitAnswer(this.articleId, question.id, answer);
  }

  protected onHintRequested(): void {
    const question = this.state.currentQuestion();
    if (!question) return;
    this.state.loadHint(this.articleId, question.id);
  }

  protected onNextQuestion(): void {
    this.state.advanceQuestion();
  }
}
