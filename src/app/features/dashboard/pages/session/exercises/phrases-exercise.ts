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
import { TtsService } from '../../../../speak/services/tts.service';
import { Level } from '../../../../../shared/models/learning.model';
import { PHRASE_CONTENT, PhraseItem, pickRandom } from './exercise-content.data';
import { getLowerLevels, mixWithReview } from '../../../../../shared/utils/level.utils';

@Component({
  selector: 'app-phrases-exercise',
  templateUrl: './phrases-exercise.html',
  styleUrl: './exercises.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhrasesExercise implements OnInit {
  private readonly tts = inject(TtsService);

  readonly level = input.required<Level>();
  readonly unitTitle = input.required<string>();
  readonly reviewMode = input(false);
  readonly contentIds = input<string[]>();
  readonly exerciseCount = input<number>();

  readonly exerciseCompleted = output<ExerciseResult>();
  private startTime = 0;

  protected readonly items = signal<PhraseItem[]>([]);
  protected readonly phase = signal<'learn' | 'quiz' | 'done'>('learn');
  protected readonly learnIndex = signal(0);
  protected readonly quizIndex = signal(0);
  protected readonly showAnswer = signal(false);
  protected readonly userInput = signal('');
  protected readonly quizResults = signal<{ phrase: string; correct: boolean }[]>([]);

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
      const phrases = PHRASE_CONTENT[reviewLevel] ?? PHRASE_CONTENT['a1'];
      this.items.set(pickRandom(phrases, 6));
      return;
    }

    const mainPhrases = PHRASE_CONTENT[level] ?? PHRASE_CONTENT['a1'];
    if (lowerLevels.length === 0) {
      this.items.set(pickRandom(mainPhrases, 6));
      return;
    }

    const reviewLevel = lowerLevels[Math.floor(Math.random() * lowerLevels.length)];
    const reviewPhrases = PHRASE_CONTENT[reviewLevel] ?? [];
    this.items.set(mixWithReview(mainPhrases, reviewPhrases, 6));
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
    const given = this.userInput()
      .trim()
      .toLowerCase()
      .replace(/[^a-z\s'.,?!]/g, '');
    const expected = item.en.toLowerCase().replace(/[^a-z\s'.,?!]/g, '');
    const words = expected.split(/\s+/);
    const givenWords = given.split(/\s+/);
    let matched = 0;
    for (const w of words) {
      if (givenWords.includes(w)) matched++;
    }
    const correct = words.length > 0 && matched / words.length >= 0.6;
    this.quizResults.update((r) => [...r, { phrase: item.en, correct }]);
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
      exerciseType: 'phrases',
      correctCount,
      totalCount: r.length,
      score: r.length > 0 ? Math.round((correctCount / r.length) * 100) : 0,
      durationMs: Date.now() - this.startTime,
      items: r.map((x) => ({ word: x.phrase, correct: x.correct })),
    });
  }
}
