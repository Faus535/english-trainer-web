import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReadingApiService } from '../../services/reading-api.service';
import {
  ReadingQuestionResponse,
  ReadingResultResponse,
} from '../../../../shared/models/api.model';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-reading-quiz',
  templateUrl: './reading-quiz.html',
  styleUrl: './reading-quiz.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReadingQuiz implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly readingApi = inject(ReadingApiService);
  private readonly notification = inject(NotificationService);

  protected readonly questions = signal<ReadingQuestionResponse[]>([]);
  protected readonly currentIndex = signal(0);
  protected readonly answers = signal<Record<string, number>>({});
  protected readonly loading = signal(true);
  protected readonly submitting = signal(false);
  protected readonly result = signal<ReadingResultResponse | null>(null);
  protected readonly currentQuestion = computed(
    () => this.questions()[this.currentIndex()] ?? null,
  );
  protected readonly progress = computed(() => {
    const t = this.questions().length;
    return t > 0 ? Math.round(((this.currentIndex() + 1) / t) * 100) : 0;
  });
  protected readonly isLast = computed(() => this.currentIndex() >= this.questions().length - 1);
  protected readonly selectedAnswer = computed(() => {
    const q = this.currentQuestion();
    return q ? (this.answers()[q.id] ?? -1) : -1;
  });
  private textId = '';

  ngOnInit(): void {
    this.textId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.textId) {
      this.router.navigate(['/reading']);
      return;
    }
    this.readingApi.getQuestions(this.textId).subscribe({
      next: (q) => {
        this.questions.set(q);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notification.error('No se pudieron cargar las preguntas');
      },
    });
  }

  protected selectAnswer(index: number): void {
    const q = this.currentQuestion();
    if (!q) return;
    this.answers.update((a) => ({ ...a, [q.id]: index }));
  }

  protected next(): void {
    if (this.isLast()) {
      this.submit();
    } else {
      this.currentIndex.update((i) => i + 1);
    }
  }

  protected previous(): void {
    this.currentIndex.update((i) => Math.max(0, i - 1));
  }

  private submit(): void {
    this.submitting.set(true);
    this.readingApi.submitAnswers(this.textId, { answers: this.answers() }).subscribe({
      next: (r) => {
        this.result.set(r);
        this.submitting.set(false);
      },
      error: () => {
        this.submitting.set(false);
        this.notification.error('Error al enviar respuestas');
      },
    });
  }

  protected goBack(): void {
    this.router.navigate(['/reading']);
  }
}
