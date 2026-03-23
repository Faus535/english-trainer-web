import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Icon } from '../../../../shared/components/icon/icon';
import { LucideIconData, Puzzle, PenLine, Shuffle, Trophy } from 'lucide-angular';

interface GameCard {
  name: string;
  description: string;
  icon: LucideIconData;
  route: string;
  storageKey: string;
}

const GAMES: GameCard[] = [
  {
    name: 'Empareja palabras',
    description: 'Conecta palabras en ingles con su traduccion',
    icon: Puzzle,
    route: '/games/word-match',
    storageKey: 'english_games_word_match_best',
  },
  {
    name: 'Completa la frase',
    description: 'Elige la palabra correcta para cada frase',
    icon: PenLine,
    route: '/games/fill-gap',
    storageKey: 'english_games_fill_gap_best',
  },
  {
    name: 'Ordena las letras',
    description: 'Reordena las letras para formar la palabra correcta',
    icon: Shuffle,
    route: '/games/unscramble',
    storageKey: 'english_games_unscramble_best',
  },
];

@Component({
  selector: 'app-games-hub',
  imports: [RouterLink, Icon],
  templateUrl: './games-hub.html',
  styleUrl: './games-hub.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GamesHub implements OnInit {
  protected readonly trophyIcon: LucideIconData = Trophy;
  protected readonly games = GAMES;
  protected readonly bestScores = signal<Record<string, number | null>>({});

  ngOnInit(): void {
    const scores: Record<string, number | null> = {};
    for (const game of GAMES) {
      const stored = localStorage.getItem(game.storageKey);
      scores[game.storageKey] = stored ? parseInt(stored, 10) : null;
    }
    this.bestScores.set(scores);
  }

  protected getBestScore(storageKey: string): number | null {
    return this.bestScores()[storageKey] ?? null;
  }
}
