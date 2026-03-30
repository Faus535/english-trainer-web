import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import {
  PhonemeDisplayCategory,
  PhonemeResponse,
  getDisplayCategory,
} from '../../models/phonetics.model';
import { PhonemeCard } from '../phoneme-card/phoneme-card';

interface PhonemeGroup {
  category: PhonemeDisplayCategory;
  label: string;
  phonemes: PhonemeResponse[];
}

const CATEGORY_LABELS: Record<PhonemeDisplayCategory, string> = {
  VOWELS: 'Vocales',
  DIPHTHONGS: 'Diptongos',
  CONSONANTS: 'Consonantes',
};

const CATEGORY_ORDER: PhonemeDisplayCategory[] = ['VOWELS', 'DIPHTHONGS', 'CONSONANTS'];

@Component({
  selector: 'app-phoneme-grid',
  imports: [PhonemeCard],
  templateUrl: './phoneme-grid.html',
  styleUrl: './phoneme-grid.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhonemeGrid {
  readonly phonemes = input.required<PhonemeResponse[]>();
  readonly filter = input<PhonemeDisplayCategory | 'ALL'>('ALL');

  protected readonly filteredGroups = computed<PhonemeGroup[]>(() => {
    const all = this.phonemes();
    const f = this.filter();

    const grouped = new Map<PhonemeDisplayCategory, PhonemeResponse[]>();
    for (const p of all) {
      const cat = getDisplayCategory(p);
      if (f !== 'ALL' && cat !== f) continue;
      const list = grouped.get(cat) ?? [];
      list.push(p);
      grouped.set(cat, list);
    }

    return CATEGORY_ORDER.filter((cat) => grouped.has(cat)).map((cat) => ({
      category: cat,
      label: CATEGORY_LABELS[cat],
      phonemes: grouped.get(cat)!,
    }));
  });
}
