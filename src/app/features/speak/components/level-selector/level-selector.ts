import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Level } from '../../models/speak.model';

@Component({
  selector: 'app-level-selector',
  templateUrl: './level-selector.html',
  styleUrl: './level-selector.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelSelector {
  readonly level = input.required<Level>();
  readonly levelChange = output<Level>();

  protected readonly levels: Level[] = ['a1', 'a2', 'b1', 'b2', 'c1'];

  protected selectLevel(newLevel: Level): void {
    this.levelChange.emit(newLevel);
  }
}
