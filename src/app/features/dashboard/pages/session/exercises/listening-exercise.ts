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
import { LISTENING_SENTENCES, DictationItem, pickRandom } from './exercise-content.data';

@Component({
  selector: 'app-listening-exercise',
  templateUrl: './listening-exercise.html',
  styleUrl: './exercises.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListeningExercise implements OnInit {
  private readonly tts = inject(TtsService);

  readonly level = input.required<Level>();
  readonly unitTitle = input.required<string>();

  protected readonly items = signal<DictationItem[]>([]);
  protected readonly currentIndex = signal(0);
  protected readonly userInput = signal('');
  protected readonly showResult = signal(false);
  protected readonly results = signal<{ correct: boolean; expected: string; given: string }[]>([]);
  protected readonly finished = signal(false);

  protected readonly current = computed(() => this.items()[this.currentIndex()] ?? null);
  protected readonly progress = computed(() => {
    const total = this.items().length;
    return total > 0 ? `${this.currentIndex() + 1} / ${total}` : '';
  });
  protected readonly score = computed(() => {
    const r = this.results();
    if (r.length === 0) return 0;
    return Math.round((r.filter((x) => x.correct).length / r.length) * 100);
  });

  ngOnInit(): void {
    const sentences = LISTENING_SENTENCES[this.level()] ?? LISTENING_SENTENCES['a1'];
    this.items.set(pickRandom(sentences, 5));
  }

  protected play(): void {
    const item = this.current();
    if (!item) return;
    const originalRate = this.tts.rate();
    this.tts.setRate(item.speed);
    this.tts.speak(item.text, () => this.tts.setRate(originalRate));
  }

  protected onInput(event: Event): void {
    this.userInput.set((event.target as HTMLInputElement).value);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') this.check();
  }

  protected check(): void {
    const item = this.current();
    if (!item || this.showResult()) return;

    const given = this.userInput()
      .trim()
      .toLowerCase()
      .replace(/[^a-z\s']/g, '');
    const expected = item.text.toLowerCase().replace(/[^a-z\s']/g, '');
    const words = expected.split(/\s+/);
    const givenWords = given.split(/\s+/);
    let matched = 0;
    for (const w of words) {
      if (givenWords.includes(w)) matched++;
    }
    const correct = words.length > 0 && matched / words.length >= 0.7;

    this.results.update((r) => [...r, { correct, expected: item.text, given: this.userInput() }]);
    this.showResult.set(true);
  }

  protected next(): void {
    const nextIdx = this.currentIndex() + 1;
    if (nextIdx >= this.items().length) {
      this.finished.set(true);
    } else {
      this.currentIndex.set(nextIdx);
      this.userInput.set('');
      this.showResult.set(false);
    }
  }

  protected skip(): void {
    const item = this.current();
    if (item) {
      this.results.update((r) => [...r, { correct: false, expected: item.text, given: '' }]);
    }
    this.next();
  }
}
