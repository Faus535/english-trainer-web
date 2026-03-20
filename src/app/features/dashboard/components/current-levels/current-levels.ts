import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { MODULE_NAMES, ModuleName } from '../../../../shared/models/learning.model';
import { StateService } from '../../../../shared/services/state.service';
import { getModuleLabel } from '../../data/modules.data';

@Component({
  selector: 'app-current-levels',
  templateUrl: './current-levels.html',
  styleUrl: './current-levels.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentLevels {
  private readonly state = inject(StateService);

  protected readonly modules = MODULE_NAMES;

  protected level(mod: ModuleName): string {
    return this.state.getModuleLevel(mod).toUpperCase();
  }

  protected label(mod: ModuleName): string {
    return getModuleLabel(mod);
  }
}
