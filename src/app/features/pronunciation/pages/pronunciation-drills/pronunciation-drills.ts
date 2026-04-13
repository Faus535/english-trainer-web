import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PronunciationStateService } from '../../services/pronunciation-state.service';
import { DrillFilterBar } from '../../components/drill-filter-bar/drill-filter-bar';
import { DrillCard } from '../../components/drill-card/drill-card';

@Component({
  selector: 'app-pronunciation-drills',
  imports: [RouterLink, RouterLinkActive, DrillFilterBar, DrillCard],
  templateUrl: './pronunciation-drills.html',
  styleUrl: './pronunciation-drills.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class PronunciationDrills implements OnInit {
  protected readonly state = inject(PronunciationStateService);

  ngOnInit(): void {
    this.state.loadDrills(this.state.drillLevel(), this.state.drillFocus() ?? undefined);
  }

  protected onFilterChange(filter: { level: string; focus: string | null }): void {
    this.state.loadDrills(filter.level, filter.focus ?? undefined);
  }

  protected onAttempt(event: { recognizedText: string; confidence: number }): void {
    this.state.submitDrillAttempt(event.recognizedText, event.confidence);
  }

  protected onTryAgain(): void {
    this.state.loadDrills(this.state.drillLevel(), this.state.drillFocus() ?? undefined);
  }
}
