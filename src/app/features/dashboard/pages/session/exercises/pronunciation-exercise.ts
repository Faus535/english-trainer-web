import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { TtsService } from '../../../../speak/services/tts.service';
import { Level } from '../../../../../shared/models/learning.model';
import {
  PRONUNCIATION_CONTENT,
  PronunciationContent,
  getPronunciationKey,
} from './exercise-content.data';

@Component({
  selector: 'app-pronunciation-exercise',
  templateUrl: './pronunciation-exercise.html',
  styleUrl: './exercises.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PronunciationExercise implements OnInit {
  private readonly tts = inject(TtsService);

  readonly level = input.required<Level>();
  readonly unitTitle = input.required<string>();

  protected readonly content = signal<PronunciationContent | null>(null);
  protected readonly phase = signal<'learn' | 'quiz' | 'done'>('learn');
  protected readonly quizIndex = signal(0);
  protected readonly selectedOption = signal<number | null>(null);
  protected readonly quizResults = signal<boolean[]>([]);

  protected readonly currentQuiz = computed(() => {
    const c = this.content();
    if (!c) return null;
    return c.quiz[this.quizIndex()] ?? null;
  });

  protected readonly score = computed(() => {
    const r = this.quizResults();
    if (r.length === 0) return 0;
    return Math.round((r.filter((x) => x).length / r.length) * 100);
  });

  ngOnInit(): void {
    const key = getPronunciationKey(this.unitTitle());
    this.content.set(PRONUNCIATION_CONTENT[key] ?? PRONUNCIATION_CONTENT['default']);
  }

  protected speak(text: string): void {
    this.tts.setRate(0.85);
    this.tts.speak(text, () => this.tts.setRate(1));
  }

  protected startQuiz(): void {
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
    const c = this.content();
    if (!c) return;
    const nextIdx = this.quizIndex() + 1;
    if (nextIdx >= c.quiz.length) {
      this.phase.set('done');
    } else {
      this.quizIndex.set(nextIdx);
      this.selectedOption.set(null);
    }
  }
}
