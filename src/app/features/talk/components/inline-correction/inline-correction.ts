import { Component, ChangeDetectionStrategy, input } from '@angular/core';

@Component({
  selector: 'app-inline-correction',
  templateUrl: './inline-correction.html',
  styleUrl: './inline-correction.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InlineCorrection {
  readonly correction = input.required<string>();
}
