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
import {
  PRONUNCIATION_CONTENT,
  PronunciationContent,
  getPronunciationKey,
} from './exercise-content.data';
import {
  ExtendedPronunciationContent,
  getExtendedPronunciationContent,
} from './data/pronunciation-extended.data';
import { PronunciationExplanation } from './components/pronunciation-explanation';
import { PronunciationDemonstration } from './components/pronunciation-demonstration';
import { PronunciationPractice } from './components/pronunciation-practice';

@Component({
  selector: 'app-pronunciation-exercise',
  templateUrl: './pronunciation-exercise.html',
  styleUrl: './exercises.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PronunciationExplanation, PronunciationDemonstration, PronunciationPractice],
})
export class PronunciationExercise implements OnInit {
  private readonly tts = inject(TtsService);

  readonly level = input.required<Level>();
  readonly unitTitle = input.required<string>();
  readonly contentIds = input<string[]>();
  readonly exerciseCount = input<number>();
  readonly exerciseIndex = input<number>();

  readonly exerciseCompleted = output<ExerciseResult>();
  private startTime = 0;

  protected readonly content = signal<PronunciationContent | null>(null);
  protected readonly extendedContent = signal<ExtendedPronunciationContent | null>(null);
  protected readonly phase = signal<'explanation' | 'demonstration' | 'practice' | 'quiz' | 'done'>(
    'explanation',
  );
  protected readonly quizIndex = signal(0);
  protected readonly selectedOption = signal<number | null>(null);
  protected readonly quizResults = signal<boolean[]>([]);
  protected readonly practiceScore = signal<number | null>(null);

  protected readonly currentQuiz = computed(() => {
    const ext = this.extendedContent();
    if (ext) {
      return ext.quiz[this.quizIndex()] ?? null;
    }
    const c = this.content();
    if (!c) return null;
    return c.quiz[this.quizIndex()] ?? null;
  });

  protected readonly quizLength = computed(() => {
    const ext = this.extendedContent();
    if (ext) return ext.quiz.length;
    const c = this.content();
    return c?.quiz.length ?? 0;
  });

  protected readonly currentQuizExplanation = computed(() => {
    const ext = this.extendedContent();
    if (!ext) return null;
    const quiz = ext.quiz[this.quizIndex()];
    return quiz?.explanation ?? null;
  });

  protected readonly score = computed(() => {
    const r = this.quizResults();
    if (r.length === 0) return 0;
    return Math.round((r.filter((x) => x).length / r.length) * 100);
  });

  protected readonly combinedScore = computed(() => {
    const ps = this.practiceScore();
    const qs = this.score();
    if (ps !== null) {
      return Math.round((ps + qs) / 2);
    }
    return qs;
  });

  ngOnInit(): void {
    this.startTime = Date.now();
    const title = this.unitTitle();

    // Try extended content first (4-phase flow)
    const extended = getExtendedPronunciationContent(title);
    if (extended) {
      this.extendedContent.set(extended);
      this.phase.set('explanation');
      return;
    }

    // Fall back to legacy 2-phase flow (explanation → quiz)
    const key = getPronunciationKey(title);
    this.content.set(PRONUNCIATION_CONTENT[key] ?? PRONUNCIATION_CONTENT['default']);
    this.phase.set('explanation');
  }

  protected speak(text: string): void {
    this.tts.setRate(0.85);
    this.tts.speak(text, () => this.tts.setRate(1));
  }

  protected startDemonstration(): void {
    this.phase.set('demonstration');
  }

  protected startPractice(): void {
    this.phase.set('practice');
  }

  protected startQuiz(practiceResult?: number): void {
    if (practiceResult !== undefined) {
      this.practiceScore.set(practiceResult);
    }
    this.phase.set('quiz');
    this.quizIndex.set(0);
    this.selectedOption.set(null);
    this.quizResults.set([]);
  }

  protected selectOption(index: number): void {
    if (this.selectedOption() !== null) return;
    this.selectedOption.set(index);
    const quiz = this.currentQuiz();
    if (quiz) {
      this.quizResults.update((r) => [...r, index === quiz.correct]);
    }
  }

  protected nextQuiz(): void {
    const nextIdx = this.quizIndex() + 1;
    if (nextIdx >= this.quizLength()) {
      this.phase.set('done');
      this.emitResult();
    } else {
      this.quizIndex.set(nextIdx);
      this.selectedOption.set(null);
    }
  }

  private emitResult(): void {
    const r = this.quizResults();
    const correctCount = r.filter((x) => x).length;
    this.exerciseCompleted.emit({
      exerciseType: 'pronunciation',
      exerciseIndex: this.exerciseIndex(),
      correctCount,
      totalCount: r.length,
      score: this.combinedScore(),
      durationMs: Date.now() - this.startTime,
      items: r.map((x) => ({ correct: x })),
    });
  }
}
