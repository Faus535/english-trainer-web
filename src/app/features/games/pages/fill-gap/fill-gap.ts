import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnDestroy,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../../../shared/components/icon/icon';
import { LucideIconData, ArrowLeft, Trophy, Timer, RotateCcw } from 'lucide-angular';
import { MinigameApiService } from '../../../../core/services/minigame-api.service';
import { AuthService } from '../../../../core/services/auth.service';
import { OfflineQueueService } from '../../../../core/services/offline-queue.service';
import { environment } from '../../../../core/services/environment';

interface GapQuestion {
  sentence: string;
  options: string[];
  correct: number;
}

const FILL_GAP_DATA: Record<string, GapQuestion[]> = {
  a1: [
    { sentence: 'She ___ a student.', options: ['is', 'are', 'am', 'be'], correct: 0 },
    {
      sentence: 'I ___ breakfast every day.',
      options: ['has', 'have', 'having', 'had'],
      correct: 1,
    },
    {
      sentence: 'They ___ to school by bus.',
      options: ['goes', 'going', 'go', 'gone'],
      correct: 2,
    },
    {
      sentence: 'He ___ football on Saturdays.',
      options: ['play', 'plays', 'playing', 'played'],
      correct: 1,
    },
    { sentence: 'We ___ from Spain.', options: ['is', 'am', 'are', 'be'], correct: 2 },
    { sentence: 'The cat is ___ the table.', options: ['in', 'on', 'at', 'to'], correct: 1 },
    {
      sentence: 'I ___ like coffee.',
      options: ["doesn't", "don't", "isn't", "aren't"],
      correct: 1,
    },
    { sentence: 'She ___ two brothers.', options: ['have', 'has', 'having', 'is'], correct: 1 },
    { sentence: '___ you speak English?', options: ['Does', 'Do', 'Are', 'Is'], correct: 1 },
    { sentence: 'My house is ___ the park.', options: ['near', 'at', 'in', 'on'], correct: 0 },
  ],
  a2: [
    {
      sentence: 'I ___ to London last year.',
      options: ['go', 'went', 'going', 'gone'],
      correct: 1,
    },
    {
      sentence: 'She has ___ lived here.',
      options: ['ever', 'never', 'always', 'yet'],
      correct: 2,
    },
    {
      sentence: 'If it rains, I ___ stay home.',
      options: ['will', 'would', 'am', 'do'],
      correct: 0,
    },
    {
      sentence: 'He is ___ than his brother.',
      options: ['tall', 'taller', 'tallest', 'more tall'],
      correct: 1,
    },
    {
      sentence: 'We ___ watching TV when he called.',
      options: ['was', 'were', 'are', 'is'],
      correct: 1,
    },
    { sentence: 'You ___ study harder.', options: ['should', 'can', 'would', 'may'], correct: 0 },
    { sentence: 'The film was ___ boring.', options: ['too', 'very', 'much', 'so'], correct: 0 },
    {
      sentence: 'I ___ already finished my homework.',
      options: ['has', 'have', 'had', 'am'],
      correct: 1,
    },
    {
      sentence: 'She asked me ___ I wanted to come.',
      options: ['if', 'that', 'what', 'which'],
      correct: 0,
    },
    {
      sentence: 'There ___ many people at the party.',
      options: ['was', 'were', 'is', 'has'],
      correct: 1,
    },
  ],
  b1: [
    {
      sentence: 'By the time we arrived, the show ___ started.',
      options: ['has', 'had', 'have', 'was'],
      correct: 1,
    },
    {
      sentence: 'She suggested ___ a break.',
      options: ['take', 'to take', 'taking', 'took'],
      correct: 2,
    },
    {
      sentence: 'The report must ___ by Friday.',
      options: ['finish', 'finished', 'be finished', 'finishing'],
      correct: 2,
    },
    { sentence: 'I wish I ___ more time.', options: ['have', 'had', 'has', 'having'], correct: 1 },
    {
      sentence: 'He denied ___ the money.',
      options: ['steal', 'to steal', 'stealing', 'stole'],
      correct: 2,
    },
    {
      sentence: 'This is the house ___ I grew up.',
      options: ['which', 'that', 'where', 'who'],
      correct: 2,
    },
    {
      sentence: 'She ___ be at home. Her car is there.',
      options: ['must', 'can', 'should', 'may'],
      correct: 0,
    },
    {
      sentence: 'I look forward ___ hearing from you.',
      options: ['at', 'for', 'to', 'in'],
      correct: 2,
    },
    {
      sentence: "We'll go ___ it stops raining.",
      options: ['until', 'when', 'while', 'during'],
      correct: 1,
    },
    {
      sentence: 'The more you practice, the ___ you get.',
      options: ['good', 'better', 'best', 'well'],
      correct: 1,
    },
  ],
  b2: [
    {
      sentence: 'Had I known earlier, I ___ have helped.',
      options: ['will', 'would', 'could', 'should'],
      correct: 1,
    },
    {
      sentence: 'Hardly ___ he arrived when it started raining.',
      options: ['has', 'had', 'was', 'did'],
      correct: 1,
    },
    {
      sentence: 'She insisted ___ paying for dinner.',
      options: ['in', 'on', 'at', 'for'],
      correct: 1,
    },
    {
      sentence: "It's high time you ___ a decision.",
      options: ['make', 'made', 'making', 'makes'],
      correct: 1,
    },
    {
      sentence: 'The project is ___ to be completed soon.',
      options: ['likely', 'probably', 'surely', 'maybe'],
      correct: 0,
    },
    {
      sentence: 'Not only ___ she sing, but she also dances.',
      options: ['does', 'did', 'can', 'has'],
      correct: 2,
    },
    {
      sentence: 'We need to ___ with recent developments.',
      options: ['keep up', 'put up', 'give up', 'take up'],
      correct: 0,
    },
    {
      sentence: 'She would rather ___ than fly.',
      options: ['driving', 'to drive', 'drive', 'drove'],
      correct: 2,
    },
  ],
  c1: [
    {
      sentence: 'No sooner ___ he left than the phone rang.',
      options: ['has', 'had', 'was', 'did'],
      correct: 1,
    },
    {
      sentence: '___ the circumstances, we had no choice.',
      options: ['Given', 'Being', 'Having', 'Seeing'],
      correct: 0,
    },
    {
      sentence: 'The results were ___ what we had expected.',
      options: ['in line with', 'in terms of', 'on behalf of', 'with regard to'],
      correct: 0,
    },
    {
      sentence: 'She ___ have known about the meeting.',
      options: ["couldn't", "mustn't", "shouldn't", "wouldn't"],
      correct: 0,
    },
    {
      sentence: "It's ___ that the deadline will be extended.",
      options: ['unlikely', 'improbable', 'doubtful', 'uncertain'],
      correct: 0,
    },
    {
      sentence: 'The evidence ___ to a different conclusion.',
      options: ['leads', 'points', 'takes', 'brings'],
      correct: 1,
    },
    {
      sentence: 'He spoke at ___ about his research.',
      options: ['length', 'last', 'least', 'large'],
      correct: 0,
    },
    {
      sentence: '___ as it may seem, the theory is correct.',
      options: ['Strange', 'Stranger', 'Strangely', 'Strangest'],
      correct: 0,
    },
  ],
};

