import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LevelSelector } from './components/level-selector/level-selector';
import { PronunciationCheck } from './components/pronunciation-check/pronunciation-check';
import { VocabPopup } from '../../shared/components/vocab-popup/vocab-popup';
import { PHRASE_BANK } from './data/phrase-bank.data';
import { Level, Phrase, WordResult } from './models/speak.model';
import { SpeechRecognitionService } from './services/speech-recognition.service';
import { TtsService } from './services/tts.service';
import { VocabApiService } from '../../core/services/vocab-api.service';
import { PronunciationMetricsService } from './services/pronunciation-metrics.service';

@Component({
  selector: 'app-speak',
  imports: [LevelSelector, PronunciationCheck, RouterLink, VocabPopup],
  templateUrl: './speak.html',
  styleUrl: './speak.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Speak {
  private readonly tts = inject(TtsService);
  private readonly recognition = inject(SpeechRecognitionService);
  private readonly vocabApi = inject(VocabApiService);
  private readonly metrics = inject(PronunciationMetricsService);

  protected readonly currentLevel = signal<Level>('a1');
  protected readonly history = signal<Phrase[]>([]);
  protected readonly historyIndex = signal(-1);
  protected readonly translationRevealed = signal(false);

  private readonly _apiPhrases = signal<Record<Level, Phrase[]>>({} as Record<Level, Phrase[]>);

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

  // Difficult words drill mode
  protected readonly difficultWords = computed(() => this.metrics.getMostFailedWords());
  protected readonly hasDifficultWords = computed(() => this.difficultWords().length > 0);
  protected readonly drillMode = signal(false);
  protected readonly drillIndex = signal(0);
  protected readonly drillResult = signal<'idle' | 'correct' | 'incorrect'>('idle');

  protected readonly currentDrillWord = computed(() => {
    const words = this.difficultWords();
    const idx = this.drillIndex();
    return idx < words.length ? words[idx] : null;
  });

  protected readonly drillProgress = computed(() => {
    const total = this.difficultWords().length;
    return total > 0 ? `${this.drillIndex() + 1} de ${total}` : '';
  });

  // Vocab popup
  protected readonly selectedVocabWord = signal('');
  protected readonly showVocabPopup = signal(false);
  private lastTapWord = '';
  private lastTapTime = 0;

  constructor() {
    this.nextPhrase();
  }

  protected onLevelChange(level: Level): void {
    this.currentLevel.set(level);
    this.history.set([]);
    this.historyIndex.set(-1);
    this.loadPhrasesForLevel(level);
    this.nextPhrase();
  }

  protected nextPhrase(): void {
    const idx = this.historyIndex();
    const h = this.history();

    const trimmed = idx < h.length - 1 ? h.slice(0, idx + 1) : [...h];

    const level = this.currentLevel();
    const apiPhrases = this._apiPhrases()[level];
    const phrases = apiPhrases?.length ? apiPhrases : PHRASE_BANK[level];
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];

    trimmed.push(phrase);
    this.history.set(trimmed);
    this.historyIndex.set(trimmed.length - 1);
    this.translationRevealed.set(false);
    this.recognition.reset();
  }

  private loadPhrasesForLevel(level: Level): void {
    if (this._apiPhrases()[level]?.length) return;

    this.vocabApi.getPhrasesByLevel(level).subscribe({
      next: (phrases) => {
        if (phrases.length > 0) {
          this._apiPhrases.update((p) => ({
            ...p,
            [level]: phrases.map((ph) => ({ en: ph.en, es: ph.es })),
          }));
        }
      },
    });
  }

  protected prevPhrase(): void {
    if (this.canGoPrev()) {
      this.historyIndex.update((i) => i - 1);
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

  protected onWordTap(word: string): void {
    const now = Date.now();
    if (this.lastTapWord === word && now - this.lastTapTime < 400) {
      // Double-tap: show vocab popup
      const clean = word.replace(/[^a-zA-Z'-]/g, '');
      if (clean.length > 0) {
        this.selectedVocabWord.set(clean);
        this.showVocabPopup.set(true);
      }
      this.lastTapWord = '';
      this.lastTapTime = 0;
    } else {
      // Single tap: speak word
      this.tts.speak(word);
      this.lastTapWord = word;
      this.lastTapTime = now;
    }
  }

  protected closeVocabPopup(): void {
    this.showVocabPopup.set(false);
  }

  protected onAddToReview(_word: string): void {
    this.showVocabPopup.set(false);
  }

  protected speakWord(word: string): void {
    this.tts.speak(word);
  }

  protected onPronunciationResult(event: { expected: string; words: WordResult[] }): void {
    this.metrics.recordResult(event.expected, event.words);
  }

  // Drill mode methods
  protected startDrill(): void {
    this.drillMode.set(true);
    this.drillIndex.set(0);
    this.drillResult.set('idle');
    this.playDrillWord();
  }

  protected nextDrillWord(): void {
    const total = this.difficultWords().length;
    const next = this.drillIndex() + 1;
    if (next < total) {
      this.drillIndex.set(next);
      this.drillResult.set('idle');
      this.recognition.reset();
      this.playDrillWord();
    } else {
      this.exitDrill();
    }
  }

  protected exitDrill(): void {
    this.drillMode.set(false);
    this.drillIndex.set(0);
    this.drillResult.set('idle');
    this.recognition.reset();
  }

  protected playDrillWord(): void {
    const word = this.currentDrillWord();
    if (word) {
      this.tts.speak(word.word);
    }
  }

  protected recordDrillWord(): void {
    const word = this.currentDrillWord();
    if (word) {
      this.recognition.startRecording(word.word);
    }
  }
}
