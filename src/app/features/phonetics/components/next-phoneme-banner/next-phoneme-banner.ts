import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PhonemeProgressItem } from '../../models/phonetics.model';

@Component({
  selector: 'app-next-phoneme-banner',
  imports: [RouterLink],
  templateUrl: './next-phoneme-banner.html',
  styleUrl: './next-phoneme-banner.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NextPhonemeBanner {
  readonly phoneme = input.required<PhonemeProgressItem>();
  readonly position = input.required<number>();
  readonly total = input.required<number>();
}
