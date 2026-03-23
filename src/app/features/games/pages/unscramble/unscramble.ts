import { Component, ChangeDetectionStrategy, signal, computed, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../../../shared/components/icon/icon';
import { LucideIconData, ArrowLeft, Trophy, Timer, RotateCcw } from 'lucide-angular';

interface ScrambleLetter {
  char: string;
  originalIndex: number;
  used: boolean;
}

const UNSCRAMBLE_DATA: Record<string, string[]> = {
  a1: [
    'hello',
    'water',
    'house',
    'table',
    'bread',
    'chair',
    'music',
    'happy',
    'green',
    'river',
    'plant',
    'smile',
    'night',
    'fruit',
    'light',
    'stone',
  ],
  a2: [
    'weather',
    'kitchen',
    'morning',
    'animals',
    'teacher',
    'village',
    'holiday',
    'country',
    'bedroom',
    'chicken',
    'picture',
    'balloon',
    'library',
    'problem',
    'captain',
    'blanket',
  ],
  b1: [
    'adventure',
    'beautiful',
    'chocolate',
    'dangerous',
    'education',
    'fantastic',
    'geography',
    'happiness',
    'important',
    'knowledge',
    'landscape',
    'necessary',
    'organized',
    'passenger',
    'questions',
  ],
  b2: [
    'achievement',
    'comfortable',
    'demonstrate',
    'environment',
    'flexibility',
    'imagination',
    'collaborate',
    'observation',
    'performance',
    'responsible',
    'sustainable',
    'temperature',
    'understand',
    'volunteered',
    'celebration',
  ],
  c1: [
    'approximately',
    'communication',
    'extraordinary',
    'infrastructure',
    'manufacturing',
    'opportunities',
    'psychological',
    'rehabilitation',
    'sophisticated',
    'transformation',
    'vulnerability',
    'accountability',
    'comprehensive',
    'determination',
    'entrepreneurial',
  ],
};

const STORAGE_KEY = 'english_games_unscramble_best';
const WORDS_PER_ROUND = 8;
const GAME_DURATION = 90;

@Component({
  selector: 'app-unscramble',
  imports: [RouterLink, Icon],
  templateUrl: './unscramble.html',
  styleUrl: './unscramble.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Unscramble implements OnDestroy {
  protected readonly backIcon: LucideIconData = ArrowLeft;
  protected readonly trophyIcon: LucideIconData = Trophy;
  protected readonly timerIcon: LucideIconData = Timer;
  protected readonly retryIcon: LucideIconData = RotateCcw;

  protected readonly level = signal('a1');
  protected readonly gameState = signal<'menu' | 'playing' | 'finished'>('menu');
  protected readonly timeLeft = signal(GAME_DURATION);
  protected readonly bestScore = signal(this.loadBestScore());

  protected readonly words = signal<string[]>([]);
  protected readonly currentIndex = signal(0);
  protected readonly completedCount = signal(0);
  protected readonly score = signal(0);

  protected readonly scrambledLetters = signal<ScrambleLetter[]>([]);
  protected readonly builtLetters = signal<ScrambleLetter[]>([]);
  protected readonly showCorrect = signal(false);
  protected readonly showWrong = signal(false);

  protected readonly levels = Object.keys(UNSCRAMBLE_DATA);

  protected readonly currentWord = computed(() => {
    const ws = this.words();
    const idx = this.currentIndex();
    return idx < ws.length ? ws[idx] : null;
  });

  protected readonly builtWord = computed(() =>
    this.builtLetters()
      .map((l) => l.char)
      .join(''),
  );

  protected readonly progressPercent = computed(() =>
    Math.round((this.currentIndex() / WORDS_PER_ROUND) * 100),
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
    const data = UNSCRAMBLE_DATA[this.level()] ?? UNSCRAMBLE_DATA['a1'];
    const selected = this.shuffleArray([...data]).slice(0, WORDS_PER_ROUND);

    this.words.set(selected);
    this.currentIndex.set(0);
    this.completedCount.set(0);
    this.score.set(0);
    this.timeLeft.set(GAME_DURATION);
    this.showCorrect.set(false);
    this.showWrong.set(false);
    this.gameState.set('playing');
    this.prepareWord(selected[0]);
    this.startTimer();
  }

  protected tapScrambledLetter(index: number): void {
    if (this.gameState() !== 'playing') return;
    const letters = this.scrambledLetters();
    if (letters[index].used) return;

    const updated = [...letters];
    updated[index] = { ...updated[index], used: true };
    this.scrambledLetters.set(updated);

    this.builtLetters.update((built) => [...built, letters[index]]);

    // Check if word is complete
    const word = this.currentWord();
    if (word && this.builtLetters().length === word.length) {
      this.checkWord();
    }
  }

  protected tapBuiltLetter(index: number): void {
    if (this.gameState() !== 'playing') return;
    const built = this.builtLetters();
    const letter = built[index];

    // Remove from built
    const newBuilt = [...built];
    newBuilt.splice(index, 1);
    this.builtLetters.set(newBuilt);

    // Mark as unused in scrambled
    const scrambled = this.scrambledLetters();
    const updated = [...scrambled];
    const scrambledIdx = updated.findIndex(
      (l) => l.originalIndex === letter.originalIndex && l.used,
    );
    if (scrambledIdx !== -1) {
      updated[scrambledIdx] = { ...updated[scrambledIdx], used: false };
      this.scrambledLetters.set(updated);
    }
  }

  protected playAgain(): void {
    this.startGame();
  }

  private checkWord(): void {
    const word = this.currentWord();
    const built = this.builtWord();

    if (word && built.toLowerCase() === word.toLowerCase()) {
      this.showCorrect.set(true);
      this.completedCount.update((c) => c + 1);
      this.advanceTimeout = setTimeout(() => {
        this.showCorrect.set(false);
        this.advance();
      }, 800);
    } else {
      this.showWrong.set(true);
      this.advanceTimeout = setTimeout(() => {
        this.showWrong.set(false);
        // Reset current word
        if (word) {
          this.prepareWord(word);
        }
      }, 600);
    }
  }

  private advance(): void {
    const nextIdx = this.currentIndex() + 1;
    if (nextIdx >= WORDS_PER_ROUND) {
      this.finishGame();
    } else {
      this.currentIndex.set(nextIdx);
      const word = this.words()[nextIdx];
      if (word) {
        this.prepareWord(word);
      }
    }
  }

  private prepareWord(word: string): void {
    const letters: ScrambleLetter[] = word.split('').map((char, i) => ({
      char,
      originalIndex: i,
      used: false,
    }));
    this.scrambledLetters.set(this.shuffleArray(letters));
    this.builtLetters.set([]);
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

    const finalScore = this.completedCount() * 15 + Math.floor(this.timeLeft() * 1.5);
    this.score.set(finalScore);
    this.gameState.set('finished');

    const best = this.loadBestScore();
    if (finalScore > best) {
      localStorage.setItem(STORAGE_KEY, String(finalScore));
      this.bestScore.set(finalScore);
    }
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
