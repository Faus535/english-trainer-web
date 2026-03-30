import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-phonetics-progress-bar',
  templateUrl: './phonetics-progress-bar.html',
  styleUrl: './phonetics-progress-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneticsProgressBar {
  readonly completed = input.required<number>();
  readonly total = input.required<number>();

  protected readonly percentage = computed(() =>
    this.total() > 0 ? Math.round((this.completed() / this.total()) * 100) : 0,
  );
}
