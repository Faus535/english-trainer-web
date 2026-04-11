import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import {
  Subscription,
  interval,
  switchMap,
  takeWhile,
  timeout,
  retry,
  catchError,
  EMPTY,
} from 'rxjs';
import { ArticleApiService } from './article-api.service';
import { ProfileApiService } from '../../../core/services/profile-api.service';
import { AuthService } from '../../../core/services/auth.service';
import { GenerationStep, GENERATION_STEPS } from '../../immerse/models/immerse.model';
import {
  GenerateArticleRequest,
  ArticleResponse,
  SavedWordDraft,
  SavedWord,
  ArticleQuestion,
  AnswerResult,
  QuestionAnswer,
  ArticleHistoryItem,
} from '../models/article.model';

@Injectable({ providedIn: 'root' })
export class ArticleStateService {
  private readonly articleApi = inject(ArticleApiService);
  private readonly profileApi = inject(ProfileApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  private _sessionStartedAt = 0;

  // Generation
  private readonly _generating = signal(false);
  private readonly _generationStep = signal<GenerationStep>('idle');
  private readonly _generationProgress = signal(0);
  private readonly _generationError = signal<string | null>(null);

  // Reader
  private readonly _article = signal<ArticleResponse | null>(null);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _currentParagraphIndex = signal(0);
  private readonly _readingComplete = signal(false);

  // Word marking (Phase 2)
  private readonly _activeWord = signal<SavedWordDraft | null>(null);
  private readonly _savedWords = signal<SavedWord[]>([]);

  // Pre-reading (Phase 7)
  private readonly _keyWords = signal<SavedWord[]>([]);
  private readonly _predictiveQuestion = signal<string | null>(null);
  private readonly _preReadingLoading = signal(false);
  private readonly _preReadingComplete = signal(false);

  // History (Phase 6)
  private readonly _history = signal<ArticleHistoryItem[]>([]);
  private readonly _historyLoading = signal(false);

  // Q&A (Phase 3)
  private readonly _questions = signal<ArticleQuestion[]>([]);
  private readonly _currentQuestionIndex = signal(0);
  private readonly _answers = signal<QuestionAnswer[]>([]);
  private readonly _activeHint = signal<string | null>(null);
  private readonly _qaComplete = signal(false);

  private _pollingSub: Subscription | null = null;
  private _elapsedTimer: Subscription | null = null;

  readonly generating = this._generating.asReadonly();
  readonly generationStep = this._generationStep.asReadonly();
  readonly generationProgress = this._generationProgress.asReadonly();
  readonly generationError = this._generationError.asReadonly();
  readonly article = this._article.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly currentParagraphIndex = this._currentParagraphIndex.asReadonly();
  readonly readingComplete = this._readingComplete.asReadonly();
  readonly activeWord = this._activeWord.asReadonly();
  readonly savedWords = this._savedWords.asReadonly();
  readonly keyWords = this._keyWords.asReadonly();
  readonly predictiveQuestion = this._predictiveQuestion.asReadonly();
  readonly preReadingLoading = this._preReadingLoading.asReadonly();
  readonly preReadingComplete = this._preReadingComplete.asReadonly();
  readonly history = this._history.asReadonly();
  readonly historyLoading = this._historyLoading.asReadonly();
  readonly hasHistory = computed(() => this._history().length > 0);
  readonly questions = this._questions.asReadonly();
  readonly currentQuestionIndex = this._currentQuestionIndex.asReadonly();
  readonly answers = this._answers.asReadonly();
  readonly activeHint = this._activeHint.asReadonly();
  readonly qaComplete = this._qaComplete.asReadonly();

  readonly currentParagraph = computed(
    () => this._article()?.paragraphs[this._currentParagraphIndex()] ?? null,
  );

  readonly currentQuestion = computed(
    () => this._questions()[this._currentQuestionIndex()] ?? null,
  );

  readonly allQuestionsAnswered = computed(
    () => this._questions().length > 0 && this._answers().length >= this._questions().length,
  );

  generate(req: GenerateArticleRequest): void {
    this._generating.set(true);
    this._generationStep.set('sending');
    this._generationProgress.set(0);
    this._generationError.set(null);

    this.startElapsedTimer();

    this.articleApi.generate(req).subscribe({
      next: (res) => {
        if (res.status === 'READY') {
          this.stopTimers();
          this._generating.set(false);
          this._generationStep.set('idle');
          this.loadArticle(res.id);
          this.router.navigate(['/article', res.id]);
        } else if (res.status === 'FAILED') {
          this.stopTimers();
          this._generationError.set('Article generation failed. Please try again.');
        } else {
          this.startPolling(res.id);
        }
      },
      error: (err) => {
        this.stopTimers();
        this._generationError.set(err.error?.message ?? 'Could not generate article');
      },
    });
  }

  cancelGeneration(): void {
    this.stopTimers();
    this._generating.set(false);
    this._generationStep.set('idle');
    this._generationProgress.set(0);
    this._generationError.set(null);
  }

  loadArticle(id: string): void {
    this._loading.set(true);
    this._error.set(null);

    this.articleApi.getArticle(id).subscribe({
      next: (res) => {
        this._article.set(res);
        this._loading.set(false);
        this._sessionStartedAt = Date.now();
      },
      error: () => {
        this._loading.set(false);
        this._error.set('Could not load article');
      },
    });
  }

  advanceParagraph(): void {
    const article = this._article();
    if (!article) return;
    const nextIndex = this._currentParagraphIndex() + 1;
    if (nextIndex >= article.paragraphs.length) {
      this._readingComplete.set(true);
    } else {
      this._currentParagraphIndex.set(nextIndex);
    }
  }

  completeReading(): void {
    const articleId = this._article()?.id;
    if (!articleId) return;

    this.articleApi.completeArticle(articleId).subscribe({
      next: () => {
        this.fireRecordSession('ARTICLE');
        this.loadQuestions(articleId);
        this.router.navigate(['/article', articleId, 'questions']);
      },
      error: () => {
        this.router.navigate(['/article', articleId, 'questions']);
      },
    });
  }

  // Phase 2: word marking
  markWord(draft: SavedWordDraft): void {
    this._activeWord.set(draft);
  }

  saveActiveWord(word: SavedWord): void {
    this._savedWords.update((words) => [...words, word]);
    this._activeWord.set(null);
  }

  dismissActiveWord(): void {
    this._activeWord.set(null);
  }

  // Phase 3: Q&A
  loadQuestions(articleId: string): void {
    this.articleApi.getQuestions(articleId).subscribe({
      next: (questions) => {
        this._questions.set(questions);
      },
    });
  }

  submitAnswer(articleId: string, questionId: string, answer: string): void {
    this.articleApi.submitAnswer(articleId, questionId, { answer }).subscribe({
      next: (result: AnswerResult) => {
        this._answers.update((prev) => [...prev, { questionId, result }]);
        if (this.allQuestionsAnswered()) {
          this._qaComplete.set(true);
        }
      },
    });
  }

  loadHint(articleId: string, questionId: string): void {
    this.articleApi.getHint(articleId, questionId).subscribe({
      next: (res) => {
        this._activeHint.set(res.hint);
      },
    });
  }

  advanceQuestion(): void {
    this._currentQuestionIndex.update((i) => i + 1);
    this._activeHint.set(null);
  }

  loadPreReading(articleId: string): void {
    this._preReadingLoading.set(true);
    this.articleApi.getPreReading(articleId).subscribe({
      next: (data) => {
        this._keyWords.set(data.keyWords);
        this._predictiveQuestion.set(data.predictiveQuestion);
        this._preReadingLoading.set(false);
      },
      error: () => {
        this._preReadingLoading.set(false);
        this._preReadingComplete.set(true);
      },
    });
  }

  dismissPreReadingStage(): void {
    this._preReadingComplete.set(true);
  }

  loadHistory(): void {
    this._historyLoading.set(true);
    this.articleApi.getHistory().subscribe({
      next: (items) => {
        this._history.set(items);
        this._historyLoading.set(false);
      },
      error: () => {
        this._historyLoading.set(false);
      },
    });
  }

  deleteArticleFromHistory(id: string): void {
    this.articleApi.deleteArticle(id).subscribe({
      next: () => {
        this._history.update((items) => items.filter((item) => item.id !== id));
      },
    });
  }

  reset(): void {
    this.cancelGeneration();
    this._article.set(null);
    this._loading.set(false);
    this._error.set(null);
    this._currentParagraphIndex.set(0);
    this._readingComplete.set(false);
    this._activeWord.set(null);
    this._savedWords.set([]);
    this._keyWords.set([]);
    this._predictiveQuestion.set(null);
    this._preReadingLoading.set(false);
    this._preReadingComplete.set(false);
    this._questions.set([]);
    this._currentQuestionIndex.set(0);
    this._answers.set([]);
    this._activeHint.set(null);
    this._qaComplete.set(false);
  }

  private startPolling(articleId: string): void {
    this._pollingSub = interval(2000)
      .pipe(
        switchMap(() => this.articleApi.getArticle(articleId)),
        retry({ count: 3, delay: 2000 }),
        takeWhile((res) => res.status !== 'READY' && res.status !== 'FAILED', true),
        timeout(60_000),
        catchError(() => {
          this.stopTimers();
          this._generationError.set('Generation timed out. Please try again.');
          return EMPTY;
        }),
      )
      .subscribe({
        next: (res) => {
          if (res.status === 'READY') {
            this.stopTimers();
            this._article.set(res);
            this._generating.set(false);
            this._generationStep.set('idle');
            this.router.navigate(['/article', res.id]);
          } else if (res.status === 'FAILED') {
            this.stopTimers();
            this._generationError.set('Article generation failed. Please try again.');
          }
        },
      });
  }

  private startElapsedTimer(): void {
    let elapsed = 0;
    this._elapsedTimer = interval(1000).subscribe(() => {
      elapsed++;
      this._generationProgress.set(Math.min(90, (elapsed / 60) * 90));

      for (let i = GENERATION_STEPS.length - 1; i >= 0; i--) {
        if (elapsed >= GENERATION_STEPS[i].threshold) {
          this._generationStep.set(GENERATION_STEPS[i].key);
          break;
        }
      }
    });
  }

  private fireRecordSession(module: string): void {
    const profileId = this.auth.profileId();
    if (!profileId) return;
    const durationSeconds = Math.max(1, Math.round((Date.now() - this._sessionStartedAt) / 1000));
    this.profileApi
      .recordSession(profileId, module, durationSeconds)
      .pipe(catchError(() => EMPTY))
      .subscribe();
  }

  private stopTimers(): void {
    this._pollingSub?.unsubscribe();
    this._pollingSub = null;
    this._elapsedTimer?.unsubscribe();
    this._elapsedTimer = null;
  }
}
