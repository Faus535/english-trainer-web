import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, ActivatedRoute } from '@angular/router';
import { describe, it, expect, vi } from 'vitest';
import { signal } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TalkConversation } from './talk-conversation';
import { TalkStateService } from '../../services/talk-state.service';

function makeStateMock(overrides: Record<string, unknown> = {}) {
  return {
    messages: signal([]),
    status: signal('idle'),
    error: signal(null),
    messageCount: signal(0),
    level: signal('a2'),
    quickMode: signal(false),
    quickExchangeCount: signal(0),
    quickChallengeTitle: signal(null),
    autoEnded: signal(false),
    isSending: signal(false),
    endResult: signal(null),
    startConversation: vi.fn(),
    enterQuickMode: vi.fn(),
    sendMessage: vi.fn(),
    endConversation: vi.fn(),
    resetConversation: vi.fn(),
    ...overrides,
  };
}

describe('TalkConversation', () => {
  let fixture: ComponentFixture<TalkConversation>;
  let stateMock: ReturnType<typeof makeStateMock>;

  function create(queryParams: Record<string, string> = {}): void {
    stateMock = makeStateMock();
    TestBed.configureTestingModule({
      imports: [TalkConversation],
      providers: [
        provideRouter([]),
        { provide: TalkStateService, useValue: stateMock },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: {
                get: (key: string) => queryParams[key] ?? null,
              },
            },
          },
        },
      ],
    });
    fixture = TestBed.createComponent(TalkConversation);
    fixture.detectChanges();
  }

  it('should read mode and challengeId from query params', () => {
    create({ mode: 'QUICK', challengeId: 'order-coffee', title: 'Order%20Coffee' });

    expect(stateMock.enterQuickMode).toHaveBeenCalledWith('order-coffee', 'a2', 'Order Coffee');
  });

  it('should show QuickProgressBar when in quick mode', () => {
    stateMock = makeStateMock({ quickMode: signal(true) });
    TestBed.configureTestingModule({
      imports: [TalkConversation],
      providers: [
        provideRouter([]),
        { provide: TalkStateService, useValue: stateMock },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: { get: () => null } } },
        },
      ],
    });
    fixture = TestBed.createComponent(TalkConversation);
    fixture.detectChanges();

    const progressBar = fixture.debugElement.query(By.css('app-quick-progress-bar'));
    expect(progressBar).not.toBeNull();
  });

  it('should not show QuickProgressBar for full mode', () => {
    create({ scenarioId: 'restaurant', level: 'b1' });

    const progressBar = fixture.debugElement.query(By.css('app-quick-progress-bar'));
    expect(progressBar).toBeNull();
  });
});
