import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ImmerseApiService } from './immerse-api.service';
import {
  ImmerseContent,
  ImmerseContentRequest,
  ImmerseExercise,
  ImmerseExerciseResult,
  VocabEntry,
  WordAnnotation,
} from '../models/immerse.model';

@Injectable({ providedIn: 'root' })
export class ImmerseStateService {
  private readonly immerseApi = inject(ImmerseApiService);
  private readonly router = inject(Router);

  private readonly _content = signal<ImmerseContent | null>(null);
  private readonly _annotations = signal<WordAnnotation[]>([]);
  private readonly _exercises = signal<ImmerseExercise[]>([]);
  private readonly _activeWord = signal<WordAnnotation | null>(null);
  private readonly _capturedVocab = signal<VocabEntry[]>([]);
  private readonly _exerciseProgress = signal<ImmerseExerciseResult[]>([]);
  private readonly _loading = signal(false);
  private readonly _error = signal<string | null>(null);

  readonly content = this._content.asReadonly();
  readonly annotations = this._annotations.asReadonly();
  readonly exercises = this._exercises.asReadonly();
  readonly activeWord = this._activeWord.asReadonly();
  readonly capturedVocab = this._capturedVocab.asReadonly();
  readonly exerciseProgress = this._exerciseProgress.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  readonly capturedVocabCount = computed(() => this._capturedVocab().length);
  readonly exerciseCompletionRate = computed(() => {
    const exercises = this._exercises();
    const results = this._exerciseProgress();
    if (exercises.length === 0) return 0;
    return Math.round((results.length / exercises.length) * 100);
  });

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

  loadExercises(contentId: string): void {
    this._loading.set(true);
    this._error.set(null);

    this.immerseApi.getExercises(contentId).subscribe({
      next: (exercises) => {
        this._exercises.set(exercises);
        this._exerciseProgress.set([]);
        this._loading.set(false);
      },
      error: () => {
        this._loading.set(false);
        this._error.set('Could not load exercises');
      },
    });
  }

  submitAnswer(contentId: string, exerciseId: string, answer: string): void {
    this.immerseApi.submitExerciseAnswer(contentId, exerciseId, answer).subscribe({
      next: (result) => {
        this._exerciseProgress.update((results) => [...results, result]);
      },
    });
  }

  reset(): void {
    this._content.set(null);
    this._annotations.set([]);
    this._exercises.set([]);
    this._activeWord.set(null);
    this._capturedVocab.set([]);
    this._exerciseProgress.set([]);
    this._loading.set(false);
    this._error.set(null);
  }
}
