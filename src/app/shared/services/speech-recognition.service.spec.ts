import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { SpeechRecognitionService } from './speech-recognition.service';

describe('SpeechRecognitionService', () => {
  let service: SpeechRecognitionService;

  afterEach(() => {
    delete (window as any).SpeechRecognition;
    delete (window as any).webkitSpeechRecognition;
  });

  it('should set supported to false when API is unavailable', () => {
    delete (window as any).SpeechRecognition;
    delete (window as any).webkitSpeechRecognition;

    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeechRecognitionService);

    expect(service.supported()).toBe(false);
  });

  it('should set supported to true when webkitSpeechRecognition is available', () => {
    const mockRecognition = {
      start: vi.fn(),
      stop: vi.fn(),
    };
    (window as any).webkitSpeechRecognition = function () {
      return mockRecognition;
    };

    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeechRecognitionService);

    expect(service.supported()).toBe(true);
  });

  describe('when API is available', () => {
    let mockRecognitionInstance: any;

    beforeEach(() => {
      mockRecognitionInstance = {
        lang: '',
        continuous: false,
        maxAlternatives: 1,
        start: vi.fn(),
        stop: vi.fn(),
        onstart: null as any,
        onresult: null as any,
        onerror: null as any,
        onend: null as any,
      };

      (window as any).SpeechRecognition = function () {
        return mockRecognitionInstance;
      };

      TestBed.configureTestingModule({});
      service = TestBed.inject(SpeechRecognitionService);
    });

    it('should set state to recording when startRecording is called', () => {
      service.startRecording();
      mockRecognitionInstance.onstart();

      expect(service.state()).toBe('recording');
    });

    it('should set state to idle when stopRecording is called', () => {
      service.startRecording();
      mockRecognitionInstance.onstart();
      service.stopRecording();
      mockRecognitionInstance.onend();

      expect(service.state()).toBe('idle');
    });

    it('should update transcript signal from onresult event inside zone', () => {
      service.startRecording();

      const mockEvent = {
        results: [Object.assign([{ transcript: 'hello world', confidence: 0.9 }], { length: 1 })],
      };
      mockRecognitionInstance.onresult(mockEvent);

      expect(service.transcript()).toBe('hello world');
      expect(service.wordConfidences().length).toBe(2);
      expect(service.wordConfidences()[0].word).toBe('hello');
      expect(service.wordConfidences()[1].word).toBe('world');
    });
  });
});
