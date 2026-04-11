import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ArticleHub } from './article-hub';
import { ArticleStateService } from '../../services/article-state.service';

describe('ArticleHub', () => {
  const mockState = {
    generating: signal(false),
    generationStep: signal('idle' as const),
    generationProgress: signal(0),
    generationError: signal(null as string | null),
    generate: vi.fn(),
    cancelGeneration: vi.fn(),
    reset: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: ArticleStateService, useValue: mockState }],
    });
  });

  it('should call state.reset() on construction', () => {
    TestBed.createComponent(ArticleHub);
    expect(mockState.reset).toHaveBeenCalledOnce();
  });

  it('should disable Generate button when topic is empty', () => {
    const fixture = TestBed.createComponent(ArticleHub);
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.generate-btn');
    expect(button.disabled).toBe(true);
  });

  it('should enable Generate button when topic is valid', () => {
    const fixture = TestBed.createComponent(ArticleHub);
    fixture.detectChanges();

    fixture.componentInstance['form'].controls.topic.setValue('climate change');
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.generate-btn');
    expect(button.disabled).toBe(false);
  });

  it('should call state.generate() with topic and level when form submitted', () => {
    const fixture = TestBed.createComponent(ArticleHub);
    fixture.detectChanges();

    fixture.componentInstance['form'].controls.topic.setValue('space exploration');
    fixture.detectChanges();

    fixture.componentInstance['onGenerate']();

    expect(mockState.generate).toHaveBeenCalledWith({
      topic: 'space exploration',
      level: 'B1',
    });
  });

  it('should show generation overlay when generating is true', () => {
    mockState.generating.set(true);
    const fixture = TestBed.createComponent(ArticleHub);
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('app-generation-overlay');
    expect(overlay).not.toBeNull();

    mockState.generating.set(false);
  });

  it('should not show generation overlay when generating is false', () => {
    mockState.generating.set(false);
    const fixture = TestBed.createComponent(ArticleHub);
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('app-generation-overlay');
    expect(overlay).toBeNull();
  });

  it('should disable Generate button while generating', () => {
    mockState.generating.set(true);
    const fixture = TestBed.createComponent(ArticleHub);
    fixture.componentInstance['form'].controls.topic.setValue('AI');
    fixture.detectChanges();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('.generate-btn');
    expect(button.disabled).toBe(true);

    mockState.generating.set(false);
  });

  it('should call state.generate() when form is submitted via DOM', () => {
    const fixture = TestBed.createComponent(ArticleHub);
    fixture.detectChanges();

    fixture.componentInstance['form'].controls.topic.setValue('artificial intelligence');
    fixture.detectChanges();

    const formEl: HTMLFormElement = fixture.nativeElement.querySelector('form');
    formEl.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(mockState.generate).toHaveBeenCalledWith({
      topic: 'artificial intelligence',
      level: 'B1',
    });
  });
});
