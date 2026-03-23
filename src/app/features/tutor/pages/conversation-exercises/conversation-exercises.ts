import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Icon } from '../../../../shared/components/icon/icon';
import { LucideIconData, ArrowLeft, ArrowRight, Check, X, RotateCcw } from 'lucide-angular';
import { ExerciseApiService } from '../../services/exercise-api.service';
import {
  Exercise,
  ExerciseAnswer,
  ExerciseResult,
  ExerciseResultItem,
} from '../../models/exercise.model';

@Component({
  selector: 'app-conversation-exercises',
  imports: [Icon],
  templateUrl: './conversation-exercises.html',
  styleUrl: './conversation-exercises.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConversationExercises implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly exerciseApi = inject(ExerciseApiService);

  protected readonly exercises = signal<Exercise[]>([]);
  protected readonly currentIndex = signal(0);
  protected readonly loading = signal(true);
  protected readonly answers = signal<Map<string, string>>(new Map());
  protected readonly submitted = signal<Map<string, ExerciseResultItem>>(new Map());
  protected readonly finalResult = signal<ExerciseResult | null>(null);
  protected readonly submitting = signal(false);

  protected readonly prevIcon: LucideIconData = ArrowLeft;
  protected readonly nextIcon: LucideIconData = ArrowRight;
  protected readonly checkIcon: LucideIconData = Check;
  protected readonly wrongIcon: LucideIconData = X;
  protected readonly retryIcon: LucideIconData = RotateCcw;

  protected readonly currentExercise = computed(() => this.exercises()[this.currentIndex()]);
  protected readonly totalExercises = computed(() => this.exercises().length);
  protected readonly progress = computed(() => {
    const total = this.totalExercises();
    return total > 0 ? Math.round(((this.currentIndex() + 1) / total) * 100) : 0;
  });

  protected readonly currentAnswer = computed(() => {
    const ex = this.currentExercise();
    return ex ? (this.answers().get(ex.id) ?? '') : '';
  });

  protected readonly currentResult = computed(() => {
    const ex = this.currentExercise();
    return ex ? (this.submitted().get(ex.id) ?? null) : null;
  });

  protected readonly allAnswered = computed(() => {
    const exs = this.exercises();
    const ans = this.answers();
    return exs.length > 0 && exs.every((e) => ans.has(e.id) && ans.get(e.id)!.trim() !== '');
  });

  protected readonly allSubmitted = computed(() => {
    const exs = this.exercises();
    const sub = this.submitted();
    return exs.length > 0 && exs.every((e) => sub.has(e.id));
  });

  ngOnInit(): void {
    const conversationId = this.route.snapshot.paramMap.get('conversationId');
    if (!conversationId) {
      this.router.navigate(['/tutor']);
      return;
    }

    this.exerciseApi.getConversationExercises(conversationId).subscribe({
      next: (res) => {
        this.exercises.set(res.exercises);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  protected setAnswer(value: string): void {
    const ex = this.currentExercise();
    if (!ex) return;
    this.answers.update((m) => {
      const updated = new Map(m);
      updated.set(ex.id, value);
      return updated;
    });
  }

  protected selectOption(option: string): void {
    this.setAnswer(option);
  }

  protected checkAnswer(): void {
    const ex = this.currentExercise();
    const answer = this.currentAnswer();
    if (!ex || !answer) return;

    const correct = answer.trim().toLowerCase() === ex.correctAnswer.trim().toLowerCase();
    this.submitted.update((m) => {
      const updated = new Map(m);
      updated.set(ex.id, {
        exerciseId: ex.id,
        correct,
        correctAnswer: ex.correctAnswer,
        explanation: ex.explanation,
      });
      return updated;
    });
  }

  protected submitAll(): void {
    const conversationId = this.route.snapshot.paramMap.get('conversationId');
    if (!conversationId) return;

    const answerList: ExerciseAnswer[] = [];
    this.answers().forEach((answer, exerciseId) => {
      answerList.push({ exerciseId, answer });
    });

    this.submitting.set(true);
    this.exerciseApi.submitAnswers(conversationId, answerList).subscribe({
      next: (result) => {
        this.finalResult.set(result);
        result.results.forEach((r) => {
          this.submitted.update((m) => {
            const updated = new Map(m);
            updated.set(r.exerciseId, r);
            return updated;
          });
        });
        this.submitting.set(false);
      },
      error: () => this.submitting.set(false),
    });
  }

  protected goNext(): void {
    if (this.currentIndex() < this.totalExercises() - 1) {
      this.currentIndex.update((i) => i + 1);
    }
  }

  protected goPrev(): void {
    if (this.currentIndex() > 0) {
      this.currentIndex.update((i) => i - 1);
    }
  }

  protected goBack(): void {
    this.router.navigate(['/tutor']);
  }
}
