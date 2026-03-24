import { Component, ChangeDetectionStrategy, inject, input, output } from '@angular/core';
import { TtsService } from '../../../../../speak/services/tts.service';
import { MinimalPair } from '../data/pronunciation-extended.data';

@Component({
  selector: 'app-pronunciation-demonstration',
  templateUrl: './pronunciation-demonstration.html',
  styleUrl: '../exercises.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      .minimal-pair-row {
        display: flex;
        align-items: center;
        gap: var(--sp-2);
      }

      .minimal-pair-row .example-card {
        flex: 1;
      }

      .pair-vs {
        font-size: var(--fs-sm);
        font-weight: 700;
        color: var(--text-3);
        flex-shrink: 0;
      }

      .pair-note {
        margin-top: calc(-1 * var(--sp-1));
        padding-left: var(--sp-2);
      }
    `,
  ],
})
export class PronunciationDemonstration {
  private readonly tts = inject(TtsService);

  readonly pairs = input.required<MinimalPair[]>();
  readonly completed = output<void>();

  protected speak(text: string): void {
    this.tts.setRate(0.85);
    this.tts.speak(text, () => this.tts.setRate(1));
  }
}
