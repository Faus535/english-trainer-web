import {
  Component,
  ChangeDetectionStrategy,
  inject,
  input,
  output,
  signal,
  effect,
} from '@angular/core';
import { TtsService } from '../../../../shared/services/tts.service';
import { SpeechRecognitionService } from '../../../../shared/services/speech-recognition.service';
import { ProgressRing } from '../../../../shared/components/progress-ring/progress-ring';
import { RecordButton } from '../record-button/record-button';
import { Icon } from '../../../../shared/components/icon/icon';
import { Play } from 'lucide-angular';
import { DrillItem, DrillSubmitResponse } from '../../models/pronunciation.model';

@Component({
  selector: 'app-drill-card',
  imports: [ProgressRing, RecordButton, Icon],
  templateUrl: './drill-card.html',
  styleUrl: './drill-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrillCard {
  private readonly tts = inject(TtsService);
  protected readonly speechRec = inject(SpeechRecognitionService);

  readonly drill = input.required<DrillItem>();
  readonly scoreResult = input<DrillSubmitResponse | null>(null);
  readonly attempted = output<{ recognizedText: string; confidence: number }>();

  protected readonly playIcon = Play;
  protected readonly displayScore = signal(0);

  constructor() {
    effect(() => {
      const result = this.scoreResult();
      if (result) {
        this.animateScore(result.score);
      }
    });

    effect(() => {
      const state = this.speechRec.state();
      const transcript = this.speechRec.transcript();
      if (state === 'idle' && transcript) {
        const confidence = this.speechRec.wordConfidences()[0]?.confidence ?? 0.8;
        this.attempted.emit({ recognizedText: transcript, confidence });
      }
    });
  }

  protected onPlay(): void {
    this.tts.speak(this.drill().phrase);
  }

  protected onRecordToggle(): void {
    if (this.speechRec.state() === 'recording') {
      this.speechRec.stopRecording();
    } else {
      this.speechRec.startRecording();
    }
  }

  private animateScore(target: number): void {
    this.displayScore.set(0);
    const steps = 30;
    const interval = 600 / steps;
    let current = 0;
    const timer = setInterval(() => {
      current++;
      this.displayScore.set(Math.round((target * current) / steps));
      if (current >= steps) clearInterval(timer);
    }, interval);
  }
}
