import { Injectable, inject, computed } from '@angular/core';
import { CEFR_LEVELS, ModuleName, MODULE_NAMES } from '../../../shared/models/learning.model';
import { StateService } from '../../../shared/services/state.service';

const MODULE_LABELS: Record<ModuleName, string> = {
  listening: 'Listening',
  vocabulary: 'Vocabulario',
  grammar: 'Gramatica',
  phrases: 'Frases',
  pronunciation: 'Pronunciacion',
};

@Injectable({ providedIn: 'root' })
export class WeaknessService {
  private readonly state = inject(StateService);

  getModuleWeakness(module: ModuleName): number {
    const levelIndex = CEFR_LEVELS.indexOf(this.state.getModuleLevel(module));
    const completion = this.state.getModuleCompletionPercent(module);
    return Math.max(0, 100 - (levelIndex * 20 + completion * 0.5));
  }

  getModuleWeights(): Record<ModuleName, number> {
    const weaknesses: Record<string, number> = {};
    let total = 0;

    for (const mod of MODULE_NAMES) {
      const w = this.getModuleWeakness(mod);
      weaknesses[mod] = w;
      total += w;
    }

    const weights: Record<string, number> = {};
    for (const mod of MODULE_NAMES) {
      weights[mod] = total > 0 ? weaknesses[mod] / total : 1 / MODULE_NAMES.length;
    }

    return weights as Record<ModuleName, number>;
  }

  readonly weaknessExplanation = computed<string[]>(() => {
    const entries = MODULE_NAMES.map((mod) => ({
      module: mod,
      weakness: this.getModuleWeakness(mod),
    }));

    entries.sort((a, b) => b.weakness - a.weakness);

    const hints: string[] = [];
    const top = entries.slice(0, 2);

    for (const entry of top) {
      if (entry.weakness > 60) {
        hints.push(`${MODULE_LABELS[entry.module]} es tu area mas debil`);
      } else if (entry.weakness > 30) {
        hints.push(`${MODULE_LABELS[entry.module]} necesita practica`);
      }
    }

    if (hints.length === 0) {
      hints.push('Todas las areas estan equilibradas');
    }

    return hints;
  });
}
