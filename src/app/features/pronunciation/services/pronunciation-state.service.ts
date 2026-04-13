import { Injectable, inject, signal, computed } from '@angular/core';
import { catchError, EMPTY } from 'rxjs';
import { PronunciationApiService } from './pronunciation-api.service';
import {
  DrillItem,
  DrillSubmitResponse,
  MiniConversationTurn,
  PronunciationAnalyzeResponse,
  PronunciationFeedbackResponse,
  WordConfidence,
} from '../models/pronunciation.model';

@Injectable({ providedIn: 'root' })
export class PronunciationStateService {
  private readonly api = inject(PronunciationApiService);

  // Analysis
  private readonly _text = signal<string>('');
  private readonly _level = signal<string>('b1');
  private readonly _analysisResult = signal<PronunciationAnalyzeResponse | null>(null);
  private readonly _analysisStatus = signal<'idle' | 'loading' | 'error'>('idle');

  readonly analysisResult = this._analysisResult.asReadonly();
  readonly level = this._level.asReadonly();
  readonly isAnalyzing = computed(() => this._analysisStatus() === 'loading');
  readonly analysisError = computed(() => this._analysisStatus() === 'error');

  // Feedback
  private readonly _feedbackResult = signal<PronunciationFeedbackResponse | null>(null);
  private readonly _feedbackStatus = signal<'idle' | 'loading' | 'error'>('idle');

  readonly feedbackResult = this._feedbackResult.asReadonly();
  readonly isFeedbackLoading = computed(() => this._feedbackStatus() === 'loading');
  readonly feedbackError = computed(() => this._feedbackStatus() === 'error');

  // Drills
  private readonly _drills = signal<DrillItem[]>([]);
  private readonly _drillIndex = signal<number>(0);
  private readonly _drillStatus = signal<'idle' | 'loading' | 'submitting' | 'error'>('idle');
  private readonly _drillScores = signal<Map<string, DrillSubmitResponse>>(new Map());
  private readonly _drillLevel = signal<string>('b1');
  private readonly _drillFocus = signal<string | null>(null);

  readonly drills = this._drills.asReadonly();
  readonly drillLevel = this._drillLevel.asReadonly();
  readonly drillFocus = this._drillFocus.asReadonly();
  readonly currentDrill = computed(() => this._drills()[this._drillIndex()] ?? null);
  readonly drillsComplete = computed(
    () => this._drillIndex() >= this._drills().length && this._drills().length > 0,
  );
  readonly drillProgress = computed(() => ({
    current: this._drillIndex() + 1,
    total: this._drills().length,
  }));
  readonly isDrillLoading = computed(() => this._drillStatus() === 'loading');
  readonly isDrillSubmitting = computed(() => this._drillStatus() === 'submitting');

  drillScoreFor(id: string): DrillSubmitResponse | null {
    return this._drillScores().get(id) ?? null;
  }

  // Mini-conversation
  private readonly _miniConvId = signal<string | null>(null);
  private readonly _miniConvTurns = signal<MiniConversationTurn[]>([]);
  private readonly _miniConvStatus = signal<
    'idle' | 'starting' | 'evaluating' | 'complete' | 'error'
  >('idle');

  readonly miniConvId = this._miniConvId.asReadonly();
  readonly miniConvTurns = this._miniConvTurns.asReadonly();
  readonly miniConvStatus = this._miniConvStatus.asReadonly();
  readonly currentTurn = computed(
    () => this._miniConvTurns()[this._miniConvTurns().length - 1] ?? null,
  );
  readonly isMiniConvComplete = computed(() => this._miniConvStatus() === 'complete');
  readonly averageScore = computed(() => {
    const turns = this._miniConvTurns().filter((t) => t.score !== null);
    return turns.length ? Math.round(turns.reduce((s, t) => s + t.score!, 0) / turns.length) : 0;
  });

