import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PreReadingStage } from './pre-reading-stage';
import { SavedWord } from '../../models/article.model';

describe('PreReadingStage', () => {
  const sampleWords: SavedWord[] = [
    {
      id: 'w-1',
      wordOrPhrase: 'resilience',
      translation: 'resiliencia',
      englishDefinition: 'The ability to recover quickly.',
      contextSentence: 'She showed great resilience.',
    },
    {
      id: 'w-2',
      wordOrPhrase: 'unprecedented',
      translation: 'sin precedentes',
      englishDefinition: 'Never done or known before.',
      contextSentence: 'An unprecedented event.',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should render key words as chips', () => {
    const fixture = TestBed.createComponent(PreReadingStage);
    fixture.componentRef.setInput('keyWords', sampleWords);
    fixture.componentRef.setInput('question', 'What is the main idea?');
    fixture.detectChanges();

    const chips = fixture.nativeElement.querySelectorAll('.word-chip');
    expect(chips.length).toBe(2);
    expect(chips[0].textContent).toContain('resilience');
    expect(chips[1].textContent).toContain('unprecedented');
  });

  it('should render predictive question', () => {
    const fixture = TestBed.createComponent(PreReadingStage);
    fixture.componentRef.setInput('keyWords', sampleWords);
    fixture.componentRef.setInput('question', 'What is the main idea?');
    fixture.detectChanges();

    const question = fixture.nativeElement.querySelector('.predictive-question');
    expect(question.textContent).toContain('What is the main idea?');
  });

  it('should show skeleton while loading', () => {
    const fixture = TestBed.createComponent(PreReadingStage);
    fixture.componentRef.setInput('keyWords', []);
    fixture.componentRef.setInput('loading', true);
    fixture.detectChanges();

    const skeletonChips = fixture.nativeElement.querySelectorAll('.skeleton-chip');
    expect(skeletonChips.length).toBe(4);
  });

  it('should emit startReading on button click', () => {
    const fixture = TestBed.createComponent(PreReadingStage);
    fixture.componentRef.setInput('keyWords', sampleWords);
    fixture.detectChanges();

    const spy = vi.fn();
    fixture.componentInstance.startReading.subscribe(spy);

    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.start-btn');
    btn.click();

    expect(spy).toHaveBeenCalledOnce();
  });

  it('should emit startReading on Escape key', () => {
    const fixture = TestBed.createComponent(PreReadingStage);
    fixture.componentRef.setInput('keyWords', sampleWords);
    fixture.detectChanges();

    const spy = vi.fn();
    fixture.componentInstance.startReading.subscribe(spy);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(spy).toHaveBeenCalledOnce();
  });

  it('should toggle word translation on chip click', () => {
    const fixture = TestBed.createComponent(PreReadingStage);
    fixture.componentRef.setInput('keyWords', sampleWords);
    fixture.detectChanges();

    const chip: HTMLButtonElement = fixture.nativeElement.querySelector('.word-chip');
    chip.click();
    fixture.detectChanges();

    const translation = fixture.nativeElement.querySelector('.chip-translation');
    expect(translation).not.toBeNull();
    expect(translation.textContent).toContain('resiliencia');
  });
});
