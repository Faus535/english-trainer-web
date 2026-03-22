import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { Icon } from '../../../../shared/components/icon/icon';
import { LucideIconData, Mic, Loader, Volume2 } from 'lucide-angular';
import { ConversationStatus } from '../../models/tutor.model';

@Component({
  selector: 'app-voice-input',
  imports: [Icon],
  templateUrl: './voice-input.html',
  styleUrl: './voice-input.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VoiceInput {
  readonly status = input.required<ConversationStatus>();
  readonly supported = input(true);
  readonly toggleRecord = output<void>();

  private readonly micIcon: LucideIconData = Mic;
  private readonly loadingIcon: LucideIconData = Loader;
  private readonly speakingIcon: LucideIconData = Volume2;

  protected readonly icon = computed<LucideIconData>(() => {
    switch (this.status()) {
      case 'recording':
        return this.micIcon;
      case 'sending':
        return this.loadingIcon;
      case 'speaking':
        return this.speakingIcon;
      default:
        return this.micIcon;
    }
  });

  protected readonly label = computed<string>(() => {
    switch (this.status()) {
      case 'recording':
        return 'Grabando... toca para parar';
      case 'sending':
        return 'Enviando...';
      case 'speaking':
        return 'El tutor esta hablando...';
      case 'error':
        return 'Toca para reintentar';
      default:
        return 'Toca para hablar';
    }
  });

  protected readonly disabled = computed(
    () => this.status() === 'sending' || this.status() === 'speaking',
  );

  protected onTap(): void {
    if (!this.disabled()) {
      this.toggleRecord.emit();
    }
  }
}
