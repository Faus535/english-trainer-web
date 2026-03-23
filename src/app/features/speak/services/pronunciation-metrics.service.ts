import { Injectable, signal, computed } from '@angular/core';
import { WordResult } from '../models/speak.model';

export interface DifficultWord {
  word: string;
  failCount: number;
  lastFailed: string;
}

interface SessionStats {
  totalPhrases: number;
  averageScore: number;
  totalWords: number;
  correctWords: number;
}

const STORAGE_KEY = 'english_pronunciation_difficult_words';

@Injectable({ providedIn: 'root' })
export class PronunciationMetricsService {
  private readonly _sessionScores = signal<number[]>([]);
  private readonly _sessionTotalWords = signal(0);
  private readonly _sessionCorrectWords = signal(0);
  private readonly _difficultWords = signal<DifficultWord[]>(this.loadFromStorage());

  readonly difficultWords = this._difficultWords.asReadonly();

  readonly sessionStats = computed<SessionStats>(() => {
    const scores = this._sessionScores();
    const totalPhrases = scores.length;
    const averageScore =
      totalPhrases > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / totalPhrases) : 0;
    return {
      totalPhrases,
      averageScore,
      totalWords: this._sessionTotalWords(),
      correctWords: this._sessionCorrectWords(),
    };
  });

  recordResult(expected: string, words: WordResult[]): void {
    const correct = words.filter((w) => w.correct).length;
    const total = words.length;
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;

    this._sessionScores.update((s) => [...s, score]);
    this._sessionTotalWords.update((w) => w + total);
    this._sessionCorrectWords.update((w) => w + correct);

    const failedWords = words.filter((w) => !w.correct);
    if (failedWords.length > 0) {
      const now = new Date().toISOString();
      const current = [...this._difficultWords()];

      for (const fw of failedWords) {
        const existing = current.find((d) => d.word.toLowerCase() === fw.word.toLowerCase());
        if (existing) {
          existing.failCount++;
          existing.lastFailed = now;
        } else {
          current.push({ word: fw.word.toLowerCase(), failCount: 1, lastFailed: now });
        }
      }

      this._difficultWords.set(current);
      this.saveToStorage(current);
    }
  }

  getMostFailedWords(): DifficultWord[] {
    return [...this._difficultWords()].sort((a, b) => b.failCount - a.failCount).slice(0, 20);
  }

  getSessionStats(): SessionStats {
    return this.sessionStats();
  }

  resetSession(): void {
    this._sessionScores.set([]);
    this._sessionTotalWords.set(0);
    this._sessionCorrectWords.set(0);
  }

  private loadFromStorage(): DifficultWord[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(words: DifficultWord[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(words));
    } catch {
      // Storage full or unavailable
    }
  }
}
