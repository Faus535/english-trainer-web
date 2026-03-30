import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

export interface PhraseResult {
  phrase: string;
  passed: boolean;
  score: number;
}

@Component({
  selector: 'app-practice-completion',
  templateUrl: './practice-completion.html',
  styleUrl: './practice-completion.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PracticeCompletion {
  readonly phonemeName = input.required<string>();
  readonly phonemeSymbol = input.required<string>();
  readonly totalPhrases = input.required<number>();
  readonly passedCount = input.required<number>();
  readonly results = input.required<PhraseResult[]>();

  readonly retry = output<void>();
  readonly goBack = output<void>();
}
