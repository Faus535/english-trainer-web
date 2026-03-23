import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../core/services/environment';
import { ConversationExercises, ExerciseAnswer, ExerciseResult } from '../models/exercise.model';

@Injectable({ providedIn: 'root' })
export class ExerciseApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/conversations`;

  getConversationExercises(conversationId: string): Observable<ConversationExercises> {
    return this.http.get<ConversationExercises>(`${this.baseUrl}/${conversationId}/exercises`);
  }

  submitAnswers(conversationId: string, answers: ExerciseAnswer[]): Observable<ExerciseResult> {
    return this.http.post<ExerciseResult>(`${this.baseUrl}/${conversationId}/exercises/submit`, {
      answers,
    });
  }
}
