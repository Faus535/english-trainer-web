import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { PronunciationResult } from '../../models/speak.model';
import { SpeechRecognitionService } from '../../services/speech-recognition.service';
import { TtsService } from '../../services/tts.service';
import { getPronunciationFeedback } from '../../utils/pronunciation-feedback.util';

@Component({
  selector: 'app-pronunciation-check',
  templateUrl: './pronunciation-check.html',
  styleUrl: './pronunciation-check.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PronunciationCheck {
  private readonly recognition = inject(SpeechRecognitionService);
  private readonly tts = inject(TtsService);

  readonly phrase = input.required<string>();

  protected readonly state = this.recognition.state;
  protected readonly result = this.recognition.result;
  protected readonly supported = this.recognition.supported;

  protected readonly feedback = computed(() => {
    const r = this.result();
    if (!r || r.error) return null;
    return getPronunciationFeedback(r.score);
  });

  protected readonly failedWords = computed(() => {
    const r = this.result();
    if (!r || r.error) return [];
    return r.words.filter(w => !w.correct);
  });

  protected readonly errorMessage = computed(() => {
    const r = this.result();
    if (!r?.error) return null;
    switch (r.error) {
      case 'no-speech':
        return 'No se detecto voz. Intentalo de nuevo.';
      case 'not-allowed':
        return 'Permiso de microfono denegado. Activalo en ajustes del navegador.';
      default:
        return 'Error: ' + r.error;
    }
  });

  protected toggleRecording(): void {
    if (this.state() === 'recording') {
      this.recognition.reset();
    } else {
      this.recognition.startRecording(this.phrase());
    }
  }

  protected stopRecording(): void {
    this.recognition.stopRecording();
  }

  protected speakWord(word: string): void {
    this.tts.speak(word);
  }

  protected practiceWord(word: string): void {
    this.recognition.startRecording(word);
  }
}
