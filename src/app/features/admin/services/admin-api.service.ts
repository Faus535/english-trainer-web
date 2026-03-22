import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../core/services/environment';

export interface AdminStats {
  totalUsers: number;
  activeUsersToday: number;
  activeUsersWeek: number;
  totalSessions: number;
  totalConversations: number;
  vocabCount: number;
  phrasesCount: number;
}
export interface AdminVocabEntry {
  id: string;
  en: string;
  ipa: string;
  es: string;
  type: string;
  example: string;
  level: string;
}
export interface AdminPhrase {
  id: string;
  en: string;
  es: string;
  level: string;
}
export interface AdminReadingText {
  id: string;
  title: string;
  content: string;
  level: string;
  topic: string;
  wordCount: number;
}
export interface AdminWritingExercise {
  id: string;
  prompt: string;
  level: string;
  category: string;
  minWords: number;
  maxWords: number;
}

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/admin`;

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.baseUrl}/stats`);
  }
  getVocab(): Observable<AdminVocabEntry[]> {
    return this.http.get<AdminVocabEntry[]>(`${this.baseUrl}/vocab`);
  }
  createVocab(e: Omit<AdminVocabEntry, 'id'>): Observable<AdminVocabEntry> {
    return this.http.post<AdminVocabEntry>(`${this.baseUrl}/vocab`, e);
  }
  updateVocab(id: string, e: Partial<AdminVocabEntry>): Observable<AdminVocabEntry> {
    return this.http.put<AdminVocabEntry>(`${this.baseUrl}/vocab/${id}`, e);
  }
  deleteVocab(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/vocab/${id}`);
  }
  getPhrases(): Observable<AdminPhrase[]> {
    return this.http.get<AdminPhrase[]>(`${this.baseUrl}/phrases`);
  }
  createPhrase(p: Omit<AdminPhrase, 'id'>): Observable<AdminPhrase> {
    return this.http.post<AdminPhrase>(`${this.baseUrl}/phrases`, p);
  }
  updatePhrase(id: string, p: Partial<AdminPhrase>): Observable<AdminPhrase> {
    return this.http.put<AdminPhrase>(`${this.baseUrl}/phrases/${id}`, p);
  }
  deletePhrase(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/phrases/${id}`);
  }
  getReadingTexts(): Observable<AdminReadingText[]> {
    return this.http.get<AdminReadingText[]>(`${this.baseUrl}/reading`);
  }
  createReadingText(t: Omit<AdminReadingText, 'id'>): Observable<AdminReadingText> {
    return this.http.post<AdminReadingText>(`${this.baseUrl}/reading`, t);
  }
  updateReadingText(id: string, t: Partial<AdminReadingText>): Observable<AdminReadingText> {
    return this.http.put<AdminReadingText>(`${this.baseUrl}/reading/${id}`, t);
  }
  deleteReadingText(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/reading/${id}`);
  }
  getWritingExercises(): Observable<AdminWritingExercise[]> {
    return this.http.get<AdminWritingExercise[]>(`${this.baseUrl}/writing`);
  }
  createWritingExercise(e: Omit<AdminWritingExercise, 'id'>): Observable<AdminWritingExercise> {
    return this.http.post<AdminWritingExercise>(`${this.baseUrl}/writing`, e);
  }
  updateWritingExercise(
    id: string,
    e: Partial<AdminWritingExercise>,
  ): Observable<AdminWritingExercise> {
    return this.http.put<AdminWritingExercise>(`${this.baseUrl}/writing/${id}`, e);
  }
  deleteWritingExercise(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/writing/${id}`);
  }
}
