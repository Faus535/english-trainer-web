import { Component, ChangeDetectionStrategy, inject, input } from '@angular/core';
import { TtsService } from '../../../../shared/services/tts.service';
import { Icon } from '../../../../shared/components/icon/icon';
import { Lightbulb, Play } from 'lucide-angular';
import { PronunciationAnalyzeResponse } from '../../models/pronunciation.model';

@Component({
  selector: 'app-analysis-panel',
  imports: [Icon],
  templateUrl: './analysis-panel.html',
  styleUrl: './analysis-panel.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalysisPanel {
  private readonly tts = inject(TtsService);

  readonly result = input.required<PronunciationAnalyzeResponse>();

  protected readonly lightbulbIcon = Lightbulb;
  protected readonly playIcon = Play;

  protected playText(text: string): void {
    this.tts.speak(text);
  }
}
