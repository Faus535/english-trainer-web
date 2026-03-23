import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../core/services/environment';
import { ErrorPattern, ErrorSummary } from '../models/error-pattern.model';

@Injectable({ providedIn: 'root' })
export class ErrorPatternService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/error-patterns`;

  getErrorPatterns(profileId: string): Observable<ErrorPattern[]> {
    return this.http.get<ErrorPattern[]>(`${this.baseUrl}?profileId=${profileId}`);
  }

  getErrorSummary(profileId: string): Observable<ErrorSummary> {
    return this.http.get<ErrorSummary>(`${this.baseUrl}/summary?profileId=${profileId}`);
  }
}
