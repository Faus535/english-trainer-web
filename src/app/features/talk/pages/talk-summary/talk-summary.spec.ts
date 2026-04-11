import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, it, expect } from 'vitest';
import { signal } from '@angular/core';
import { TalkSummary } from './talk-summary';
import { TalkStateService } from '../../services/talk-state.service';

const QUICK_END_RESULT = {
  taskCompleted: true,
  top3Corrections: ['Use "would" instead of "will"', 'Add article before noun'],
  encouragementNote: 'Great effort! Keep it up.',
};

const FULL_END_RESULT = {
  summary: 'Nice conversation overall.',
  evaluation: {
    grammarAccuracy: 80,
    vocabularyRange: 70,
    fluency: 75,
    taskCompletion: 85,
    overallScore: 78,
    levelDemonstrated: 'b1',
    strengths: ['Good fluency'],
    areasToImprove: ['Article usage'],
  },
  turnCount: 8,
  errorCount: 2,
};

function makeStateMock(quickMode: boolean, endResult: unknown) {
  return {
    endResult: signal(endResult),
    status: signal('idle'),
    quickMode: signal(quickMode),
    resetConversation: () => {},
  };
}

describe('TalkSummary', () => {
  function setup(quickMode: boolean, endResult: unknown): ComponentFixture<TalkSummary> {
    const stateMock = makeStateMock(quickMode, endResult);
    TestBed.configureTestingModule({
      imports: [TalkSummary],
      providers: [provideRouter([]), { provide: TalkStateService, useValue: stateMock }],
    });
    const fixture = TestBed.createComponent(TalkSummary);
    fixture.detectChanges();
    return fixture;
  }

  it('should show quick summary section when mode is QUICK', () => {
    const fixture = setup(true, QUICK_END_RESULT);
    const quickSection = fixture.nativeElement.querySelector('.quick-summary');
    expect(quickSection).not.toBeNull();
  });

  it('should show task completed badge', () => {
    const fixture = setup(true, QUICK_END_RESULT);
    const badge = fixture.nativeElement.querySelector('.task-badge');
    expect(badge).not.toBeNull();
    expect(badge.textContent.trim()).toContain('Task Completed');
    expect(badge.classList.contains('completed')).toBe(true);
  });

  it('should show top corrections as bullet list', () => {
    const fixture = setup(true, QUICK_END_RESULT);
    const corrections = fixture.nativeElement.querySelectorAll('.correction');
    expect(corrections.length).toBe(2);
    expect(corrections[0].textContent).toContain('Use "would"');
  });

  it('should show full summary view for FULL mode (no regression)', () => {
    const fixture = setup(false, FULL_END_RESULT);
    const quickSection = fixture.nativeElement.querySelector('.quick-summary');
    const statsRow = fixture.nativeElement.querySelector('.stats-row');
    expect(quickSection).toBeNull();
    expect(statsRow).not.toBeNull();
  });
});
