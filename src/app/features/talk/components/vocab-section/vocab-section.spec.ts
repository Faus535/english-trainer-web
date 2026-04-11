import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect } from 'vitest';
import { VocabSection } from './vocab-section';
import { VocabItem } from '../../models/talk.model';

const ITEMS: VocabItem[] = [
  {
    word: 'elaborate',
    definition: 'to explain something in more detail',
    usedInContext: 'Could you elaborate on that point?',
  },
  {
    word: 'concise',
    definition: 'giving a lot of information clearly and in a few words',
    usedInContext: '',
  },
];

function setup(items: VocabItem[]): ComponentFixture<VocabSection> {
  TestBed.configureTestingModule({ imports: [VocabSection] });
  const fixture = TestBed.createComponent(VocabSection);
  fixture.componentRef.setInput('items', items);
  fixture.detectChanges();
  return fixture;
}

describe('VocabSection', () => {
  it('should render a card for each vocab item', () => {
    const fixture = setup(ITEMS);
    const cards = fixture.nativeElement.querySelectorAll('.vocab-card');
    expect(cards.length).toBe(2);
  });

  it('should show the word in vocab-word span', () => {
    const fixture = setup(ITEMS);
    const word = fixture.nativeElement.querySelector('.vocab-word');
    expect(word).not.toBeNull();
    expect(word.textContent.trim()).toBe('elaborate');
  });

  it('should show the definition', () => {
    const fixture = setup(ITEMS);
    const definition = fixture.nativeElement.querySelector('.vocab-definition');
    expect(definition).not.toBeNull();
    expect(definition.textContent.trim()).toContain('explain something in more detail');
  });

  it('should show context when provided', () => {
    const fixture = setup(ITEMS);
    const contexts = fixture.nativeElement.querySelectorAll('.vocab-context');
    expect(contexts.length).toBe(1);
    expect(contexts[0].textContent).toContain('elaborate on that point');
  });

  it('should omit context element when usedInContext is empty string', () => {
    const fixture = setup([ITEMS[1]]);
    const context = fixture.nativeElement.querySelector('.vocab-context');
    expect(context).toBeNull();
  });
});
