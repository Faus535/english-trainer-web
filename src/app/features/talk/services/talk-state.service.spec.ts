import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { describe, expect, it, beforeEach } from 'vitest';
import { TalkStateService } from './talk-state.service';
import { environment } from '../../../core/services/environment';

describe('TalkStateService', () => {
  let service: TalkStateService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TalkStateService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should start with idle status', () => {
    expect(service.status()).toBe('idle');
    expect(service.messages()).toEqual([]);
    expect(service.conversationId()).toBeNull();
    expect(service.isSending()).toBe(false);
  });

  it('startConversation() should set status to sending and set scenario signal', () => {
    service.startConversation('restaurant', 'a2');
    expect(service.status()).toBe('sending');
    expect(service.scenarioId()).toBe('restaurant');

    const req = httpMock.expectOne(`${environment.apiUrl}/talk/conversations`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ scenarioId: 'restaurant', level: 'a2' });
    req.flush({
      id: 'conv-1',
      userId: 'user-1',
      scenarioId: 'restaurant',
      level: 'a2',
      status: 'active',
      startedAt: '2026-04-05T00:00:00Z',
      endedAt: null,
      messages: [
        {
          id: 'msg-1',
          role: 'assistant',
          content: 'Welcome!',
          createdAt: '2026-04-05T00:00:00Z',
          correction: null,
        },
      ],
    });

    expect(service.status()).toBe('idle');
    expect(service.conversationId()).toBe('conv-1');
    expect(service.messages().length).toBe(1);
  });

  it('sendMessage() should append optimistic user message and assistant response', () => {
    service.startConversation('restaurant', 'a2');
    const startReq = httpMock.expectOne(`${environment.apiUrl}/talk/conversations`);
    startReq.flush({
      id: 'conv-1',
      userId: 'user-1',
      scenarioId: 'restaurant',
      level: 'a2',
      status: 'active',
      startedAt: '2026-04-05T00:00:00Z',
      endedAt: null,
      messages: [],
    });

    service.sendMessage('Hello there');

    expect(service.messages().length).toBe(1);
    expect(service.messages()[0].role).toBe('user');
    expect(service.messages()[0].content).toBe('Hello there');
    expect(service.isSending()).toBe(true);

    const msgReq = httpMock.expectOne(`${environment.apiUrl}/talk/conversations/conv-1/messages`);
    expect(msgReq.request.method).toBe('POST');
    msgReq.flush({
      content: 'Hello! How can I help?',
      correction: {
        grammarFixes: [],
        vocabularySuggestions: [],
        pronunciationTips: [],
        encouragement: null,
      },
      suggestEnd: false,
    });

    expect(service.messages().length).toBe(2);
    expect(service.messages()[1].role).toBe('assistant');
    expect(service.messages()[1].content).toBe('Hello! How can I help?');
    expect(service.isSending()).toBe(false);
    expect(service.suggestEnd()).toBe(false);
  });

  it('endConversation() should call API and set endResult signal', () => {
    service.startConversation('restaurant', 'a2');
    const startReq = httpMock.expectOne(`${environment.apiUrl}/talk/conversations`);
    startReq.flush({
      id: 'conv-1',
      userId: 'user-1',
      scenarioId: 'restaurant',
      level: 'a2',
      status: 'active',
      startedAt: '2026-04-05T00:00:00Z',
      endedAt: null,
      messages: [],
    });

    service.endConversation();
    expect(service.status()).toBe('sending');

    const endReq = httpMock.expectOne(`${environment.apiUrl}/talk/conversations/conv-1/end`);
    expect(endReq.request.method).toBe('POST');
    endReq.flush({
      summary: 'Great conversation',
      evaluation: {
        grammarAccuracy: 78,
        vocabularyRange: 65,
        fluency: 72,
        taskCompletion: 90,
        overallScore: 76,
        levelDemonstrated: 'b1',
        strengths: ['Good use of past tense'],
        areasToImprove: ['Article usage'],
      },
      turnCount: 8,
      errorCount: 2,
    });

    expect(service.status()).toBe('idle');
    expect(service.endResult()?.turnCount).toBe(8);
    expect(service.endResult()?.errorCount).toBe(2);
    expect(service.endResult()?.evaluation.overallScore).toBe(76);
  });

  it('resetConversation() should clear all signals', () => {
    service.startConversation('restaurant', 'a2');
    const req = httpMock.expectOne(`${environment.apiUrl}/talk/conversations`);
    req.flush({
      id: 'conv-1',
      userId: 'user-1',
      scenarioId: 'restaurant',
      level: 'a2',
      status: 'active',
      startedAt: '2026-04-05T00:00:00Z',
      endedAt: null,
      messages: [
        {
          id: 'msg-1',
          role: 'assistant',
          content: 'Hi',
          createdAt: '2026-04-05T00:00:00Z',
          correction: null,
        },
      ],
    });

    service.resetConversation();

    expect(service.conversationId()).toBeNull();
    expect(service.messages()).toEqual([]);
    expect(service.status()).toBe('idle');
    expect(service.scenarioId()).toBeNull();
    expect(service.endResult()).toBeNull();
    expect(service.error()).toBeNull();
    expect(service.suggestEnd()).toBe(false);
  });
});
