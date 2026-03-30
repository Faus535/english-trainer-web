import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArrowLeft } from 'lucide-angular';

import { AuthService } from '../../../../core/services/auth.service';
import { Icon } from '../../../../shared/components/icon/icon';
import { PhonemeDisplayCategory, PhonemeResponse } from '../../models/phonetics.model';
import { PhoneticsApiService } from '../../services/phonetics-api.service';
import { PhonemeGrid } from '../../components/phoneme-grid/phoneme-grid';
import { TodayPhonemeBanner } from '../../components/today-phoneme-banner/today-phoneme-banner';

@Component({
  selector: 'app-phonetics-hub',
  imports: [RouterLink, Icon, PhonemeGrid, TodayPhonemeBanner],
  templateUrl: './phonetics-hub.html',
  styleUrl: './phonetics-hub.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneticsHub {
  private readonly api = inject(PhoneticsApiService);
  private readonly auth = inject(AuthService);

  protected readonly phonemes = signal<PhonemeResponse[]>([]);
  protected readonly loading = signal(true);
  protected readonly filter = signal<PhonemeDisplayCategory | 'ALL'>('ALL');
  protected readonly completedCount = signal(0);
  protected readonly backIcon = ArrowLeft;

  constructor() {
    this.api.getPhonemes().subscribe({
      next: (phonemes) => {
        this.phonemes.set(phonemes);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected setFilter(f: PhonemeDisplayCategory | 'ALL'): void {
    this.filter.set(f);
  }
}
