import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { Icon } from '../../../../shared/components/icon/icon';
import { Mic, MicOff } from 'lucide-angular';

@Component({
  selector: 'app-record-button',
  imports: [Icon],
  templateUrl: './record-button.html',
  styleUrl: './record-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.recording]': 'recording()',
  },
})
export class RecordButton {
  readonly recording = input<boolean>(false);
  readonly recordingToggled = output<void>();

  protected readonly micIcon = Mic;
  protected readonly micOffIcon = MicOff;

  protected onToggle(): void {
    this.recordingToggled.emit();
  }
}
