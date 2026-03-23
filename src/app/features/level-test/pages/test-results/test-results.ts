import { Component, ChangeDetectionStrategy, inject, output, computed } from '@angular/core';
import {
  MODULE_NAMES,
  CEFR_LEVELS,
  ModuleName,
  Level,
} from '../../../../shared/models/learning.model';
import { LevelTestService } from '../../services/level-test.service';
import { getModuleLabel } from '../../../dashboard/data/modules.data';

@Component({
  selector: 'app-test-results',
  templateUrl: './test-results.html',
  styleUrl: './test-results.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestResults {
  protected readonly testService = inject(LevelTestService);
  protected readonly modules = MODULE_NAMES;

  readonly testFinished = output<void>();

  protected readonly isRetake = computed(() => !!this.testService.results()?.previousLevels);

  protected label(mod: ModuleName): string {
    return getModuleLabel(mod);
  }

  protected levelDiff(mod: ModuleName): 'up' | 'down' | 'same' | null {
    const results = this.testService.results();
    if (!results?.previousLevels) return null;

    const prev = results.previousLevels[mod] || 'a1';
    const curr = results.levels[mod] || 'a1';
    const prevIdx = CEFR_LEVELS.indexOf(prev as Level);
    const currIdx = CEFR_LEVELS.indexOf(curr as Level);

    if (currIdx > prevIdx) return 'up';
    if (currIdx < prevIdx) return 'down';
    return 'same';
  }

  protected previousLevel(mod: ModuleName): string {
    const results = this.testService.results();
    return (results?.previousLevels?.[mod] || 'a1').toUpperCase();
  }
}
