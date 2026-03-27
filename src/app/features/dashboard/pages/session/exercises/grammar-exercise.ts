import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { ExerciseResult } from '../../../../../shared/models/exercise-result.model';
import { Level } from '../../../../../shared/models/learning.model';
import { GRAMMAR_CONTENT, GrammarContent } from './exercise-content.data';
import { getLowerLevels } from '../../../../../shared/utils/level.utils';

@Component({
  selector: 'app-grammar-exercise',
  templateUrl: './grammar-exercise.html',
  styleUrl: './exercises.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrammarExercise implements OnInit {
  readonly level = input.required<Level>();
  readonly unitTitle = input.required<string>();
  readonly reviewMode = input(false);
  readonly contentIds = input<string[]>();
  readonly exerciseCount = input<number>();
  readonly exerciseIndex = input<number>();

  readonly exerciseCompleted = output<ExerciseResult>();
  private startTime = 0;

  protected readonly content = signal<GrammarContent | null>(null);
  protected readonly phase = signal<'learn' | 'exercise' | 'done'>('learn');
  protected readonly currentQuestionIndex = signal(0);
  protected readonly selectedOption = signal<number | null>(null);
  protected readonly results = signal<boolean[]>([]);

  protected readonly currentExercise = computed(() => {
    const c = this.content();
    if (!c) return null;
    return c.exercises[this.currentQuestionIndex()] ?? null;
  });

  protected readonly score = computed(() => {
    const r = this.results();
    if (r.length === 0) return 0;
    return Math.round((r.filter((x) => x).length / r.length) * 100);
  });

  ngOnInit(): void {
    this.startTime = Date.now();
    const level = this.level();
    const lowerLevels = getLowerLevels(level);

    if (this.reviewMode() && lowerLevels.length > 0) {
      const reviewLevel = lowerLevels[Math.floor(Math.random() * lowerLevels.length)];
      const content = GRAMMAR_CONTENT[reviewLevel];
      if (content?.length) {
        this.content.set(content[Math.floor(Math.random() * content.length)]);
      }
      return;
    }

    // 20% chance to show a lower-level grammar topic as review
    if (lowerLevels.length > 0 && Math.random() < 0.2) {
      const reviewLevel = lowerLevels[Math.floor(Math.random() * lowerLevels.length)];
      const content = GRAMMAR_CONTENT[reviewLevel];
      if (content?.length) {
        this.content.set(content[Math.floor(Math.random() * content.length)]);
        return;
      }
    }

    const levelContent = GRAMMAR_CONTENT[level];
    if (levelContent?.length) {
      this.content.set(levelContent[Math.floor(Math.random() * levelContent.length)]);
    }
  }

  protected startExercises(): void {
    this.phase.set('exercise');
    this.currentQuestionIndex.set(0);
    this.selectedOption.set(null);
    this.results.set([]);
  }

  protected selectOption(index: number): void {
    if (this.selectedOption() !== null) return;
    this.selectedOption.set(index);
    const ex = this.currentExercise();
    if (ex) {
      this.results.update((r) => [...r, index === ex.correct]);
    }
  }

  protected nextExercise(): void {
    const c = this.content();
    if (!c) return;
    const nextIdx = this.currentQuestionIndex() + 1;
    if (nextIdx >= c.exercises.length) {
      this.phase.set('done');
      this.emitResult();
    } else {
      this.currentQuestionIndex.set(nextIdx);
      this.selectedOption.set(null);
    }
  }

  private emitResult(): void {
    const r = this.results();
    const correctCount = r.filter((x) => x).length;
    this.exerciseCompleted.emit({
      exerciseType: 'grammar',
      exerciseIndex: this.exerciseIndex(),
      correctCount,
      totalCount: r.length,
      score: r.length > 0 ? Math.round((correctCount / r.length) * 100) : 0,
      durationMs: Date.now() - this.startTime,
      items: r.map((x) => ({ correct: x })),
    });
  }
}
