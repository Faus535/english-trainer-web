import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { GamificationService } from '../../services/gamification.service';
import { TtsService } from '../../../../features/speak/services/tts.service';

@Component({
  selector: 'app-sound-of-day',
  templateUrl: './sound-of-day.html',
  styleUrl: './sound-of-day.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SoundOfDay {
  private readonly gamification = inject(GamificationService);
  private readonly tts = inject(TtsService);

  protected readonly sound = this.gamification.getSoundOfTheDay();

  protected speakWord(word: string): void {
    this.tts.speak(word);
  }
}
