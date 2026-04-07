import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ArticleParagraph } from './article-paragraph';
import { TtsService } from '../../../../shared/services/tts.service';
import { ArticleParagraphDto } from '../../models/article.model';

const aiParagraph: ArticleParagraphDto = {
  id: 'p-1',
  content: 'This is an AI paragraph.',
  orderIndex: 0,
  speaker: 'AI',
};

const userParagraph: ArticleParagraphDto = {
  id: 'p-2',
  content: 'This is a user paragraph.',
  orderIndex: 1,
  speaker: 'USER',
};

describe('ArticleParagraph', () => {
  const mockTts = {
    speaking: signal(false),
    speak: vi.fn(),
    stop: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [{ provide: TtsService, useValue: mockTts }],
    });
  });

  it('should call TtsService.speak() when AI paragraph becomes active', () => {
    const fixture = TestBed.createComponent(ArticleParagraph);
    fixture.componentRef.setInput('paragraph', aiParagraph);
    fixture.componentRef.setInput('isActive', true);
    fixture.detectChanges();

    expect(mockTts.speak).toHaveBeenCalledWith(aiParagraph.content, expect.any(Function));
  });

  it('should not call TtsService.speak() when AI paragraph is inactive', () => {
    const fixture = TestBed.createComponent(ArticleParagraph);
    fixture.componentRef.setInput('paragraph', aiParagraph);
    fixture.componentRef.setInput('isActive', false);
    fixture.detectChanges();

    expect(mockTts.speak).not.toHaveBeenCalled();
  });

  it('should stop TTS when AI paragraph becomes inactive', () => {
    mockTts.speaking.set(true);
    const fixture = TestBed.createComponent(ArticleParagraph);
    fixture.componentRef.setInput('paragraph', aiParagraph);
    fixture.componentRef.setInput('isActive', true);
    fixture.detectChanges();

    fixture.componentRef.setInput('isActive', false);
    fixture.detectChanges();

    expect(mockTts.stop).toHaveBeenCalled();
    mockTts.speaking.set(false);
  });

  it('should show Mark as read button for USER paragraph when active', () => {
    const fixture = TestBed.createComponent(ArticleParagraph);
    fixture.componentRef.setInput('paragraph', userParagraph);
    fixture.componentRef.setInput('isActive', true);
    fixture.detectChanges();

    const btn = fixture.nativeElement.querySelector('.mark-read-btn');
    expect(btn).not.toBeNull();
    expect(btn.textContent.trim()).toBe('Mark as read');
  });

  it('should emit readCompleted when Mark as read is clicked', () => {
    const fixture = TestBed.createComponent(ArticleParagraph);
    fixture.componentRef.setInput('paragraph', userParagraph);
    fixture.componentRef.setInput('isActive', true);
    fixture.detectChanges();

    const spy = vi.fn();
    fixture.componentInstance.readCompleted.subscribe(spy);

    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.mark-read-btn');
    btn.click();

    expect(spy).toHaveBeenCalledOnce();
  });

  it('should call tts.stop() and emit readCompleted when Skip is clicked', () => {
    mockTts.speaking.set(true);
    const fixture = TestBed.createComponent(ArticleParagraph);
    fixture.componentRef.setInput('paragraph', aiParagraph);
    fixture.componentRef.setInput('isActive', true);
    fixture.detectChanges();

    const spy = vi.fn();
    fixture.componentInstance.readCompleted.subscribe(spy);

    const btn: HTMLButtonElement = fixture.nativeElement.querySelector('.skip-btn');
    btn.click();

    expect(mockTts.stop).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledOnce();
    mockTts.speaking.set(false);
  });

  it('should emit wordSelected with correct data on text selection', async () => {
    const fixture = TestBed.createComponent(ArticleParagraph);
    fixture.componentRef.setInput('paragraph', aiParagraph);
    fixture.componentRef.setInput('isActive', true);
    fixture.detectChanges();

    const spy = vi.fn();
    fixture.componentInstance.wordSelected.subscribe(spy);

    vi.spyOn(window, 'getSelection').mockReturnValue({
      toString: () => 'unprecedented',
    } as unknown as Selection);

    const container = fixture.nativeElement.querySelector('.paragraph');
    container.dispatchEvent(new Event('mouseup'));

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(spy).toHaveBeenCalledWith({
      wordOrPhrase: 'unprecedented',
      contextSentence: aiParagraph.content,
    });
  });

  it('should not emit wordSelected when selection is empty', async () => {
    const fixture = TestBed.createComponent(ArticleParagraph);
    fixture.componentRef.setInput('paragraph', aiParagraph);
    fixture.componentRef.setInput('isActive', true);
    fixture.detectChanges();

    const spy = vi.fn();
    fixture.componentInstance.wordSelected.subscribe(spy);

    vi.spyOn(window, 'getSelection').mockReturnValue({
      toString: () => '   ',
    } as unknown as Selection);

    const container = fixture.nativeElement.querySelector('.paragraph');
    container.dispatchEvent(new Event('mouseup'));

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(spy).not.toHaveBeenCalled();
  });
});
