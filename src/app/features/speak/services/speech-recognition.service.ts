import { Injectable, NgZone, inject, signal } from '@angular/core';

import { PronunciationResult, RecognitionState } from '../models/speak.model';
import { compareTexts } from '../utils/pronunciation-feedback.util';

// Web Speech Recognition API types (not in all TS libs)
interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEventInit extends EventInit {
  results: SpeechRecognitionResultList;
}

interface WebSpeechRecognitionEvent extends Event {
  readonly results: SpeechRecognitionResultList;
}

interface WebSpeechRecognitionErrorEvent extends Event {
  readonly error: string;
}

interface WebSpeechRecognition extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((event: WebSpeechRecognitionEvent) => void) | null;
  onerror: ((event: WebSpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

type WebSpeechRecognitionConstructor = new () => WebSpeechRecognition;

function getSpeechRecognitionAPI(): WebSpeechRecognitionConstructor | null {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}

@Injectable({ providedIn: 'root' })
export class SpeechRecognitionService {
  private readonly zone = inject(NgZone);

  private readonly SpeechRecognitionAPI = getSpeechRecognitionAPI();

  private readonly _supported = signal(!!this.SpeechRecognitionAPI);
  private readonly _state = signal<RecognitionState>('idle');
  private readonly _result = signal<PronunciationResult | null>(null);

  private recognitionInstance: WebSpeechRecognition | null = null;
  private timeoutId: number | null = null;

  readonly supported = this._supported.asReadonly();
  readonly state = this._state.asReadonly();
  readonly result = this._result.asReadonly();

  startRecording(expected: string): void {
    if (!this.SpeechRecognitionAPI) return;

    if (this._state() === 'recording') {
      this.stopRecording();
      return;
    }

    this._result.set(null);
    this._state.set('recording');

    this.recognitionInstance = new this.SpeechRecognitionAPI();
    this.recognitionInstance.lang = 'en-US';
    this.recognitionInstance.interimResults = true;
    this.recognitionInstance.maxAlternatives = 1;
    this.recognitionInstance.continuous = true;

    let lastTranscript = '';
    let lastConfidence = 0;

    this.recognitionInstance.onresult = (event: WebSpeechRecognitionEvent) => {
      let transcript = '';
      let confidence = 0;
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          confidence = Math.max(confidence, event.results[i][0].confidence);
        }
      }
      lastTranscript = transcript;
      lastConfidence = confidence || event.results[0][0].confidence;
    };

    this.recognitionInstance.onerror = (event: WebSpeechRecognitionErrorEvent) => {
      this.clearTimeout();
      if (event.error === 'aborted') {
        this.zone.run(() => this._state.set('idle'));
        return;
      }
      this.zone.run(() => {
        this._state.set('idle');
        this._result.set({
          transcript: '',
          confidence: 0,
          expected,
          score: 0,
          words: [],
          error: event.error,
        });
      });
    };

    this.recognitionInstance.onend = () => {
      this.clearTimeout();
      this.zone.run(() => {
        if (this._state() === 'recording' || this._state() === 'processing') {
          if (lastTranscript) {
            const comparison = compareTexts(expected, lastTranscript);
            this._result.set({
              transcript: lastTranscript,
              confidence: lastConfidence,
              expected,
              score: comparison.score,
              words: comparison.words,
            });
            this._state.set('result');
          } else {
            this._result.set({
              transcript: '',
              confidence: 0,
              expected,
              score: 0,
              words: [],
              error: 'no-speech',
            });
            this._state.set('idle');
          }
        }
      });
    };

    this.recognitionInstance.start();

    // Auto-stop after 15 seconds
    this.timeoutId = window.setTimeout(() => {
      this.stopRecording();
    }, 15000);
  }

  stopRecording(): void {
    this.clearTimeout();
    if (this.recognitionInstance) {
      this._state.set('processing');
      try {
        this.recognitionInstance.stop();
      } catch {
        // ignore
      }
      this.recognitionInstance = null;
    }
  }

  reset(): void {
    this.stopRecording();
    this._state.set('idle');
    this._result.set(null);
  }

  private clearTimeout(): void {
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
}
