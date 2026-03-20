import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { LevelSelector } from './components/level-selector/level-selector';
import { PronunciationCheck } from './components/pronunciation-check/pronunciation-check';
import { PHRASE_BANK } from './data/phrase-bank.data';
import { Level, Phrase } from './models/speak.model';
import { SpeechRecognitionService } from './services/speech-recognition.service';
import { TtsService } from './services/tts.service';

@Component({
  selector: 'app-speak',
  imports: [LevelSelector, PronunciationCheck],
  templateUrl: './speak.html',
  styleUrl: './speak.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Speak {
  private readonly tts = inject(TtsService);
  private readonly recognition = inject(SpeechRecognitionService);

  protected readonly currentLevel = signal<Level>('a1');
  protected readonly history = signal<Phrase[]>([]);
  protected readonly historyIndex = signal(-1);
  protected readonly translationRevealed = signal(false);

  protected readonly supported = this.recognition.supported;

  protected readonly currentPhrase = computed(() => {
    const idx = this.historyIndex();
    const h = this.history();
    return idx >= 0 && idx < h.length ? h[idx] : null;
  });

  protected readonly phraseNumber = computed(() => this.historyIndex() + 1);

  protected readonly canGoPrev = computed(() => this.historyIndex() > 0);

  protected readonly phraseWords = computed(() => {
    const phrase = this.currentPhrase();
    return phrase ? phrase.en.split(/\s+/) : [];
  });

  constructor() {
    this.nextPhrase();
  }

  protected onLevelChange(level: Level): void {
    this.currentLevel.set(level);
    this.history.set([]);
    this.historyIndex.set(-1);
    this.nextPhrase();
  }

  protected nextPhrase(): void {
    const idx = this.historyIndex();
    const h = this.history();

    // Trim forward history if navigated back
    const trimmed = idx < h.length - 1 ? h.slice(0, idx + 1) : [...h];

    const phrases = PHRASE_BANK[this.currentLevel()];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];

    trimmed.push(phrase);
    this.history.set(trimmed);
    this.historyIndex.set(trimmed.length - 1);
    this.translationRevealed.set(false);
    this.recognition.reset();
  }

  protected prevPhrase(): void {
    if (this.canGoPrev()) {
      this.historyIndex.update(i => i - 1);
      this.translationRevealed.set(false);
      this.recognition.reset();
    }
  }

  protected revealTranslation(): void {
    this.translationRevealed.set(true);
  }

  protected listenPhrase(): void {
    const phrase = this.currentPhrase();
    if (phrase) {
      this.tts.speak(phrase.en);
    }
  }

  protected speakWord(word: string): void {
    this.tts.speak(word);
  }
}
