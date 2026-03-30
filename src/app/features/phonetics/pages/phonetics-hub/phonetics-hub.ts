import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ArrowLeft } from 'lucide-angular';

import { AuthService } from '../../../../core/services/auth.service';
import { Icon } from '../../../../shared/components/icon/icon';
import { PhonemeProgressItem, PhonemeResponse } from '../../models/phonetics.model';
import { PhoneticsApiService } from '../../services/phonetics-api.service';
import { PhonemeGrid } from '../../components/phoneme-grid/phoneme-grid';
import { PhoneticsProgressBar } from '../../components/phonetics-progress-bar/phonetics-progress-bar';
import { NextPhonemeBanner } from '../../components/next-phoneme-banner/next-phoneme-banner';

@Component({
  selector: 'app-phonetics-hub',
  imports: [RouterLink, Icon, PhonemeGrid, PhoneticsProgressBar, NextPhonemeBanner],
  templateUrl: './phonetics-hub.html',
  styleUrl: './phonetics-hub.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneticsHub {
  private readonly api = inject(PhoneticsApiService);
  private readonly auth = inject(AuthService);

  protected readonly phonemes = signal<PhonemeResponse[]>([]);
  protected readonly progress = signal<PhonemeProgressItem[]>([]);
  protected readonly loading = signal(true);
  protected readonly backIcon = ArrowLeft;

  protected readonly completedIds = computed(() => {
    const set = new Set<string>();
    for (const p of this.progress()) {
      if (p.completed) set.add(p.phonemeId);
    }
    return set;
  });

  protected readonly completedCount = computed(() => this.completedIds().size);

  protected readonly nextPhoneme = computed<PhonemeProgressItem | null>(() => {
    const items = this.progress();
    return items.find((p) => !p.completed) ?? null;
  });

  protected readonly nextPhonemePosition = computed(() => {
    const items = this.progress();
    const next = this.nextPhoneme();
    if (!next) return 0;
    return items.findIndex((p) => p.phonemeId === next.phonemeId) + 1;
  });

  protected readonly allCompleted = computed(
    () => this.progress().length > 0 && this.completedCount() === this.progress().length,
  );

  constructor() {
    const profileId = this.auth.profileId();
    if (!profileId) {
      this.loadPhonemesOnly();
      return;
    }

    forkJoin([this.api.getPhonemes(), this.api.getProgress(profileId)]).subscribe({
      next: ([phonemes, progress]) => {
        this.phonemes.set(phonemes);
        this.progress.set(progress);
        this.loading.set(false);
      },
      error: () => this.loadPhonemesOnly(),
    });
  }

  private loadPhonemesOnly(): void {
    this.api.getPhonemes().subscribe({
      next: (phonemes) => {
        this.phonemes.set(phonemes);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
