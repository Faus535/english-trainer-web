import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  template: `<div
    class="skeleton"
    [style.width]="width()"
    [style.height]="height()"
    [class.circle]="circle()"
    [class.card]="variant() === 'card'"
  ></div>`,
  styleUrl: './skeleton.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Skeleton {
  readonly width = input('100%');
  readonly height = input('1rem');
  readonly circle = input(false);
  readonly variant = input<'text' | 'card' | 'default'>('default');
}