  analyze(text: string, level: string): void {
    this._analysisStatus.set('loading');
    this._analysisResult.set(null);
    this._feedbackResult.set(null);
    this._text.set(text);
    this._level.set(level);

    this.api
      .analyze({ text, level })
      .pipe(
        catchError(() => {
          this._analysisStatus.set('error');
          return EMPTY;
        }),
      )
      .subscribe((result) => {
        this._analysisResult.set(result);
        this._analysisStatus.set('idle');
      });
  }

  submitFeedback(
    targetText: string,
    recognizedText: string,
    wordConfidences: WordConfidence[],
  ): void {
    this._feedbackStatus.set('loading');

    this.api
      .getFeedback({ targetText, recognizedText, wordConfidences })
      .pipe(
        catchError(() => {
          this._feedbackStatus.set('error');
          return EMPTY;
        }),
      )
      .subscribe((result) => {
        this._feedbackResult.set(result);
        this._feedbackStatus.set('idle');
      });
  }

  loadDrills(level: string, focus?: string): void {
    this._drillStatus.set('loading');
    this._drillIndex.set(0);
    this._drillScores.set(new Map());
    this._drillLevel.set(level);
    this._drillFocus.set(focus ?? null);

    this.api
      .getDrills(level, focus)
      .pipe(
        catchError(() => {
          this._drillStatus.set('error');
          return EMPTY;
        }),
      )
      .subscribe((drills) => {
        this._drills.set(drills);
        this._drillStatus.set('idle');
      });
  }

  submitDrillAttempt(recognizedText: string, confidence: number): void {
    const drill = this.currentDrill();
    if (!drill) return;

    this._drillStatus.set('submitting');

    this.api
      .submitDrill(drill.id, { recognizedText, confidence })
      .pipe(
        catchError(() => {
          this._drillStatus.set('error');
          return EMPTY;
        }),
      )
      .subscribe((result) => {
        const scores = new Map(this._drillScores());
        scores.set(drill.id, result);
        this._drillScores.set(scores);
        this._drillStatus.set('idle');
        setTimeout(() => this.advanceDrill(), 2500);
      });
  }

  advanceDrill(): void {
    this._drillIndex.update((i) => i + 1);
  }

  startMiniConversation(focus: string, level: string): void {
    this._miniConvStatus.set('starting');

    this.api
      .startMiniConversation({ focus, level })
      .pipe(
        catchError(() => {
          this._miniConvStatus.set('error');
          return EMPTY;
        }),
      )
      .subscribe((res) => {
        this._miniConvId.set(res.id);
        this._miniConvTurns.set([
          {
            id: crypto.randomUUID(),
            prompt: res.prompt,
            targetPhrase: res.targetPhrase,
            recognizedText: null,
            score: null,
            wordFeedback: [],
            overallTip: null,
          },
        ]);
        this._miniConvStatus.set('idle');
      });
  }

  evaluateTurn(recognizedText: string, wordConfidences: WordConfidence[]): void {
    const id = this._miniConvId();
    if (!id) return;

    this._miniConvStatus.set('evaluating');

    this.api
      .evaluateMiniConversation(id, { recognizedText, wordConfidences })
      .pipe(
        catchError(() => {
          this._miniConvStatus.set('error');
          return EMPTY;
        }),
      )
      .subscribe((res) => {
        const turns = [...this._miniConvTurns()];
        const lastIdx = turns.length - 1;
        turns[lastIdx] = {
          ...turns[lastIdx],
          recognizedText,
          score: res.score,
          wordFeedback: res.wordFeedback,
          overallTip: null,
        };

        if (!res.isComplete) {
          turns.push({
            id: crypto.randomUUID(),
            prompt: res.nextPrompt,
            targetPhrase: res.nextTargetPhrase,
            recognizedText: null,
            score: null,
            wordFeedback: [],
            overallTip: null,
          });
          this._miniConvTurns.set(turns);
          this._miniConvStatus.set('idle');
        } else {
          this._miniConvTurns.set(turns);
          this._miniConvStatus.set('complete');
        }
      });
  }

  resetMiniConversation(): void {
    this._miniConvId.set(null);
    this._miniConvTurns.set([]);
    this._miniConvStatus.set('idle');
  }
}
