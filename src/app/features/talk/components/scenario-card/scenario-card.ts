import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { Scenario } from '../../models/talk.model';

@Component({
  selector: 'app-scenario-card',
  imports: [UpperCasePipe],
  templateUrl: './scenario-card.html',
  styleUrl: './scenario-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScenarioCard {
  readonly scenario = input.required<Scenario>();
  readonly selected = output<Scenario>();

  protected onSelect(): void {
    this.selected.emit(this.scenario());
  }
}
