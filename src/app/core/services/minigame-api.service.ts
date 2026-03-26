import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';

export interface WordMatchPair {
  en: string;
  es: string;
  vocabEntryId?: string;
}

export interface WordMatchData {
  pairs: WordMatchPair[];
  level: string;
}

export interface FillGapQuestion {
  sentence: string;
  options: string[];
  correct: number;
}

export interface FillGapData {
  questions: FillGapQuestion[];
  level: string;
}

export interface UnscrambleData {
  words: { word: string; vocabEntryId?: string }[];
  level: string;
}

export interface AnsweredItem {
  vocabEntryId: string | null;
  word: string | null;
  level: string;
  correct: boolean;
}

export interface SaveGameResultsRequest {
  gameType: string;
  score: number;
  answeredItems: AnsweredItem[];
}

export interface SaveGameResultsResponse {
  score: number;
  xpEarned: number;
  wordsLearned: string[];
  wordsAddedToReview: number;
  totalWordsEncountered: number;
}

export interface UnlearnedVocabResponse {
  words: WordMatchPair[];
  remainingCount: number;
}

@Injectable({ providedIn: 'root' })
export class MinigameApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  getWordMatchData(level: string): Observable<WordMatchData> {
    return this.http.get<WordMatchData>(`${this.baseUrl}/minigames/word-match`, {
      params: { level },
    });
  }

  getFillGapData(level: string): Observable<FillGapData> {
    return this.http.get<FillGapData>(`${this.baseUrl}/minigames/fill-gap`, {
      params: { level },
    });
  }

  getUnscrambleData(level: string): Observable<UnscrambleData> {
    return this.http.get<UnscrambleData>(`${this.baseUrl}/minigames/unscramble`, {
      params: { level },
    });
  }

  getUnlearnedVocab(
    userId: string,
    level: string,
    count: number,
  ): Observable<UnlearnedVocabResponse> {
    return this.http.get<UnlearnedVocabResponse>(
      `${this.baseUrl}/profiles/${userId}/vocabulary/unlearned`,
      { params: { level, count: count.toString() } },
    );
  }

  saveGameResults(
    userId: string,
    request: SaveGameResultsRequest,
  ): Observable<SaveGameResultsResponse> {
    return this.http.post<SaveGameResultsResponse>(
      `${this.baseUrl}/profiles/${userId}/minigames/results`,
      request,
    );
  }
}
