import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { TalkStateService } from './talk-state.service';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../core/services/environment';

describe('TalkStateService', () => {
  let service: TalkStateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: AuthService,
          useValue: {
            profileId: () => 'test-profile-id',
            token: () => 'test-token',
          },
        },
      ],
    });
    service = TestBed.inject(TalkStateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should start with idle status', () => {
    expect(service.status()).toBe('idle');
    expect(service.messages()).toEqual([]);
    expect(service.conversationId()).toBeNull();
    expect(service.streaming()).toBe(false);
  });

  it('startConversation() should set status to sending and set scenario signal', () => {
    service.startConversation('restaurant', 'a2');
    expect(service.status()).toBe('sending');
    expect(service.scenarioId()).toBe('restaurant');

    const req = httpMock.expectOne(`${environment.apiUrl}/talk/conversations`);
    expect(req.request.method).toBe('POST');
    req.flush({
      id: 'conv-1',
      level: 'a2',
      messages: [
        { id: 'msg-1', role: 'assistant', content: 'Welcome!', timestamp: '2026-04-05T00:00:00Z' },
      ],
      startedAt: '2026-04-05T00:00:00Z',
    });

    expect(service.status()).toBe('idle');
    expect(service.conversationId()).toBe('conv-1');
    expect(service.messages().length).toBe(1);
  });

  it('sendMessageStreaming() should append optimistic user message', () => {
    // Setup: start a conversation first
    service.startConversation('restaurant', 'a2');
    const req = httpMock.expectOne(`${environment.apiUrl}/talk/conversations`);
    req.flush({
      id: 'conv-1',
      level: 'a2',
      messages: [],
      startedAt: '2026-04-05T00:00:00Z',
    });

    service.sendMessageStreaming('Hello there');

    // Should have user message + empty assistant placeholder
    expect(service.messages().length).toBe(2);
    expect(service.messages()[0].role).toBe('user');
    expect(service.messages()[0].content).toBe('Hello there');
    expect(service.messages()[1].role).toBe('assistant');
    expect(service.messages()[1].content).toBe('');
    expect(service.streaming()).toBe(true);
  });

  it('endConversation() should call API and set endResult signal', () => {
    service.startConversation('restaurant', 'a2');
    const startReq = httpMock.expectOne(`${environment.apiUrl}/talk/conversations`);
    startReq.flush({
      id: 'conv-1',
      level: 'a2',
      messages: [],
      startedAt: '2026-04-05T00:00:00Z',
    });

    service.endConversation();
    expect(service.status()).toBe('sending');

    const endReq = httpMock.expectOne(`${environment.apiUrl}/talk/conversations/conv-1/end`);
    expect(endReq.request.method).toBe('POST');
    endReq.flush({
      xpEarned: 45,
      messagesCount: 10,
      summary: 'Great conversation',
    });

    expect(service.status()).toBe('idle');
    expect(service.endResult()?.xpEarned).toBe(45);
  });

  it('resetConversation() should clear all signals', () => {
    service.startConversation('restaurant', 'a2');
    const req = httpMock.expectOne(`${environment.apiUrl}/talk/conversations`);
    req.flush({
      id: 'conv-1',
      level: 'a2',
      messages: [
        { id: 'msg-1', role: 'assistant', content: 'Hi', timestamp: '2026-04-05T00:00:00Z' },
      ],
      startedAt: '2026-04-05T00:00:00Z',
    });

    service.resetConversation();

    expect(service.conversationId()).toBeNull();
    expect(service.messages()).toEqual([]);
    expect(service.status()).toBe('idle');
    expect(service.scenarioId()).toBeNull();
    expect(service.scenarioType()).toBeNull();
    expect(service.endResult()).toBeNull();
    expect(service.error()).toBeNull();
  });
});
