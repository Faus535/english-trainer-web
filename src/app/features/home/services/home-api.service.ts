import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../core/services/environment';
import { HomeResponse } from '../models/home.model';

@Injectable({ providedIn: 'root' })
export class HomeApiService {
  private readonly http = inject(HttpClient);

  getHome(): Observable<HomeResponse> {
    return this.http.get<HomeResponse>(`${environment.apiUrl}/home`);
  }
}
