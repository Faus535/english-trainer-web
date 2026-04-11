import { TestBed } from '@angular/core/testing';
import { Flashcard } from './flashcard';
import { ReviewItem } from '../../models/review.model';

const mockItem: ReviewItem = {
  id: 'item-1',
  word: 'run',
  translation: 'correr',
  contextSentence: 'I run every morning.',
  contextTranslation: 'Corro cada mañana.',
  targetWord: 'run',
  targetTranslation: 'correr',
  quality: 3,
  interval: 3,
  sourceType: 'ARTICLE',
};

describe('Flashcard', () => {
  it('should show front face initially', () => {
    const fixture = TestBed.createComponent(Flashcard);
    fixture.componentRef.setInput('item', mockItem);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    const card = el.querySelector('.card');
    expect(card?.classList.contains('flipped')).toBe(false);
  });

  it('should flip to back on click', () => {
    const fixture = TestBed.createComponent(Flashcard);
    fixture.componentRef.setInput('item', mockItem);
    fixture.detectChanges();

    const scene = fixture.nativeElement.querySelector('.card-scene') as HTMLElement;
    scene.click();
    fixture.detectChanges();

    const card = fixture.nativeElement.querySelector('.card');
    expect(card?.classList.contains('flipped')).toBe(true);
  });

  it('should show verdict bar after flip', () => {
    const fixture = TestBed.createComponent(Flashcard);
    fixture.componentRef.setInput('item', mockItem);
    fixture.detectChanges();

    const scene = fixture.nativeElement.querySelector('.card-scene') as HTMLElement;
    scene.click();
    fixture.detectChanges();

    const verdictBar = fixture.nativeElement.querySelector('.verdict-bar');
    expect(verdictBar?.classList.contains('visible')).toBe(true);
  });

  it('should emit rated with EASY on Easy click', () => {
    const fixture = TestBed.createComponent(Flashcard);
    fixture.componentRef.setInput('item', mockItem);
    fixture.detectChanges();

    // Flip first
    const scene = fixture.nativeElement.querySelector('.card-scene') as HTMLElement;
    scene.click();
    fixture.detectChanges();

    const spy = vi.fn();
    fixture.componentInstance.rated.subscribe(spy);

    const easyBtn = fixture.nativeElement.querySelector('.verdict-btn--easy') as HTMLElement;
    easyBtn.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith('EASY');
  });

  it('should emit rated with HARD on Hard click', () => {
    const fixture = TestBed.createComponent(Flashcard);
    fixture.componentRef.setInput('item', mockItem);
    fixture.detectChanges();

    // Flip first
    const scene = fixture.nativeElement.querySelector('.card-scene') as HTMLElement;
    scene.click();
    fixture.detectChanges();

    const spy = vi.fn();
    fixture.componentInstance.rated.subscribe(spy);

    const hardBtn = fixture.nativeElement.querySelector('.verdict-btn--hard') as HTMLElement;
    hardBtn.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith('HARD');
  });

  it('should display targetTranslation on back face', () => {
    const fixture = TestBed.createComponent(Flashcard);
    fixture.componentRef.setInput('item', mockItem);
    fixture.detectChanges();

    const backFace = fixture.nativeElement.querySelector('.card__back');
    expect(backFace?.textContent).toContain('correr');
  });

  it('should display contextSentence on back face', () => {
    const fixture = TestBed.createComponent(Flashcard);
    fixture.componentRef.setInput('item', mockItem);
    fixture.detectChanges();

    const backFace = fixture.nativeElement.querySelector('.card__back');
    expect(backFace?.textContent).toContain('I run every morning.');
  });
});
