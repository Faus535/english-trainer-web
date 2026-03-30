import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PhonemeResponse } from '../../models/phonetics.model';

@Component({
  selector: 'app-phoneme-card',
  imports: [RouterLink],
  templateUrl: './phoneme-card.html',
  styleUrl: './phoneme-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhonemeCard {
  readonly phoneme = input.required<PhonemeResponse>();
  readonly completed = input<boolean>(false);
}
