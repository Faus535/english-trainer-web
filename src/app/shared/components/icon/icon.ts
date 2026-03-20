import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { LucideAngularModule, LucideIconData } from 'lucide-angular';

@Component({
  selector: 'app-icon',
  imports: [LucideAngularModule],
  template: `<lucide-icon [img]="name()" [size]="size()" [strokeWidth]="strokeWidth()" />`,
  styles: `:host { display: inline-flex; align-items: center; justify-content: center; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Icon {
  readonly name = input.required<LucideIconData>();
  readonly size = input<number>(20);
  readonly strokeWidth = input<number>(1.75);
}
