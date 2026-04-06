import { Component, ChangeDetectionStrategy, input, output, inject } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { Scenario } from '../../models/talk.model';
import { TalkApiService } from '../../services/talk-api.service';

@Component({
  selector: 'app-scenario-card',
  imports: [UpperCasePipe],
  templateUrl: './scenario-card.html',
  styleUrl: './scenario-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScenarioCard {
  private readonly talkApi = inject(TalkApiService);

  readonly scenario = input.required<Scenario>();
  readonly selected = output<Scenario>();

  protected get icon(): string {
    return this.talkApi.categoryIcon(this.scenario().category);
  }

  protected onSelect(): void {
    this.selected.emit(this.scenario());
  }
}
