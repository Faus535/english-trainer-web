import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  output,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { ExerciseResult } from '../../../../../shared/models/exercise-result.model';
import { forkJoin } from 'rxjs';
import { TtsService } from '../../../../speak/services/tts.service';
import { VocabApiService } from '../../../../../core/services/vocab-api.service';
import { Level } from '../../../../../shared/models/learning.model';
import { VOCABULARY_WORDS, VocabItem, pickRandom } from './exercise-content.data';
import { getLowerLevels, mixWithReview } from '../../../../../shared/utils/level.utils';

@Component({
  selector: 'app-vocabulary-exercise',
  templateUrl: './vocabulary-exercise.html',
  styleUrl: './exercises.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VocabularyExercise implements OnInit {
  private readonly tts = inject(TtsService);
  private readonly vocabApi = inject(VocabApiService);

  readonly level = input.required<Level>();
  readonly unitTitle = input.required<string>();
  readonly reviewMode = input(false);
  readonly contentIds = input<string[]>();
  readonly exerciseCount = input<number>();
  readonly exerciseIndex = input<number>();

  readonly exerciseCompleted = output<ExerciseResult>();
  private startTime = 0;

  protected readonly items = signal<VocabItem[]>([]);
  protected readonly phase = signal<'learn' | 'quiz' | 'done'>('learn');
  protected readonly learnIndex = signal(0);
  protected readonly quizIndex = signal(0);
  protected readonly userInput = signal('');
  protected readonly showAnswer = signal(false);
  protected readonly quizResults = signal<{ word: string; correct: boolean; given: string }[]>([]);

  protected readonly currentLearn = computed(() => this.items()[this.learnIndex()] ?? null);
  protected readonly currentQuiz = computed(() => this.items()[this.quizIndex()] ?? null);
  protected readonly score = computed(() => {
    const r = this.quizResults();
    if (r.length === 0) return 0;
    return Math.round((r.filter((x) => x.correct).length / r.length) * 100);
  });

  ngOnInit(): void {
    this.startTime = Date.now();
    const level = this.level();
    const lowerLevels = getLowerLevels(level);

    if (this.reviewMode() && lowerLevels.length > 0) {
      const reviewLevel = lowerLevels[Math.floor(Math.random() * lowerLevels.length)];
      this.vocabApi.getVocabByLevel(reviewLevel).subscribe({
        next: (entries) => this.setItemsFromApi(entries, 10),
        error: () => this.loadFallbackForLevel(reviewLevel),
      });
      return;
    }

    if (lowerLevels.length === 0) {
      this.vocabApi.getVocabByLevel(level).subscribe({
        next: (entries) => this.setItemsFromApi(entries, 10),
        error: () => this.loadFallback(),
      });
      return;
    }

    const reviewLevel = lowerLevels[Math.floor(Math.random() * lowerLevels.length)];
    forkJoin([
      this.vocabApi.getVocabByLevel(level),
      this.vocabApi.getVocabByLevel(reviewLevel),
    ]).subscribe({
      next: ([main, review]) => {
        const mainItems = main.map((e) => ({ en: e.en, es: e.es, ipa: e.ipa, example: e.example }));
        const reviewItems = review.map((e) => ({
          en: e.en,
          es: e.es,
          ipa: e.ipa,
          example: e.example,
        }));
        if (mainItems.length === 0 && reviewItems.length === 0) {
          this.loadFallback();
        } else {
          this.items.set(mixWithReview(mainItems, reviewItems, 10));
        }
      },
      error: () => this.loadFallback(),
    });
  }

  private setItemsFromApi(
    entries: { en: string; es: string; ipa: string; example: string }[],
    count: number,
  ): void {
    if (entries.length > 0) {
      const vocabItems: VocabItem[] = entries.map((e) => ({
        en: e.en,
        es: e.es,
        ipa: e.ipa,
        example: e.example,
      }));
      this.items.set(pickRandom(vocabItems, count));
    } else {
      this.loadFallback();
    }
  }

  private loadFallbackForLevel(level: Level): void {
    const words = VOCABULARY_WORDS[level] ?? VOCABULARY_WORDS['a1'];
    this.items.set(pickRandom(words, 10));
  }

  private loadFallback(): void {
    const level = this.level();
    const mainWords = VOCABULARY_WORDS[level] ?? VOCABULARY_WORDS['a1'];
    const lowerLevels = getLowerLevels(level);
    if (lowerLevels.length === 0) {
      this.items.set(pickRandom(mainWords, 10));
      return;
    }
    const reviewLevel = lowerLevels[Math.floor(Math.random() * lowerLevels.length)];
    const reviewWords = VOCABULARY_WORDS[reviewLevel] ?? [];
    this.items.set(mixWithReview(mainWords, reviewWords, 10));
  }

  protected speak(text: string): void {
    this.tts.speak(text);
  }

  protected nextLearn(): void {
    const nextIdx = this.learnIndex() + 1;
    if (nextIdx >= this.items().length) {
      this.phase.set('quiz');
      this.quizIndex.set(0);
      this.userInput.set('');
      this.showAnswer.set(false);
    } else {
      this.learnIndex.set(nextIdx);
    }
  }

  protected onInput(event: Event): void {
    this.userInput.set((event.target as HTMLInputElement).value);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.checkQuiz();
  }

  protected checkQuiz(): void {
    const item = this.currentQuiz();
    if (!item || this.showAnswer()) return;
    const given = this.userInput().trim().toLowerCase();
    const correct = given === item.en.toLowerCase();
    this.quizResults.update((r) => [...r, { word: item.en, correct, given }]);
    this.showAnswer.set(true);
  }

  protected nextQuiz(): void {
    const nextIdx = this.quizIndex() + 1;
    if (nextIdx >= this.items().length) {
      this.phase.set('done');
      this.emitResult();
    } else {
      this.quizIndex.set(nextIdx);
      this.userInput.set('');
      this.showAnswer.set(false);
    }
  }

  private emitResult(): void {
    const r = this.quizResults();
    const correctCount = r.filter((x) => x.correct).length;
    this.exerciseCompleted.emit({
      exerciseType: 'vocabulary',
      exerciseIndex: this.exerciseIndex(),
      correctCount,
      totalCount: r.length,
      score: r.length > 0 ? Math.round((correctCount / r.length) * 100) : 0,
      durationMs: Date.now() - this.startTime,
      items: r.map((x) => ({ word: x.word, correct: x.correct })),
    });
  }
}
