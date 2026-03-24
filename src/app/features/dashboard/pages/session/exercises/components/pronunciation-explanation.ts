import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { ExtendedPronunciationContent } from '../data/pronunciation-extended.data';

@Component({
  selector: 'app-pronunciation-explanation',
  templateUrl: './pronunciation-explanation.html',
  styleUrl: '../exercises.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PronunciationExplanation {
  readonly content = input.required<ExtendedPronunciationContent>();
  readonly completed = output<void>();
}
