import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ImmerseStateService } from '../../services/immerse-state.service';
import { VocabChip } from '../../components/vocab-chip/vocab-chip';
import { ListeningClozeCard } from '../../components/listening-cloze-card/listening-cloze-card';

@Component({
  selector: 'app-immerse-exercises',
  imports: [FormsModule, VocabChip, ListeningClozeCard],
  templateUrl: './immerse-exercises.html',
  styleUrl: './immerse-exercises.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImmerseExercises implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly immerseState = inject(ImmerseStateService);

  protected readonly exercises = this.immerseState.exercises;
  protected readonly progress = this.immerseState.exerciseProgress;
  protected readonly capturedVocab = this.immerseState.capturedVocab;
  protected readonly loading = this.immerseState.loading;
  protected readonly completionRate = this.immerseState.exerciseCompletionRate;
  protected readonly listeningMode = this.immerseState.listeningMode;

  protected readonly currentAnswer = signal('');
  protected readonly selectedOption = signal<string | null>(null);
  protected readonly currentIndex = signal(0);
  protected readonly showResults = signal(false);

  protected readonly contentId = computed(
    () => this.route.snapshot.paramMap.get('contentId') ?? '',
  );

  protected readonly currentExercise = computed(() => {
    const idx = this.currentIndex();
    const exs = this.exercises();
    return idx < exs.length ? exs[idx] : null;
  });

  protected readonly isComplete = computed(
    () => this.progress().length === this.exercises().length && this.exercises().length > 0,
  );

  protected readonly accuracy = computed(() => {
    const results = this.progress();
    if (results.length === 0) return 0;
    const correct = results.filter((r) => r.correct).length;
    return Math.round((correct / results.length) * 100);
  });

  ngOnInit(): void {
    const id = this.contentId();
    if (id) {
      this.immerseState.loadExercises(id);
    }
  }

  protected submitAnswer(): void {
    const exercise = this.currentExercise();
    if (!exercise) return;

    const answer =
      exercise.type === 'definition-match'
        ? (this.selectedOption() ?? '')
        : this.currentAnswer().trim();

    if (!answer) return;

    this.immerseState.submitAnswer(this.contentId(), exercise.id, answer);
    this.currentAnswer.set('');
    this.selectedOption.set(null);

    if (this.currentIndex() < this.exercises().length - 1) {
      this.currentIndex.update((i) => i + 1);
    } else {
      this.immerseState.completeExercises();
      this.showResults.set(true);
    }
  }

  protected selectOption(option: string): void {
    this.selectedOption.set(option);
  }

  protected backToArticle(): void {
    this.router.navigate(['/immerse', this.contentId()]);
  }

  protected newContent(): void {
    this.immerseState.reset();
    this.router.navigate(['/immerse']);
  }

  protected toggleMode(): void {
    this.currentIndex.set(0);
    this.showResults.set(false);
    this.immerseState.toggleMode();
  }

  protected onListeningAnswered(result: { correct: boolean; answer: string }, index: number): void {
    const exercise = this.exercises()[index];
    if (!exercise) return;
    this.immerseState.submitAnswer(this.contentId(), exercise.id, result.answer);
    if (index < this.exercises().length - 1) {
      this.currentIndex.update((i) => i + 1);
    } else {
      this.immerseState.completeExercises();
      this.showResults.set(true);
    }
  }
}
