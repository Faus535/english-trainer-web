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

interface WordPair {
  en: string;
  es: string;
  vocabEntryId?: string;
}

interface MatchItem {
  text: string;
  pairIndex: number;
  matched: boolean;
  selected: boolean;
  incorrect: boolean;
}

const WORD_PAIRS: Record<string, WordPair[]> = {
  a1: [
    { en: 'hello', es: 'hola' },
    { en: 'goodbye', es: 'adios' },
    { en: 'water', es: 'agua' },
    { en: 'house', es: 'casa' },
    { en: 'cat', es: 'gato' },
    { en: 'dog', es: 'perro' },
    { en: 'book', es: 'libro' },
    { en: 'table', es: 'mesa' },
    { en: 'door', es: 'puerta' },
    { en: 'window', es: 'ventana' },
    { en: 'bread', es: 'pan' },
    { en: 'milk', es: 'leche' },
    { en: 'chair', es: 'silla' },
    { en: 'bed', es: 'cama' },
    { en: 'sun', es: 'sol' },
  ],
  a2: [
    { en: 'weather', es: 'clima' },
    { en: 'kitchen', es: 'cocina' },
    { en: 'breakfast', es: 'desayuno' },
    { en: 'afternoon', es: 'tarde' },
    { en: 'building', es: 'edificio' },
    { en: 'neighbor', es: 'vecino' },
    { en: 'birthday', es: 'cumpleanos' },
    { en: 'homework', es: 'deberes' },
    { en: 'countryside', es: 'campo' },
    { en: 'traffic', es: 'trafico' },
    { en: 'mistake', es: 'error' },
    { en: 'dream', es: 'sueno' },
    { en: 'health', es: 'salud' },
    { en: 'journey', es: 'viaje' },
    { en: 'knowledge', es: 'conocimiento' },
  ],
  b1: [
    { en: 'achievement', es: 'logro' },
    { en: 'environment', es: 'medio ambiente' },
    { en: 'challenge', es: 'desafio' },
    { en: 'opportunity', es: 'oportunidad' },
    { en: 'research', es: 'investigacion' },
    { en: 'improvement', es: 'mejora' },
    { en: 'behavior', es: 'comportamiento' },
    { en: 'experience', es: 'experiencia' },
    { en: 'government', es: 'gobierno' },
    { en: 'relationship', es: 'relacion' },
    { en: 'development', es: 'desarrollo' },
    { en: 'advertisement', es: 'anuncio' },
    { en: 'suggestion', es: 'sugerencia' },
    { en: 'responsibility', es: 'responsabilidad' },
    { en: 'appointment', es: 'cita' },
  ],
  b2: [
    { en: 'acknowledge', es: 'reconocer' },
    { en: 'breakthrough', es: 'avance' },
    { en: 'controversy', es: 'controversia' },
    { en: 'drawback', es: 'inconveniente' },
    { en: 'forthcoming', es: 'proximo' },
    { en: 'hierarchy', es: 'jerarquia' },
    { en: 'misleading', es: 'enganoso' },
    { en: 'outcome', es: 'resultado' },
    { en: 'reluctant', es: 'reacio' },
    { en: 'sustainable', es: 'sostenible' },
    { en: 'thorough', es: 'exhaustivo' },
    { en: 'undermine', es: 'socavar' },
    { en: 'widespread', es: 'generalizado' },
    { en: 'withstand', es: 'resistir' },
    { en: 'yield', es: 'rendimiento' },
  ],
  c1: [
    { en: 'ambiguity', es: 'ambiguedad' },
    { en: 'complacency', es: 'complacencia' },
    { en: 'discrepancy', es: 'discrepancia' },
    { en: 'eloquent', es: 'elocuente' },
    { en: 'feasibility', es: 'viabilidad' },
    { en: 'imminent', es: 'inminente' },
    { en: 'juxtapose', es: 'yuxtaponer' },
    { en: 'leverage', es: 'apalancamiento' },
    { en: 'meticulous', es: 'meticuloso' },
    { en: 'negligible', es: 'insignificante' },
    { en: 'paramount', es: 'primordial' },
    { en: 'quintessential', es: 'esencial' },
    { en: 'repercussion', es: 'repercusion' },
    { en: 'scrutinize', es: 'escudrinar' },
    { en: 'unprecedented', es: 'sin precedentes' },
  ],
};

const STORAGE_KEY = 'english_games_word_match_best';
const GAME_DURATION = 60;
const PAIRS_PER_ROUND = 8;

