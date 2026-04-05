import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';

@Component({
  selector: 'app-progress-ring',
  template: `
    <svg [attr.width]="size()" [attr.height]="size()" class="ring">
      <circle
        class="ring-bg"
        [attr.cx]="center()"
        [attr.cy]="center()"
        [attr.r]="radius()"
        [attr.stroke-width]="strokeWidth()"
        fill="none"
      />
      <circle
        class="ring-fill"
        [attr.cx]="center()"
        [attr.cy]="center()"
        [attr.r]="radius()"
        [attr.stroke-width]="strokeWidth()"
        [attr.stroke-dasharray]="circumference()"
        [attr.stroke-dashoffset]="offset()"
        [attr.stroke]="color()"
        fill="none"
        stroke-linecap="round"
      />
    </svg>
  `,
  styleUrl: './progress-ring.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressRing {
  readonly value = input(0);
  readonly size = input(64);
  readonly strokeWidth = input(6);
  readonly color = input('var(--primary)');

  protected readonly center = computed(() => this.size() / 2);
  protected readonly radius = computed(() => (this.size() - this.strokeWidth()) / 2);
  protected readonly circumference = computed(() => 2 * Math.PI * this.radius());
  protected readonly offset = computed(
    () => this.circumference() * (1 - Math.min(this.value(), 100) / 100),
  );
}
