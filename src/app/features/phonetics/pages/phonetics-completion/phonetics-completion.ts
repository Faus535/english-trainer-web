import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArrowLeft } from 'lucide-angular';

import { Icon } from '../../../../shared/components/icon/icon';

@Component({
  selector: 'app-phonetics-completion',
  imports: [RouterLink, Icon],
  templateUrl: './phonetics-completion.html',
  styleUrl: './phonetics-completion.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneticsCompletion {
  protected readonly backIcon = ArrowLeft;
}