const STORAGE_KEY = 'english_games_fill_gap_best';
const QUESTIONS_PER_ROUND = 8;
const GAME_DURATION = 90;

@Component({
  selector: 'app-fill-gap',
  imports: [RouterLink, Icon],
  templateUrl: './fill-gap.html',
  styleUrl: './fill-gap.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FillGap implements OnDestroy {
  private readonly minigameApi = inject(MinigameApiService);
  private readonly auth = inject(AuthService);
  private readonly offlineQueue = inject(OfflineQueueService);

  protected readonly backIcon: LucideIconData = ArrowLeft;
  protected readonly trophyIcon: LucideIconData = Trophy;
  protected readonly timerIcon: LucideIconData = Timer;
  protected readonly retryIcon: LucideIconData = RotateCcw;

  private questionResults: boolean[] = [];
  protected readonly wordsLearned = signal<string[]>([]);
  protected readonly xpEarned = signal(0);

  protected readonly level = signal('a1');
  protected readonly gameState = signal<'menu' | 'playing' | 'finished'>('menu');
  protected readonly timeLeft = signal(GAME_DURATION);
  protected readonly bestScore = signal(this.loadBestScore());

  protected readonly questions = signal<GapQuestion[]>([]);
  protected readonly currentIndex = signal(0);
  protected readonly correctCount = signal(0);
  protected readonly answered = signal(false);
  protected readonly selectedOption = signal<number | null>(null);
  protected readonly score = signal(0);

  protected readonly levels = Object.keys(FILL_GAP_DATA);

  protected readonly currentQuestion = computed(() => {
    const qs = this.questions();
    const idx = this.currentIndex();
    return idx < qs.length ? qs[idx] : null;
  });

  protected readonly progressPercent = computed(() =>
    Math.round((this.currentIndex() / QUESTIONS_PER_ROUND) * 100),
  );

  private timerInterval: ReturnType<typeof setInterval> | null = null;
  private advanceTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnDestroy(): void {
    this.stopTimer();
    if (this.advanceTimeout !== null) {
      clearTimeout(this.advanceTimeout);
    }
  }

  protected selectLevel(level: string): void {
    this.level.set(level);
  }

  protected startGame(): void {
    this.wordsLearned.set([]);
    this.xpEarned.set(0);
    this.questionResults = [];
    const level = this.level();

    this.minigameApi.getFillGapData(level).subscribe({
      next: (data) => {
        if (data.questions.length > 0) {
          this.initGame(data.questions);
        } else {
          this.initGameFromFallback(level);
        }
      },
      error: () => this.initGameFromFallback(level),
    });
  }

  private initGameFromFallback(level: string): void {
    const data = FILL_GAP_DATA[level] ?? FILL_GAP_DATA['a1'];
    this.initGame([...data]);
  }

  private initGame(data: GapQuestion[]): void {
    const selected = this.shuffleArray([...data]).slice(0, QUESTIONS_PER_ROUND);

    this.questions.set(selected);
    this.currentIndex.set(0);
    this.correctCount.set(0);
    this.answered.set(false);
    this.selectedOption.set(null);
    this.score.set(0);
    this.timeLeft.set(GAME_DURATION);
    this.gameState.set('playing');
    this.startTimer();
  }

  protected selectAnswer(optionIndex: number): void {
    if (this.answered()) return;
    const q = this.currentQuestion();
    if (!q) return;

    this.answered.set(true);
    this.selectedOption.set(optionIndex);

    const isCorrect = optionIndex === q.correct;
    this.questionResults.push(isCorrect);
    if (isCorrect) {
      this.correctCount.update((c) => c + 1);
    }

    const delay = isCorrect ? 1000 : 2000;
    this.advanceTimeout = setTimeout(() => this.advance(), delay);
  }

  protected isCorrectOption(index: number): boolean {
    const q = this.currentQuestion();
    return this.answered() && q !== null && index === q.correct;
  }

  protected isWrongSelection(index: number): boolean {
    const q = this.currentQuestion();
    return this.answered() && this.selectedOption() === index && q !== null && index !== q.correct;
  }

  protected playAgain(): void {
    this.startGame();
  }

  private advance(): void {
    const nextIdx = this.currentIndex() + 1;
    if (nextIdx >= QUESTIONS_PER_ROUND) {
      this.finishGame();
    } else {
      this.currentIndex.set(nextIdx);
      this.answered.set(false);
      this.selectedOption.set(null);
    }
  }

  private startTimer(): void {
    this.stopTimer();
    this.timerInterval = setInterval(() => {
      this.timeLeft.update((t) => {
        if (t <= 1) {
          this.finishGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval !== null) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private finishGame(): void {
    this.stopTimer();
    if (this.advanceTimeout !== null) {
      clearTimeout(this.advanceTimeout);
      this.advanceTimeout = null;
    }

    const finalScore = this.correctCount() * 12 + Math.floor(this.timeLeft() * 1.5);
    this.score.set(finalScore);
    this.gameState.set('finished');

    const best = this.loadBestScore();
    if (finalScore > best) {
      localStorage.setItem(STORAGE_KEY, String(finalScore));
      this.bestScore.set(finalScore);
    }

    this.reportResults(finalScore);
  }

  private reportResults(finalScore: number): void {
    const userId = this.auth.profileId();
    if (!userId) return;

    const qs = this.questions();
    const answeredItems = this.questionResults.map((correct, i) => ({
      vocabEntryId: null,
      word: qs[i]?.sentence ?? null,
      level: this.level(),
      correct,
    }));

    const request = { gameType: 'FILL_GAP', score: finalScore, answeredItems };

    this.minigameApi.saveGameResults(userId, request).subscribe({
      next: (res) => {
        this.wordsLearned.set(res.wordsLearned);
        this.xpEarned.set(res.xpEarned);
      },
      error: () => {
        this.offlineQueue.enqueue(
          'POST',
          `${environment.apiUrl}/profiles/${userId}/minigames/results`,
          request,
        );
      },
    });
  }

  private loadBestScore(): number {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? parseInt(stored, 10) : 0;
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
