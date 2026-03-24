import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from './environment';
import { VocabEntryResponse, PhraseResponse } from '../../shared/models/api.model';

@Injectable({ providedIn: 'root' })
export class VocabApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}`;

  getAllVocab(): Observable<VocabEntryResponse[]> {
    return this.http.get<VocabEntryResponse[]>(`${this.baseUrl}/vocab`);
  }

  getVocabByLevel(level: string): Observable<VocabEntryResponse[]> {
    return this.http.get<VocabEntryResponse[]>(`${this.baseUrl}/vocab/level/${level}`);
  }

  getRandomVocab(): Observable<VocabEntryResponse> {
    return this.http.get<VocabEntryResponse>(`${this.baseUrl}/vocab/random`);
  }

  getVocabByLevelAndBlock(level: string, block: number): Observable<VocabEntryResponse[]> {
    return this.http.get<VocabEntryResponse[]>(`${this.baseUrl}/vocab/level/${level}`, {
      params: { block: block.toString() },
    });
  }

  searchVocab(query: string): Observable<VocabEntryResponse[]> {
    return this.http.get<VocabEntryResponse[]>(`${this.baseUrl}/vocab/search`, {
      params: { q: query },
    });
  }

  getPhrasesByLevel(level: string): Observable<PhraseResponse[]> {
    return this.http.get<PhraseResponse[]>(`${this.baseUrl}/phrases`, {
      params: { level },
    });
  }

  getRandomPhrases(level: string, count: number): Observable<PhraseResponse[]> {
    return this.http.get<PhraseResponse[]>(`${this.baseUrl}/phrases/random`, {
      params: { level, count: count.toString() },
    });
  }
}
