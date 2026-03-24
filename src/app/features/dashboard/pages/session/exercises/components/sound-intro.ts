import { Component, ChangeDetectionStrategy, inject, input, output } from '@angular/core';
import { TtsService } from '../../../../../speak/services/tts.service';
import { SoundLesson } from '../data/phonetic-content.data';

@Component({
  selector: 'app-sound-intro',
  imports: [],
  templateUrl: './sound-intro.html',
  styleUrl: '../exercises.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoundIntro {
  private readonly tts = inject(TtsService);

  readonly lesson = input.required<SoundLesson>();
  readonly completed = output<void>();

  protected speak(word: string): void {
    this.tts.setRate(0.85);
    this.tts.speak(word, () => this.tts.setRate(1));
  }

  protected onContinue(): void {
    this.completed.emit();
  }
}