@Component({
  selector: 'app-word-match',
  imports: [RouterLink, Icon],
  templateUrl: './word-match.html',
  styleUrl: './word-match.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WordMatch implements OnDestroy {
  private readonly minigameApi = inject(MinigameApiService);
  private readonly auth = inject(AuthService);
  private readonly offlineQueue = inject(OfflineQueueService);

  protected readonly backIcon: LucideIconData = ArrowLeft;
  protected readonly trophyIcon: LucideIconData = Trophy;
  protected readonly timerIcon: LucideIconData = Timer;
  protected readonly retryIcon: LucideIconData = RotateCcw;

  private gamePairs: WordPair[] = [];
  protected readonly wordsLearned = signal<string[]>([]);
  protected readonly xpEarned = signal(0);

  protected readonly level = signal('a1');
  protected readonly gameState = signal<'menu' | 'playing' | 'finished'>('menu');
  protected readonly timeLeft = signal(GAME_DURATION);
  protected readonly matchedCount = signal(0);
  protected readonly score = signal(0);
  protected readonly bestScore = signal(this.loadBestScore());

  protected readonly enItems = signal<MatchItem[]>([]);
  protected readonly esItems = signal<MatchItem[]>([]);
  protected readonly selectedEn = signal<number | null>(null);
  protected readonly selectedEs = signal<number | null>(null);

  protected readonly levels = Object.keys(WORD_PAIRS);

  protected readonly allMatched = computed(() => this.matchedCount() >= PAIRS_PER_ROUND);

  private timerInterval: ReturnType<typeof setInterval> | null = null;

  ngOnDestroy(): void {
    this.stopTimer();
  }

  protected selectLevel(level: string): void {
    this.level.set(level);
  }

  protected startGame(): void {
    this.wordsLearned.set([]);
    this.xpEarned.set(0);
    const level = this.level();

    this.minigameApi.getWordMatchData(level).subscribe({
      next: (data) => {
        if (data.pairs.length > 0) {
          this.initGame(
            data.pairs.map((p) => ({ en: p.en, es: p.es, vocabEntryId: p.vocabEntryId })),
          );
        } else {
          this.initGameFromFallback(level);
        }
      },
      error: () => this.initGameFromFallback(level),
    });
  }

  private initGameFromFallback(level: string): void {
    const pairs = WORD_PAIRS[level] ?? WORD_PAIRS['a1'];
    this.initGame([...pairs]);
  }

  private initGame(pairs: WordPair[]): void {
    const selected = this.shuffleArray([...pairs]).slice(0, PAIRS_PER_ROUND);
    this.gamePairs = selected;

    const enItems: MatchItem[] = this.shuffleArray(
      selected.map((p, i) => ({
        text: p.en,
        pairIndex: i,
        matched: false,
        selected: false,
        incorrect: false,
      })),
    );

    const esItems: MatchItem[] = this.shuffleArray(
      selected.map((p, i) => ({
        text: p.es,
        pairIndex: i,
        matched: false,
        selected: false,
        incorrect: false,
      })),
    );

    this.enItems.set(enItems);
    this.esItems.set(esItems);
    this.selectedEn.set(null);
    this.selectedEs.set(null);
    this.matchedCount.set(0);
    this.score.set(0);
    this.timeLeft.set(GAME_DURATION);
    this.gameState.set('playing');
    this.startTimer();
  }

  protected selectEnWord(index: number): void {
    if (this.gameState() !== 'playing') return;
    const items = this.enItems();
    if (items[index].matched) return;

    this.clearSelections('en');
    const updated = [...items];
    updated[index] = { ...updated[index], selected: true };
    this.enItems.set(updated);
    this.selectedEn.set(index);
    this.tryMatch();
  }

  protected selectEsWord(index: number): void {
    if (this.gameState() !== 'playing') return;
    const items = this.esItems();
    if (items[index].matched) return;

    this.clearSelections('es');
    const updated = [...items];
    updated[index] = { ...updated[index], selected: true };
    this.esItems.set(updated);
    this.selectedEs.set(index);
    this.tryMatch();
  }

  protected playAgain(): void {
    this.startGame();
  }

  private tryMatch(): void {
    const enIdx = this.selectedEn();
    const esIdx = this.selectedEs();
    if (enIdx === null || esIdx === null) return;

    const en = this.enItems()[enIdx];
    const es = this.esItems()[esIdx];

    if (en.pairIndex === es.pairIndex) {
      // Correct match
      const updatedEn = [...this.enItems()];
      updatedEn[enIdx] = { ...updatedEn[enIdx], matched: true, selected: false };
      this.enItems.set(updatedEn);

      const updatedEs = [...this.esItems()];
      updatedEs[esIdx] = { ...updatedEs[esIdx], matched: true, selected: false };
      this.esItems.set(updatedEs);

      this.matchedCount.update((c) => c + 1);
      this.selectedEn.set(null);
      this.selectedEs.set(null);

      if (this.matchedCount() >= PAIRS_PER_ROUND) {
        this.finishGame();
      }
    } else {
      // Incorrect match
      const updatedEn = [...this.enItems()];
      updatedEn[enIdx] = { ...updatedEn[enIdx], incorrect: true };
      this.enItems.set(updatedEn);

      const updatedEs = [...this.esItems()];
      updatedEs[esIdx] = { ...updatedEs[esIdx], incorrect: true };
      this.esItems.set(updatedEs);

      setTimeout(() => {
        const resetEn = [...this.enItems()];
        resetEn[enIdx] = { ...resetEn[enIdx], incorrect: false, selected: false };
        this.enItems.set(resetEn);

        const resetEs = [...this.esItems()];
        resetEs[esIdx] = { ...resetEs[esIdx], incorrect: false, selected: false };
        this.esItems.set(resetEs);

        this.selectedEn.set(null);
        this.selectedEs.set(null);
      }, 500);
    }
  }

  private clearSelections(side: 'en' | 'es'): void {
    if (side === 'en') {
      const items = this.enItems().map((item) =>
        item.selected ? { ...item, selected: false } : item,
      );
      this.enItems.set(items);
    } else {
      const items = this.esItems().map((item) =>
        item.selected ? { ...item, selected: false } : item,
      );
      this.esItems.set(items);
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
    const finalScore = this.matchedCount() * 10 + this.timeLeft() * 2;
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

    const enItemsList = this.enItems();
    const answeredItems = this.gamePairs.map((pair, i) => ({
      vocabEntryId: pair.vocabEntryId ?? null,
      word: pair.en,
      level: this.level(),
      correct: enItemsList.find((item) => item.pairIndex === i)?.matched ?? false,
    }));

    const request = { gameType: 'WORD_MATCH', score: finalScore, answeredItems };

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
