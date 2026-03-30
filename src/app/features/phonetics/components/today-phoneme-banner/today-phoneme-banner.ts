import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { TodayPhonemeResponse } from '../../models/phonetics.model';
import { PhoneticsApiService } from '../../services/phonetics-api.service';

@Component({
  selector: 'app-today-phoneme-banner',
  imports: [RouterLink],
  templateUrl: './today-phoneme-banner.html',
  styleUrl: './today-phoneme-banner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodayPhonemeBanner {
  private readonly api = inject(PhoneticsApiService);
  private readonly auth = inject(AuthService);

  protected readonly todayPhoneme = signal<TodayPhonemeResponse | null>(null);

  constructor() {
    const profileId = this.auth.profileId();
    if (!profileId) return;

    this.api.getTodayPhoneme(profileId).subscribe({
      next: (res) => this.todayPhoneme.set(res),
      error: () => this.todayPhoneme.set(null),
    });
  }
}
