import { Component, ChangeDetectionStrategy, inject, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { of, catchError } from 'rxjs';
import { SessionService } from '../../services/session.service';
import { GamificationService } from '../../services/gamification.service';
import { TtsService } from '../../../../features/speak/services/tts.service';
import { ExerciseResultApiService } from '../../../../core/services/exercise-result-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { OfflineQueueService } from '../../../../core/services/offline-queue.service';
import { XP_PER_SESSION } from '../../data/gamification.data';
import { Level } from '../../../../shared/models/learning.model';
import { ExerciseResult } from '../../../../shared/models/exercise-result.model';
import { environment } from '../../../../core/services/environment';
import { ListeningExercise } from './exercises/listening-exercise';
import { PronunciationExercise } from './exercises/pronunciation-exercise';
import { VocabularyExercise } from './exercises/vocabulary-exercise';
import { GrammarExercise } from './exercises/grammar-exercise';
import { PhrasesExercise } from './exercises/phrases-exercise';
import { SessionCompletion } from './components/session-completion';

@Component({
  selector: 'app-session',
  imports: [
    ListeningExercise,
    PronunciationExercise,
    VocabularyExercise,
    GrammarExercise,
    PhrasesExercise,
    SessionCompletion,
  ],
  templateUrl: './session.html',
  styleUrl: './session.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Session {
  private readonly sessionService = inject(SessionService);
  private readonly gamification = inject(GamificationService);
  private readonly tts = inject(TtsService);
  private readonly router = inject(Router);
  private readonly exerciseResultApi = inject(ExerciseResultApiService);
  private readonly auth = inject(AuthService);
  private readonly offlineQueue = inject(OfflineQueueService);

  protected readonly session = this.sessionService.currentSession;
  protected readonly currentBlock = this.sessionService.currentBlock;
  protected readonly blockIndex = this.sessionService.currentBlockIndex;
  protected readonly progress = this.sessionService.sessionProgress;
  protected readonly isLast = this.sessionService.isLastBlock;
  protected readonly sessionCompleted = this.sessionService.sessionCompleted;
  protected readonly completedSession = this.sessionService.completedSession;
  protected readonly isGenerating = this.sessionService.isGenerating;

  protected readonly sessionId = computed(() => this.session()?.id ?? null);

  protected readonly currentExercises = computed(() => {
    const block = this.currentBlock();
    return block?.exercises ?? [];
  });

  protected readonly blockResults = signal<Map<number, ExerciseResult>>(new Map());
  protected readonly unitMasteryScore = signal<number | null>(null);
  protected readonly unitStatus = signal<string | null>(null);
  protected readonly accumulatedXp = signal(0);

  protected readonly blocks = computed(() => this.session()?.blocks ?? []);

  protected readonly currentLevel = computed<Level | null>(() => {
    const block = this.currentBlock();
    return block?.unit?.level ?? null;
  });

  protected levelColor(level: Level): string {
    return `var(--level-${level})`;
  }

  protected readonly sessionDuration = computed(() => {
    const startTime = this.sessionService.sessionStartTime();
    const elapsed = Math.round((Date.now() - startTime) / 60000);
    return Math.max(1, elapsed);
  });

  protected readonly xpEarned = XP_PER_SESSION;

  protected readonly improvedAreas = computed<string[]>(() => {
    const session = this.completedSession();
    if (!session) return [];
    const areas: string[] = [];
    if (session.listening) areas.push('Listening');
    if (session.pronunciation) areas.push('Pronunciacion');
    return areas;
  });

  protected readonly practiceAreas = computed<string[]>(() => {
    const session = this.completedSession();
    if (!session) return [];
    const areas: string[] = [];
    if (session.secondary) {
      const labels: Record<string, string> = {
        vocabulary: 'Vocabulario',
        grammar: 'Gramatica',
        phrases: 'Frases',
      };
      areas.push(labels[session.secondaryModule] ?? session.secondaryModule);
    }
    return areas;
  });

  protected readonly completedBlockCount = computed(() => {
    const session = this.completedSession();
    return session?.blocks.length ?? 0;
  });

  protected onExerciseCompleted(result: ExerciseResult): void {
    this.blockResults.update((prev) => {
      const next = new Map(prev);
      next.set(this.blockIndex(), result);
      return next;
    });

    this.reportExerciseResult(result);
  }

  private reportExerciseResult(result: ExerciseResult): void {
    const profileId = this.auth.profileId();
    const sId = this.sessionId();
    if (!profileId || !sId) return;

    const request = {
      correctCount: result.correctCount,
      totalCount: result.totalCount,
      averageResponseTimeMs:
        result.totalCount > 0 ? Math.round(result.durationMs / result.totalCount) : 0,
      exerciseType: result.exerciseType.toUpperCase(),
    };

    this.exerciseResultApi
      .recordResult(profileId, sId, this.blockIndex(), request)
      .pipe(
        catchError(() => {
          this.offlineQueue.enqueue(
            'POST',
            `${environment.apiUrl}/profiles/${profileId}/sessions/${sId}/exercises/${this.blockIndex()}/result`,
            request,
          );
          return of(null);
        }),
      )
      .subscribe((response) => {
        if (response) {
          this.unitMasteryScore.set(response.unitMasteryScore);
          this.unitStatus.set(response.unitStatus);
          this.accumulatedXp.update((prev) => prev + response.xpEarned);
        }
      });
  }

  protected getContentIds(exerciseType: string): string[] | undefined {
    const exercises = this.currentExercises();
    const ex = exercises.find((e) => e.exerciseType.toLowerCase() === exerciseType);
    return ex?.contentIds;
  }

  protected getExerciseCount(exerciseType: string): number | undefined {
    const exercises = this.currentExercises();
    const ex = exercises.find((e) => e.exerciseType.toLowerCase() === exerciseType);
    return ex?.targetCount;
  }

  protected advanceBlock(): void {
    this.sessionService.advanceBlock();
  }

  protected goBack(): void {
    this.sessionService.goBackBlock();
  }

  protected goToBlock(index: number): void {
    this.sessionService.goToBlock(index);
  }

  protected isCompleted(index: number): boolean {
    return this.sessionService.isBlockCompleted(index);
  }

  protected exitSession(): void {
    this.sessionService.dismissCompletion();
    this.router.navigate(['/dashboard']);
  }

  protected startNextSession(): void {
    this.sessionService.dismissCompletion();
    this.sessionService.startSession('full');
  }

  protected speakContent(text: string): void {
    this.tts.speak(text);
  }

  protected readonly advanceLabel = computed(() =>
    this.isLast() ? 'Completar sesion \u2713' : 'Siguiente \u2192',
  );

  protected blockIcon(type: string): string {
    switch (type) {
      case 'warmup':
        return '\u{1F504}';
      case 'listening':
        return '\u{1F3A7}';
      case 'pronunciation':
        return '\u{1F3A4}';
      case 'secondary':
        return '\u{1F4DA}';
      case 'practice':
        return '\u{270D}';
      case 'bonus':
        return '\u2B50';
      default:
        return '\u{1F4CB}';
    }
  }
}
