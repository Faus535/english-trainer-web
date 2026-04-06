import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TtsService {
  private readonly _speaking = signal(false);
  private readonly _rate = signal(0.8);
  private readonly _supported: boolean;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private englishVoices: SpeechSynthesisVoice[] = [];
  private iosResumeIntervals: number[] = [];

  readonly speaking = this._speaking.asReadonly();
  readonly rate = this._rate.asReadonly();

  constructor() {
    this._supported = typeof speechSynthesis !== 'undefined';
    if (!this._supported) return;
    this.loadVoices();
    speechSynthesis.onvoiceschanged = () => this.loadVoices();
  }

  setRate(rate: number): void {
    this._rate.set(Math.max(0.3, Math.min(1.5, rate)));
  }

  speak(text: string, onEnd?: () => void): void {
    const clean = this.cleanForSpeech(text);
    if (!clean || !this._supported) {
      onEnd?.();
      return;
    }

    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(clean);
    utterance.rate = this._rate();
    utterance.pitch = 1;
    utterance.lang = 'en-US';
    if (this.selectedVoice) utterance.voice = this.selectedVoice;

    this._speaking.set(true);

    utterance.onend = () => {
      this._speaking.set(false);
      onEnd?.();
    };

    utterance.onerror = () => {
      this._speaking.set(false);
      onEnd?.();
    };

    // iOS Safari bug: speech pauses after ~15s
    const intervalId = window.setInterval(() => {
      if (!speechSynthesis.speaking) {
        clearInterval(intervalId);
        this.iosResumeIntervals = this.iosResumeIntervals.filter((id) => id !== intervalId);
      } else {
        speechSynthesis.resume();
      }
    }, 10000);
    this.iosResumeIntervals.push(intervalId);

    speechSynthesis.speak(utterance);
  }

  stop(): void {
    if (this._supported) {
      speechSynthesis.cancel();
    }
    this._speaking.set(false);
    this.iosResumeIntervals.forEach((id) => clearInterval(id));
    this.iosResumeIntervals = [];
  }

  getVoices(): SpeechSynthesisVoice[] {
    return this.englishVoices;
  }

  selectVoice(voice: SpeechSynthesisVoice): void {
    this.selectedVoice = voice;
  }

  private loadVoices(): void {
    if (!this._supported) return;
    const voices = speechSynthesis.getVoices();
    this.englishVoices = voices.filter((v) => v.lang.startsWith('en'));

    if (this.englishVoices.length > 0 && !this.selectedVoice) {
      const sorted = [...this.englishVoices].sort((a, b) => {
        const score = (name: string) =>
          name.toLowerCase().includes('natural') || name.toLowerCase().includes('premium') ? 0 : 1;
        return score(a.name) - score(b.name);
      });
      this.selectedVoice = sorted[0];
    }
  }

  private cleanForSpeech(text: string): string {
    return text
      .replace(/\/[^/]+\//g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/`[^`]*`/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
