import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { signal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ArticleHistory } from './article-history';
import { ArticleStateService } from '../../services/article-state.service';
import { ArticleHistoryItem } from '../../models/article.model';

describe('ArticleHistory', () => {
  const historySignal = signal<ArticleHistoryItem[]>([]);
  const historyLoadingSignal = signal(false);
  const hasHistorySignal = signal(false);

  const mockState = {
    history: historySignal.asReadonly(),
    historyLoading: historyLoadingSignal.asReadonly(),
    hasHistory: hasHistorySignal.asReadonly(),
    loadHistory: vi.fn(),
    deleteArticleFromHistory: vi.fn(),
  };

  const sampleHistory: ArticleHistoryItem[] = [
    {
      id: 'art-1',
      topic: 'Climate Change',
      level: 'B2',
      status: 'READY',
      createdAt: new Date().toISOString(),
      questionCount: 5,
      answeredCount: 3,
      savedWordCount: 7,
    },
    {
      id: 'art-2',
      topic: 'Space Exploration',
      level: 'C1',
      status: 'READY',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      questionCount: 4,
      answeredCount: 0,
      savedWordCount: 2,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    historySignal.set([]);
    historyLoadingSignal.set(false);
    hasHistorySignal.set(false);

    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: ArticleStateService, useValue: mockState }],
    });
  });

  it('should call loadHistory() on construction', () => {
    TestBed.createComponent(ArticleHistory);
    expect(mockState.loadHistory).toHaveBeenCalledOnce();
  });

  it('should show skeleton while loading', () => {
    historyLoadingSignal.set(true);
    const fixture = TestBed.createComponent(ArticleHistory);
    fixture.detectChanges();

    const skeletons = fixture.nativeElement.querySelectorAll('.skeleton-card');
    expect(skeletons.length).toBe(3);
  });

  it('should show empty state when history is empty and not loading', () => {
    historyLoadingSignal.set(false);
    hasHistorySignal.set(false);
    const fixture = TestBed.createComponent(ArticleHistory);
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector('.empty-state');
    expect(emptyState).not.toBeNull();
    expect(emptyState.textContent).toContain('No articles yet');
  });

  it('should render history items with correct stats', () => {
    historySignal.set(sampleHistory);
    hasHistorySignal.set(true);
    const fixture = TestBed.createComponent(ArticleHistory);
    fixture.detectChanges();

    const cards = fixture.nativeElement.querySelectorAll('.history-card');
    expect(cards.length).toBe(2);

    const firstCard = cards[0];
    expect(firstCard.textContent).toContain('Climate Change');
    expect(firstCard.textContent).toContain('B2');
    expect(firstCard.textContent).toContain('5 questions');
    expect(firstCard.textContent).toContain('3 answered');
    expect(firstCard.textContent).toContain('7 words');
  });

  it('should navigate to article on resume click', () => {
    historySignal.set(sampleHistory);
    hasHistorySignal.set(true);
    const fixture = TestBed.createComponent(ArticleHistory);
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    const resumeBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.btn-resume');
    resumeBtn.click();

    expect(navigateSpy).toHaveBeenCalledWith(['/article', 'art-1']);
  });

  it('should show confirmation on delete click and delete on confirm', () => {
    historySignal.set(sampleHistory);
    hasHistorySignal.set(true);
    const fixture = TestBed.createComponent(ArticleHistory);
    fixture.detectChanges();

    const deleteBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.btn-delete');
    deleteBtn.click();
    fixture.detectChanges();

    const confirmText = fixture.nativeElement.querySelector('.confirm-text');
    expect(confirmText).not.toBeNull();
    expect(confirmText.textContent).toContain('Delete this article?');

    const confirmYes: HTMLButtonElement = fixture.nativeElement.querySelector('.btn-confirm-yes');
    confirmYes.click();

    expect(mockState.deleteArticleFromHistory).toHaveBeenCalledWith('art-1');
  });

  it('should cancel delete on No click', () => {
    historySignal.set(sampleHistory);
    hasHistorySignal.set(true);
    const fixture = TestBed.createComponent(ArticleHistory);
    fixture.detectChanges();

    const deleteBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.btn-delete');
    deleteBtn.click();
    fixture.detectChanges();

    const confirmNo: HTMLButtonElement = fixture.nativeElement.querySelector('.btn-confirm-no');
    confirmNo.click();
    fixture.detectChanges();

    const resumeBtn = fixture.nativeElement.querySelector('.btn-resume');
    expect(resumeBtn).not.toBeNull();
    expect(mockState.deleteArticleFromHistory).not.toHaveBeenCalled();
  });
});
