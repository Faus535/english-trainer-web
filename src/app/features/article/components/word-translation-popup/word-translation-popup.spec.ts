import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { WordTranslationPopup } from './word-translation-popup';
import { environment } from '../../../../core/services/environment';

const base = `${environment.apiUrl}/article`;

const enrichedWord = {
  id: 'w-1',
  wordOrPhrase: 'resilience',
  translation: 'resiliencia',
  englishDefinition: 'The ability to recover quickly.',
  contextSentence: 'She showed great resilience.',
  definition: 'The capacity to withstand or to recover quickly from difficulties.',
  phonetics: 'rɪˈzɪliəns',
  synonyms: ['toughness', 'adaptability'],
  exampleSentence: 'Her resilience inspired everyone.',
  partOfSpeech: 'noun',
};

const pendingWord = {
  id: 'w-1',
  wordOrPhrase: 'resilience',
  translation: 'resiliencia',
  englishDefinition: 'The ability to recover quickly.',
  contextSentence: 'She showed great resilience.',
  definition: null,
  phonetics: null,
  synonyms: null,
  exampleSentence: null,
  partOfSpeech: null,
};

describe('WordTranslationPopup', () => {
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should call articleApi.saveWord() on mount', () => {
    const fixture = TestBed.createComponent(WordTranslationPopup);
    fixture.componentRef.setInput('draft', {
      wordOrPhrase: 'resilience',
      contextSentence: 'She showed great resilience.',
    });
    fixture.componentRef.setInput('articleId', 'art-1');
    fixture.detectChanges();

    const req = httpMock.expectOne(`${base}/art-1/words`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      wordOrPhrase: 'resilience',
      contextSentence: 'She showed great resilience.',
    });
    req.flush(pendingWord);
  });

  it('should show loading spinner while in-flight', () => {
    const fixture = TestBed.createComponent(WordTranslationPopup);
    fixture.componentRef.setInput('draft', {
      wordOrPhrase: 'resilience',
      contextSentence: 'Context.',
    });
    fixture.componentRef.setInput('articleId', 'art-1');
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('.spinner');
    expect(spinner).not.toBeNull();

    httpMock.expectOne(`${base}/art-1/words`).flush(pendingWord);
  });

  it('should display translation after success', () => {
    const fixture = TestBed.createComponent(WordTranslationPopup);
    fixture.componentRef.setInput('draft', {
      wordOrPhrase: 'resilience',
      contextSentence: 'Context.',
    });
    fixture.componentRef.setInput('articleId', 'art-1');
    fixture.detectChanges();

    httpMock.expectOne(`${base}/art-1/words`).flush(pendingWord);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('resilience');
    expect(el.textContent).toContain('resiliencia');
  });

  it('should emit saved with SavedWord when Add to review is clicked', () => {
    const fixture = TestBed.createComponent(WordTranslationPopup);
    fixture.componentRef.setInput('draft', {
      wordOrPhrase: 'resilience',
      contextSentence: 'Context.',
    });
    fixture.componentRef.setInput('articleId', 'art-1');
    fixture.detectChanges();

    const savedSpy = vi.fn();
    fixture.componentInstance.saved.subscribe(savedSpy);

    httpMock.expectOne(`${base}/art-1/words`).flush(enrichedWord);
    fixture.detectChanges();

    const saveBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.save-btn');
    saveBtn.click();

    expect(savedSpy).toHaveBeenCalledWith(enrichedWord);
  });

  it('should emit dismissed when Close is clicked after success', () => {
    const fixture = TestBed.createComponent(WordTranslationPopup);
    fixture.componentRef.setInput('draft', {
      wordOrPhrase: 'resilience',
      contextSentence: 'Context.',
    });
    fixture.componentRef.setInput('articleId', 'art-1');
    fixture.detectChanges();

    const dismissedSpy = vi.fn();
    fixture.componentInstance.dismissed.subscribe(dismissedSpy);

    httpMock.expectOne(`${base}/art-1/words`).flush(pendingWord);
    fixture.detectChanges();

    const dismissBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.dismiss-btn');
    dismissBtn.click();

    expect(dismissedSpy).toHaveBeenCalledOnce();
  });

  it('should emit dismissed on Escape keydown', () => {
    const fixture = TestBed.createComponent(WordTranslationPopup);
    fixture.componentRef.setInput('draft', {
      wordOrPhrase: 'resilience',
      contextSentence: 'Context.',
    });
    fixture.componentRef.setInput('articleId', 'art-1');
    fixture.detectChanges();

    const dismissedSpy = vi.fn();
    fixture.componentInstance.dismissed.subscribe(dismissedSpy);

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(dismissedSpy).toHaveBeenCalledOnce();

    httpMock.expectOne(`${base}/art-1/words`).flush(pendingWord);
  });

  it('should show error message on API failure', () => {
    const fixture = TestBed.createComponent(WordTranslationPopup);
    fixture.componentRef.setInput('draft', {
      wordOrPhrase: 'resilience',
      contextSentence: 'Context.',
    });
    fixture.componentRef.setInput('articleId', 'art-1');
    fixture.detectChanges();

    httpMock.expectOne(`${base}/art-1/words`).flush({}, { status: 500, statusText: 'Error' });
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Could not translate word');
  });

  it('should show enrichment skeletons when definition is null', () => {
    const fixture = TestBed.createComponent(WordTranslationPopup);
    fixture.componentRef.setInput('draft', {
      wordOrPhrase: 'resilience',
      contextSentence: 'Context.',
    });
    fixture.componentRef.setInput('articleId', 'art-1');
    fixture.detectChanges();

    httpMock.expectOne(`${base}/art-1/words`).flush(pendingWord);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.skeleton-block')).not.toBeNull();
    expect(el.querySelector('.definition-text')).toBeNull();
    expect(el.querySelector('.phonetics')).toBeNull();
  });

  it('should display all enrichment fields when present', () => {
    const fixture = TestBed.createComponent(WordTranslationPopup);
    fixture.componentRef.setInput('draft', {
      wordOrPhrase: 'resilience',
      contextSentence: 'Context.',
    });
    fixture.componentRef.setInput('articleId', 'art-1');
    fixture.detectChanges();

    httpMock.expectOne(`${base}/art-1/words`).flush(enrichedWord);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.pos-badge')?.textContent?.trim()).toBe('noun');
    expect(el.querySelector('.phonetics')?.textContent).toContain('rɪˈzɪliəns');
    expect(el.querySelector('.definition-text')?.textContent).toContain(
      'The capacity to withstand',
    );
    expect(el.querySelectorAll('.synonym-chip').length).toBe(2);
    expect(el.querySelector('.example-sentence')?.textContent).toContain(
      'Her resilience inspired everyone',
    );
    expect(el.querySelector('.skeleton-block')).toBeNull();
  });

  it('should not render showDefinition toggle button', () => {
    const fixture = TestBed.createComponent(WordTranslationPopup);
    fixture.componentRef.setInput('draft', {
      wordOrPhrase: 'resilience',
      contextSentence: 'Context.',
    });
    fixture.componentRef.setInput('articleId', 'art-1');
    fixture.detectChanges();

    httpMock.expectOne(`${base}/art-1/words`).flush(pendingWord);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.toggle-btn')).toBeNull();
  });
});
