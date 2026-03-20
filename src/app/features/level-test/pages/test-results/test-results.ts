import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { MODULE_NAMES, ModuleName } from '../../../../shared/models/learning.model';
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

  readonly finish = output<void>();

  protected label(mod: ModuleName): string {
    return getModuleLabel(mod);
  }
}
