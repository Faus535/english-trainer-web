import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { GrammarNotesSection } from './grammar-notes-section';
import { GrammarNote } from '../../models/talk.model';

const NOTES: GrammarNote[] = [
  {
    originalText: 'I goed to the store',
    correction: 'I went to the store',
    explanation: '"went" is the irregular past tense of "go".',
  },
  {
    originalText: 'She have a cat',
    correction: 'She has a cat',
    explanation: 'Third-person singular requires "has".',
  },
];

const NOTE_NO_EXPLANATION: GrammarNote[] = [
  { originalText: 'I goed', correction: 'I went', explanation: '' },
];

function setup(notes: GrammarNote[]): ComponentFixture<GrammarNotesSection> {
  TestBed.configureTestingModule({ imports: [GrammarNotesSection] });
  const fixture = TestBed.createComponent(GrammarNotesSection);
  fixture.componentRef.setInput('notes', notes);
  fixture.detectChanges();
  return fixture;
}

describe('GrammarNotesSection', () => {
  it('should render a note item for each grammar note', () => {
    const fixture = setup(NOTES);
    const items = fixture.nativeElement.querySelectorAll('.note-item');
    expect(items.length).toBe(2);
  });

  it('should show original text with strikethrough class', () => {
    const fixture = setup(NOTES);
    const original = fixture.nativeElement.querySelector('.original');
    expect(original).not.toBeNull();
    expect(original.textContent.trim()).toBe('I goed to the store');
  });

  it('should show correction text', () => {
    const fixture = setup(NOTES);
    const corrected = fixture.nativeElement.querySelector('.corrected');
    expect(corrected).not.toBeNull();
    expect(corrected.textContent.trim()).toBe('I went to the store');
  });

  it('should show explanation text', () => {
    const fixture = setup(NOTES);
    const explanation = fixture.nativeElement.querySelector('.explanation');
    expect(explanation).not.toBeNull();
    expect(explanation.textContent.trim()).toContain('"went"');
  });

  it('should omit explanation element when explanation is empty string', () => {
    const fixture = setup(NOTE_NO_EXPLANATION);
    const explanation = fixture.nativeElement.querySelector('.explanation');
    expect(explanation).toBeNull();
  });
});
