import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, expect, it, beforeEach } from 'vitest';

import { SpeechRecognitionService } from './services/speech-recognition.service';
import { Speak } from './speak';

const mockSpeechRecognition = {
  supported: signal(true),
  state: signal('idle' as const),
  result: signal(null),
  startRecording: () => {},
  stopRecording: () => {},
  reset: () => {},
};

describe('Speak', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SpeechRecognitionService, useValue: mockSpeechRecognition },
      ],
    });
  });

  it('should create and load initial phrase', () => {
    const fixture = TestBed.createComponent(Speak);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(fixture.componentInstance).toBeTruthy();
    expect(el.querySelector('.speak-page')).toBeTruthy();
  });

  it('should display level selector', () => {
    const fixture = TestBed.createComponent(Speak);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('app-level-selector')).toBeTruthy();
  });

  it('should display the card with steps', () => {
    const fixture = TestBed.createComponent(Speak);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const labels = el.querySelectorAll('.step-label');
    expect(labels.length).toBe(3);
    expect(labels[0].textContent).toContain('Escucha');
    expect(labels[1].textContent).toContain('Repite');
    expect(labels[2].textContent).toContain('Comprueba');
  });

  it('should show navigation buttons', () => {
    const fixture = TestBed.createComponent(Speak);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const navBtns = el.querySelectorAll('.nav-btn');
    expect(navBtns.length).toBe(2);
    expect((navBtns[0] as HTMLButtonElement).disabled).toBe(true);
  });

  it('should show reveal translation button', () => {
    const fixture = TestBed.createComponent(Speak);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.reveal-btn')).toBeTruthy();
  });

  it('should show unsupported message when speech recognition not available', () => {
    mockSpeechRecognition.supported.set(false);

    const fixture = TestBed.createComponent(Speak);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.unsupported')).toBeTruthy();

    // Reset for other tests
    mockSpeechRecognition.supported.set(true);
  });
});
