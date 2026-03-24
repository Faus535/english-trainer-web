import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  output,
  signal,
  computed,
} from '@angular/core';
import { TtsService } from '../../../../../speak/services/tts.service';
import { PracticeItem } from '../data/pronunciation-extended.data';

@Component({
  selector: 'app-pronunciation-practice',
  templateUrl: './pronunciation-practice.html',
  styleUrl: '../exercises.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PronunciationPractice {
  private readonly tts = inject(TtsService);

  readonly items = input.required<PracticeItem[]>();
  readonly completed = output<number>();

  protected readonly currentIndex = signal(0);
  protected readonly selectedOption = signal<number | null>(null);
  protected readonly results = signal<boolean[]>([]);

  protected readonly currentItem = computed(() => {
    const all = this.items();
    return all[this.currentIndex()] ?? null;
  });

  protected readonly isLast = computed(() => {
    return this.currentIndex() >= this.items().length - 1;
  });

  protected speak(text: string): void {
    this.tts.setRate(0.85);
    this.tts.speak(text, () => this.tts.setRate(1));
  }

  protected selectOption(index: number): void {
    if (this.selectedOption() !== null) return;
    this.selectedOption.set(index);
    const item = this.currentItem();
    if (item) {
      this.results.update((r) => [...r, index === item.answer]);
    }
  }

  protected next(): void {
    if (this.isLast()) {
      const r = this.results();
      const score = r.length > 0 ? Math.round((r.filter((x) => x).length / r.length) * 100) : 0;
      this.completed.emit(score);
    } else {
      this.currentIndex.update((i) => i + 1);
      this.selectedOption.set(null);
    }
  }
}
