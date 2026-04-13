import { TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { UtteranceBubble } from './utterance-bubble';
import { MiniConversationTurn } from '../../models/pronunciation.model';

const baseTurn: MiniConversationTurn = {
  id: 'turn-1',
  prompt: 'Say: The thought was thorough.',
  targetPhrase: 'The thought was thorough.',
  recognizedText: null,
  score: null,
  wordFeedback: [],
  overallTip: null,
};

describe('UtteranceBubble', () => {
  it('should render prompt text in AI bubble', () => {
    const fixture = TestBed.createComponent(UtteranceBubble);
    fixture.componentRef.setInput('turn', baseTurn);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.ai-bubble')?.textContent?.trim()).toBe(
      'Say: The thought was thorough.',
    );
  });

  it('should not render user bubble when recognizedText is null', () => {
    const fixture = TestBed.createComponent(UtteranceBubble);
    fixture.componentRef.setInput('turn', baseTurn);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.user-bubble')).toBeNull();
  });

  it('should apply score-low to words with score < 50 when turn is evaluated', () => {
    const evaluatedTurn: MiniConversationTurn = {
      ...baseTurn,
      recognizedText: 'thought',
      score: 40,
      wordFeedback: [{ word: 'thought', recognized: 'tot', tip: '', score: 40 }],
    };

    const fixture = TestBed.createComponent(UtteranceBubble);
    fixture.componentRef.setInput('turn', evaluatedTurn);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const lowSpans = el.querySelectorAll('.word-span.score-low');
    expect(lowSpans.length).toBe(1);
    expect(lowSpans[0].textContent?.trim()).toBe('thought');
  });

  it('should render score ring with correct value', () => {
    const evaluatedTurn: MiniConversationTurn = {
      ...baseTurn,
      recognizedText: 'thought',
      score: 75,
      wordFeedback: [],
    };

    const fixture = TestBed.createComponent(UtteranceBubble);
    fixture.componentRef.setInput('turn', evaluatedTurn);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const ring = el.querySelector('app-progress-ring');
    expect(ring).not.toBeNull();
  });
});
