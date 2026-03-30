import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../core/services/environment';
import {
  AttemptRequest,
  AttemptResponse,
  CompletionResponse,
  PhonemeDetailResponse,
  PhonemeProgressItem,
  PhonemeResponse,
  PhraseResponse,
  TodayPhonemeResponse,
} from '../models/phonetics.model';

@Injectable({ providedIn: 'root' })
export class PhoneticsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}`;

  getPhonemes(): Observable<PhonemeResponse[]> {
    return this.http.get<PhonemeResponse[]>(`${this.baseUrl}/phonetics/phonemes`);
  }

  getPhonemeDetail(phonemeId: string): Observable<PhonemeDetailResponse> {
    return this.http.get<PhonemeDetailResponse>(`${this.baseUrl}/phonetics/phonemes/${phonemeId}`);
  }

  getPhrases(phonemeId: string): Observable<PhraseResponse[]> {
    return this.http.get<PhraseResponse[]>(
      `${this.baseUrl}/phonetics/phonemes/${phonemeId}/phrases`,
    );
  }

  getTodayPhoneme(profileId: string): Observable<TodayPhonemeResponse> {
    return this.http.get<TodayPhonemeResponse>(
      `${this.baseUrl}/profiles/${profileId}/phonetics/today`,
    );
  }

  getProgress(profileId: string): Observable<PhonemeProgressItem[]> {
    return this.http.get<PhonemeProgressItem[]>(
      `${this.baseUrl}/profiles/${profileId}/phonetics/progress`,
    );
  }

  submitAttempt(
    profileId: string,
    phonemeId: string,
    phraseId: string,
    request: AttemptRequest,
  ): Observable<AttemptResponse> {
    return this.http.post<AttemptResponse>(
      `${this.baseUrl}/profiles/${profileId}/phonetics/phonemes/${phonemeId}/phrases/${phraseId}/attempt`,
      request,
    );
  }

  completePhoneme(profileId: string, phonemeId: string): Observable<CompletionResponse> {
    return this.http.put<CompletionResponse>(
      `${this.baseUrl}/profiles/${profileId}/phonetics/phonemes/${phonemeId}/complete`,
      {},
    );
  }
}
