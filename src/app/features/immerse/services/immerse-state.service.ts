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
import { ImmerseApiService } from './immerse-api.service';
import { ProfileApiService } from '../../../core/services/profile-api.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  ImmerseContent,
  ImmerseContentRequest,
  ImmerseExercise,
  ImmerseExerciseResult,
  VocabEntry,
  WordAnnotation,
  GenerateContentRequest,
  GenerationStep,
  GENERATION_STEPS,
} from '../models/immerse.model';

@Injectable({ providedIn: 'root' })
export class ImmerseStateService {
  private readonly immerseApi = inject(ImmerseApiService);
  private readonly profileApi = inject(ProfileApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  private _sessionStartedAt = 0;
  private _currentContentId = '';

  private readonly _content = signal<ImmerseContent | null>(null);
  private readonly _annotations = signal<WordAnnotation[]>([]);
  private readonly _exercises = signal<ImmerseExercise[]>([]);
  private readonly _activeWord = signal<WordAnnotation | null>(null);
  private readonly _capturedVocab = signal<VocabEntry[]>([]);
  private readonly _exerciseProgress = signal<ImmerseExerciseResult[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  private readonly _generating = signal(false);
  private readonly _generationStep = signal<GenerationStep>('idle');
  private readonly _generationProgress = signal(0);
  private readonly _generationError = signal<string | null>(null);

  private readonly _listeningMode = signal(false);
  private readonly _ttsPlaying = signal(false);

  private _pollingSub: Subscription | null = null;
  private _elapsedTimer: Subscription | null = null;
  private _lastGenerateRequest: GenerateContentRequest | null = null;

  readonly content = this._content.asReadonly();
  readonly annotations = this._annotations.asReadonly();
  readonly exercises = this._exercises.asReadonly();
  readonly activeWord = this._activeWord.asReadonly();
  readonly capturedVocab = this._capturedVocab.asReadonly();
  readonly exerciseProgress = this._exerciseProgress.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly generating = this._generating.asReadonly();
  readonly generationStep = this._generationStep.asReadonly();
  readonly generationProgress = this._generationProgress.asReadonly();
  readonly generationError = this._generationError.asReadonly();

  readonly listeningMode = this._listeningMode.asReadonly();
  readonly ttsPlaying = this._ttsPlaying.asReadonly();

  readonly capturedVocabCount = computed(() => this._capturedVocab().length);
  readonly exerciseCompletionRate = computed(() => {
    const exercises = this._exercises();
    const results = this._exerciseProgress();
    if (exercises.length === 0) return 0;
    return Math.round((results.length / exercises.length) * 100);
  });

  generateContent(req: GenerateContentRequest): void {
    this._generating.set(true);
    this._generationStep.set('sending');
    this._generationProgress.set(0);
    this._generationError.set(null);
    this._lastGenerateRequest = req;

    this.startElapsedTimer();

    this.immerseApi.generateContent(req).subscribe({
      next: (res) => {
        if (res.status === 'PROCESSED') {
          this.stopTimers();
          this._generating.set(false);
          this._generationStep.set('idle');
          this.router.navigate(['/immerse', res.id]);
        } else {
          this.startPolling(res.id);
        }
      },
      error: (err) => {
        this.stopTimers();
        this._generationError.set(err.error?.message ?? 'Could not generate content');
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

  submitContent(req: ImmerseContentRequest): void {
    this._loading.set(true);
    this._error.set(null);

    this.immerseApi.submitContent(req).subscribe({
      next: (res) => {
        this._content.set(res);
        this._loading.set(false);
        this.router.navigate(['/immerse', res.id]);
      },
      error: (err) => {
        this._loading.set(false);
        this._error.set(err.error?.message ?? 'Could not process content');
      },
    });
  }

  loadContent(contentId: string): void {
    this._loading.set(true);
    this._error.set(null);

    this.immerseApi.getContent(contentId).subscribe({
      next: (res) => {
        this._content.set(res);
        const allAnnotations = res.paragraphs.flatMap((p) => p.annotations);
        this._annotations.set(allAnnotations);
        this._loading.set(false);
      },
      error: () => {
        this._loading.set(false);
        this._error.set('Could not load content');
      },
    });
  }

  selectWord(annotation: WordAnnotation): void {
    this._activeWord.set(annotation);
  }

  dismissWord(): void {
    this._activeWord.set(null);
  }

  saveWord(entry: VocabEntry): void {
    this._capturedVocab.update((vocab) => [...vocab, entry]);
  }

  loadExercises(contentId: string, type: 'ALL' | 'LISTENING_CLOZE' | 'REGULAR' = 'ALL'): void {
    this._loading.set(true);
    this._error.set(null);
    this._currentContentId = contentId;

    this.immerseApi.getExercises(contentId, type).subscribe({
      next: (exercises) => {
        this._exercises.set(exercises);
        this._exerciseProgress.set([]);
        this._loading.set(false);
        this._sessionStartedAt = Date.now();
      },
      error: () => {
        this._loading.set(false);
        this._error.set('Could not load exercises');
      },
    });
  }

  toggleMode(): void {
    this._listeningMode.update((v) => !v);
    const type = this._listeningMode() ? 'LISTENING_CLOZE' : 'REGULAR';
    if (this._currentContentId) {
      this.loadExercises(this._currentContentId, type);
    }
  }

  submitAnswer(contentId: string, exerciseId: string, answer: string): void {
    this.immerseApi.submitExerciseAnswer(contentId, exerciseId, answer).subscribe({
      next: (result) => {
        this._exerciseProgress.update((results) => [...results, result]);
      },
    });
  }

  completeExercises(): void {
    this.fireRecordSession('IMMERSE');
  }

  reset(): void {
    this.cancelGeneration();
    this._content.set(null);
    this._annotations.set([]);
    this._exercises.set([]);
    this._activeWord.set(null);
    this._capturedVocab.set([]);
    this._exerciseProgress.set([]);
    this._loading.set(false);
    this._error.set(null);
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

  private startPolling(contentId: string): void {
    this._pollingSub = interval(2000)
      .pipe(
        switchMap(() => this.immerseApi.getContent(contentId)),
        retry({ count: 3, delay: 2000 }),
        takeWhile((res) => res.status !== 'PROCESSED' && res.status !== 'FAILED', true),
        timeout(60_000),
        catchError(() => {
          this.stopTimers();
          this._generationError.set('Generation timed out. Please try again.');
          return EMPTY;
        }),
      )
      .subscribe({
        next: (res) => {
          if (res.status === 'PROCESSED') {
            this.stopTimers();
            this._content.set(res);
            this._generating.set(false);
            this._generationStep.set('idle');
            this.router.navigate(['/immerse', res.id]);
          } else if (res.status === 'FAILED') {
            this.stopTimers();
            this._generationError.set('Content generation failed. Please try again.');
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

  private stopTimers(): void {
    this._pollingSub?.unsubscribe();
    this._pollingSub = null;
    this._elapsedTimer?.unsubscribe();
    this._elapsedTimer = null;
  }
}
