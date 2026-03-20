import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { GamificationService } from '../../services/gamification.service';
import { TtsService } from '../../../../features/speak/services/tts.service';

@Component({
  selector: 'app-phrase-roulette',
  templateUrl: './phrase-roulette.html',
  styleUrl: './phrase-roulette.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhraseRoulette {
  protected readonly gamification = inject(GamificationService);
  private readonly tts = inject(TtsService);

  protected readonly phrase = this.gamification.currentPhrase;
  protected readonly revealed = this.gamification.phraseRevealed;

  protected reveal(): void {
    this.gamification.revealPhrase();
  }

  protected newPhrase(): void {
    this.gamification.getRandomPhrase();
  }

  protected speakPhrase(): void {
    this.tts.speak(this.phrase().en);
  }
}
