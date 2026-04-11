import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  input,
  output,
} from '@angular/core';
import { TtsService } from '../../../../shared/services/tts.service';
import { ImmerseExercise } from '../../models/immerse.model';

type CardState = 'idle' | 'playing' | 'answering' | 'feedback';

@Component({
  selector: 'app-listening-cloze-card',
  imports: [],
  templateUrl: './listening-cloze-card.html',
  styleUrl: './listening-cloze-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListeningClozeCard {
  private readonly tts = inject(TtsService);

  readonly exercise = input.required<ImmerseExercise>();
  readonly answered = output<{ correct: boolean; answer: string }>();

  protected readonly _cardState = signal<CardState>('idle');
  protected readonly _selectedAnswer = signal<string | null>(null);
  protected readonly _isCorrect = signal(false);

  protected readonly revealWords = computed(() => {
    const ex = this.exercise();
    if (!ex.listenText) return [];
    return ex.listenText.split(' ');
  });

  protected play(): void {
    this._cardState.set('playing');
    this.tts.speak(this.exercise().listenText ?? '', () => {
      this._cardState.set('answering');
    });
  }

  protected selectAnswer(option: string): void {
    if (this._cardState() !== 'answering') return;
    const correct = option === this.exercise().correctAnswer;
    this._selectedAnswer.set(option);
    this._isCorrect.set(correct);
    this._cardState.set('feedback');
  }

  protected next(): void {
    this.answered.emit({ correct: this._isCorrect(), answer: this._selectedAnswer() ?? '' });
  }
}
