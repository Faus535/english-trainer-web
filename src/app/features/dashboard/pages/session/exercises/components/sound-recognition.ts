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
import { TtsService } from '../../../../../speak/services/tts.service';
import { SoundLesson, MinimalPair } from '../data/phonetic-content.data';

interface RecognitionQuestion {
  pair: MinimalPair;
  targetIsCorrect: boolean;
  targetWord: string;
}

@Component({
  selector: 'app-sound-recognition',
  imports: [],
  templateUrl: './sound-recognition.html',
  styleUrl: '../exercises.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoundRecognition implements OnInit {
  private readonly tts = inject(TtsService);

  readonly lesson = input.required<SoundLesson>();
  readonly completed = output<void>();

  protected readonly questions = signal<RecognitionQuestion[]>([]);
  protected readonly currentIndex = signal(0);
  protected readonly selectedOption = signal<string | null>(null);
  protected readonly results = signal<boolean[]>([]);
  protected readonly finished = signal(false);

  protected readonly current = computed(() => this.questions()[this.currentIndex()] ?? null);
  protected readonly progress = computed(() => {
    const total = this.questions().length;
    return total > 0 ? `${this.currentIndex() + 1} / ${total}` : '';
  });

  ngOnInit(): void {
    const pairs = this.lesson().minimalPairs.slice(0, 3);
    const qs: RecognitionQuestion[] = pairs.map((pair) => {
      const targetIsCorrect = Math.random() > 0.5;
      return {
        pair,
        targetIsCorrect,
        targetWord: targetIsCorrect ? pair.correct.word : pair.incorrect.word,
      };
    });
    this.questions.set(qs);
  }

  protected playTarget(): void {
    const q = this.current();
    if (!q) return;
    this.tts.setRate(0.85);
    this.tts.speak(q.targetWord, () => this.tts.setRate(1));
  }

  protected select(word: string): void {
    if (this.selectedOption() !== null) return;
    this.selectedOption.set(word);
    const q = this.current();
    if (q) {
      this.results.update((r) => [...r, word === q.targetWord]);
    }
  }

  protected next(): void {
    const nextIdx = this.currentIndex() + 1;
    if (nextIdx >= this.questions().length) {
      this.finished.set(true);
    } else {
      this.currentIndex.set(nextIdx);
      this.selectedOption.set(null);
    }
  }

  protected onFinish(): void {
    this.completed.emit();
  }

  protected isCorrectOption(word: string): boolean {
    const q = this.current();
    return this.selectedOption() !== null && q !== null && word === q.targetWord;
  }

  protected isWrongOption(word: string): boolean {
    return this.selectedOption() === word && !this.isCorrectOption(word);
  }
}
