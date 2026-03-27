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
import { LISTENING_SENTENCES, DictationItem, pickRandom } from './exercise-content.data';
import { getLowerLevels, mixWithReview } from '../../../../../shared/utils/level.utils';
import { SoundLesson, getSoundLessonForUnit } from './data/phonetic-content.data';
import { SoundIntro } from './components/sound-intro';
import { SoundRecognition } from './components/sound-recognition';
import { Icon } from '../../../../../shared/components/icon/icon';
import { Play } from 'lucide-angular';

@Component({
  selector: 'app-listening-exercise',
  imports: [SoundIntro, SoundRecognition, Icon],
  templateUrl: './listening-exercise.html',
  styleUrl: './exercises.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListeningExercise implements OnInit {
  private readonly tts = inject(TtsService);

  protected readonly playIcon = Play;

  readonly level = input.required<Level>();
  readonly unitTitle = input.required<string>();
  readonly reviewMode = input(false);
  readonly contentIds = input<string[]>();
  readonly exerciseCount = input<number>();
  readonly exerciseIndex = input<number>();

  readonly exerciseCompleted = output<ExerciseResult>();
  private startTime = 0;

  protected readonly phase = signal<'intro' | 'recognition' | 'dictation' | 'results'>('dictation');
  protected readonly soundLesson = signal<SoundLesson | null>(null);

  protected readonly items = signal<DictationItem[]>([]);
  protected readonly currentIndex = signal(0);
  protected readonly userInput = signal('');
  protected readonly showResult = signal(false);
  protected readonly results = signal<{ correct: boolean; expected: string; given: string }[]>([]);

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
    this.startTime = Date.now();
    const level = this.level();
    const lowerLevels = getLowerLevels(level);

    if (this.reviewMode() && lowerLevels.length > 0) {
      const reviewLevel = lowerLevels[Math.floor(Math.random() * lowerLevels.length)];
      const sentences = LISTENING_SENTENCES[reviewLevel] ?? LISTENING_SENTENCES['a1'];
      this.items.set(pickRandom(sentences, 5));
    } else {
      const mainSentences = LISTENING_SENTENCES[level] ?? LISTENING_SENTENCES['a1'];
      if (lowerLevels.length > 0) {
        const reviewLevel = lowerLevels[Math.floor(Math.random() * lowerLevels.length)];
        const reviewSentences = LISTENING_SENTENCES[reviewLevel] ?? [];
        this.items.set(mixWithReview(mainSentences, reviewSentences, 5));
      } else {
        this.items.set(pickRandom(mainSentences, 5));
      }
    }

    const lesson = getSoundLessonForUnit(level, this.unitTitle());
    if (lesson) {
      this.soundLesson.set(lesson);
      this.phase.set('intro');
    }
  }

  protected startRecognition(): void {
    const lesson = this.soundLesson();
    if (lesson && lesson.minimalPairs.length > 0) {
      this.phase.set('recognition');
    } else {
      this.phase.set('dictation');
    }
  }

  protected startDictation(): void {
    this.phase.set('dictation');
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

  private emitResult(): void {
    const r = this.results();
    const correctCount = r.filter((x) => x.correct).length;
    this.exerciseCompleted.emit({
      exerciseType: 'listening',
      exerciseIndex: this.exerciseIndex(),
      correctCount,
      totalCount: r.length,
      score: r.length > 0 ? Math.round((correctCount / r.length) * 100) : 0,
      durationMs: Date.now() - this.startTime,
      items: r.map((x) => ({ word: x.expected, correct: x.correct })),
    });
  }

  protected next(): void {
    const nextIdx = this.currentIndex() + 1;
    if (nextIdx >= this.items().length) {
      this.phase.set('results');
      this.emitResult();
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
