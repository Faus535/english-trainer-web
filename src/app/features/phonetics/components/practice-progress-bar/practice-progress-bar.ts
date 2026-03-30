import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-practice-progress-bar',
  templateUrl: './practice-progress-bar.html',
  styleUrl: './practice-progress-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PracticeProgressBar {
  readonly current = input.required<number>();
  readonly total = input.required<number>();
  readonly results = input.required<Map<number, boolean>>();

  protected readonly segments = computed(() => Array.from({ length: this.total() }, (_, i) => i));
}
