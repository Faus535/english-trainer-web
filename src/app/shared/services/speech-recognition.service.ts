import { Injectable, inject, signal, NgZone } from '@angular/core';
import { WordConfidence } from '../../features/pronunciation/models/pronunciation.model';

@Injectable({ providedIn: 'root' })
export class SpeechRecognitionService {
  private readonly zone = inject(NgZone);
  private readonly API =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition || null;

  readonly supported = signal(this.API !== null);
  readonly state = signal<'idle' | 'recording' | 'error'>('idle');
  readonly transcript = signal<string>('');
  readonly wordConfidences = signal<WordConfidence[]>([]);

  private recognition: any = null;
  private timeoutId: any = null;

  startRecording(): void {
    if (!this.API) return;

    this.transcript.set('');
    this.wordConfidences.set([]);
    this.recognition = new this.API();
    this.recognition.lang = 'en-US';
    this.recognition.continuous = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.zone.run(() => this.state.set('recording'));
    };

    this.recognition.onresult = (event: any) => {
      const result = event.results[0];
      const text = result[0].transcript.trim();
      const words = text.split(/\s+/);
      const uniformConfidence = result[0].confidence ?? 0.8;
      const confidences: WordConfidence[] = words.map((word: string) => ({
        word,
        confidence: uniformConfidence,
      }));

      this.zone.run(() => {
        this.transcript.set(text);
        this.wordConfidences.set(confidences);
      });
    };

    this.recognition.onerror = () => {
      this.zone.run(() => {
        this.state.set('error');
        this.clearTimeout();
      });
    };

    this.recognition.onend = () => {
      this.zone.run(() => {
        this.state.set('idle');
        this.clearTimeout();
      });
    };

    this.recognition.start();

    this.timeoutId = setTimeout(() => this.stopRecording(), 30000);
  }

  stopRecording(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
    this.clearTimeout();
  }

  private clearTimeout(): void {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
