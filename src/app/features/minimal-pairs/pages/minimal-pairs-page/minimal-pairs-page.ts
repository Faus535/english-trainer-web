import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Icon } from '../../../../shared/components/icon/icon';
import { LucideIconData, Volume2, Mic, ArrowLeft } from 'lucide-angular';
import { TtsService } from '../../../speak/services/tts.service';
import { SpeechRecognitionService } from '../../../speak/services/speech-recognition.service';
import { MINIMAL_PAIRS, MinimalPair } from '../../data/minimal-pairs.data';

type Mode = 'listen' | 'speak';
type CategoryFilter = 'All' | 'Vowels' | 'Consonants';

interface ExerciseItem {
  pair: MinimalPair;
  targetWord: string;
  otherWord: string;
}

interface ExerciseResult {
  item: ExerciseItem;
  correct: boolean;
  userAnswer: string;
}

@Component({
  selector: 'app-minimal-pairs-page',
  imports: [Icon, RouterLink],
  templateUrl: './minimal-pairs-page.html',
  styleUrl: './minimal-pairs-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MinimalPairsPage {
  protected readonly tts = inject(TtsService);
  private readonly recognition = inject(SpeechRecognitionService);

  protected readonly volumeIcon: LucideIconData = Volume2;
  protected readonly micIcon: LucideIconData = Mic;
  protected readonly backIcon: LucideIconData = ArrowLeft;

  protected readonly mode = signal<Mode>('listen');
  protected readonly categoryFilter = signal<CategoryFilter>('All');
  protected readonly exercises = signal<ExerciseItem[]>([]);
  protected readonly currentIndex = signal(0);
  protected readonly results = signal<ExerciseResult[]>([]);
  protected readonly answered = signal(false);
  protected readonly lastCorrect = signal<boolean | null>(null);
  protected readonly lastUserAnswer = signal('');
  protected readonly finished = signal(false);
  protected readonly recording = signal(false);
  protected readonly speakFeedback = signal('');

  protected readonly supported = this.recognition.supported;
  protected readonly recognitionState = this.recognition.state;

  protected readonly totalExercises = computed(() => this.exercises().length);

  protected readonly currentExercise = computed(() => {
    const ex = this.exercises();
    const idx = this.currentIndex();
    return idx < ex.length ? ex[idx] : null;
  });

  protected readonly progress = computed(() => {
    const total = this.totalExercises();
    if (total === 0) return 0;
    return Math.round((this.currentIndex() / total) * 100);
  });

  protected readonly score = computed(() => {
    const r = this.results();
    return r.filter((x) => x.correct).length;
  });

  protected readonly scorePercent = computed(() => {
    const r = this.results();
    if (r.length === 0) return 0;
    return Math.round((this.score() / r.length) * 100);
  });

  constructor() {
    this.generateExercises();
  }

  protected setMode(m: Mode): void {
    this.mode.set(m);
    this.restart();
  }

  protected setCategory(cat: CategoryFilter): void {
    this.categoryFilter.set(cat);
    this.restart();
  }

  protected playTarget(): void {
    const ex = this.currentExercise();
    if (ex) {
      this.tts.speak(ex.targetWord);
    }
  }

  protected chooseWord(word: string): void {
    if (this.answered()) return;
    const ex = this.currentExercise();
    if (!ex) return;

    const correct = word === ex.targetWord;
    this.answered.set(true);
    this.lastCorrect.set(correct);
    this.lastUserAnswer.set(word);
    this.results.update((r) => [...r, { item: ex, correct, userAnswer: word }]);
  }

  protected async speakTarget(): Promise<void> {
    if (this.recording() || this.answered()) return;
    const ex = this.currentExercise();
    if (!ex) return;

    this.recording.set(true);
    this.speakFeedback.set('');

    const result = await this.recognition.startFreeRecording();

    this.recording.set(false);

    if (result.error) {
      this.speakFeedback.set('No se pudo reconocer. Intenta de nuevo.');
      return;
    }

    const transcript = result.transcript.toLowerCase().trim();
    const target = ex.targetWord.toLowerCase();
    const other = ex.otherWord.toLowerCase();

    this.answered.set(true);
    this.lastUserAnswer.set(result.transcript);

    if (transcript.includes(target)) {
      this.lastCorrect.set(true);
      this.speakFeedback.set('Correcto!');
      this.results.update((r) => [
        ...r,
        { item: ex, correct: true, userAnswer: result.transcript },
      ]);
    } else if (transcript.includes(other)) {
      this.lastCorrect.set(false);
      this.speakFeedback.set(
        `Dijiste "${result.transcript}" - suena como "${ex.otherWord}" en vez de "${ex.targetWord}".`,
      );
      this.results.update((r) => [
        ...r,
        { item: ex, correct: false, userAnswer: result.transcript },
      ]);
    } else {
      this.lastCorrect.set(false);
      this.speakFeedback.set(
        `Dijiste "${result.transcript}" - la palabra objetivo era "${ex.targetWord}".`,
      );
      this.results.update((r) => [
        ...r,
        { item: ex, correct: false, userAnswer: result.transcript },
      ]);
    }
  }

  protected stopRecording(): void {
    this.recognition.stopRecording();
    this.recording.set(false);
  }

  protected nextExercise(): void {
    const next = this.currentIndex() + 1;
    if (next >= this.totalExercises()) {
      this.finished.set(true);
    } else {
      this.currentIndex.set(next);
      this.answered.set(false);
      this.lastCorrect.set(null);
      this.lastUserAnswer.set('');
      this.speakFeedback.set('');
    }
  }

  protected restart(): void {
    this.generateExercises();
    this.currentIndex.set(0);
    this.results.set([]);
    this.answered.set(false);
    this.lastCorrect.set(null);
    this.lastUserAnswer.set('');
    this.finished.set(false);
    this.speakFeedback.set('');
    this.recording.set(false);
  }

  private generateExercises(): void {
    const cat = this.categoryFilter();
    const filtered =
      cat === 'All' ? MINIMAL_PAIRS : MINIMAL_PAIRS.filter((p) => p.category === cat);

    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 10);

    const items: ExerciseItem[] = selected.map((pair) => {
      const pickFirst = Math.random() < 0.5;
      return {
        pair,
        targetWord: pickFirst ? pair.word1 : pair.word2,
        otherWord: pickFirst ? pair.word2 : pair.word1,
      };
    });

    this.exercises.set(items);
  }
}
