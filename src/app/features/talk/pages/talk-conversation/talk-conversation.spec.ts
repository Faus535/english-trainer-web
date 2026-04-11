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
    sendMessage: vi.fn(),
    endConversation: vi.fn(),
    resetConversation: vi.fn(),
    _quickMode: { set: vi.fn() },
    _quickChallengeTitle: { set: vi.fn() },
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

    expect(stateMock._quickMode.set).toHaveBeenCalledWith(true);
    expect(stateMock._quickChallengeTitle.set).toHaveBeenCalledWith('Order Coffee');
    expect(stateMock.startConversation).toHaveBeenCalledWith(
      'order-coffee',
      'a2',
      'QUICK',
      'order-coffee',
    );
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
