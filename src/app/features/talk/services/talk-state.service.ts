import { Injectable, inject, signal, computed } from '@angular/core';
import { TalkApiService } from './talk-api.service';
import { ConversationMessage, ConversationStatus, TalkEndResponse } from '../models/talk.model';

@Injectable({ providedIn: 'root' })
export class TalkStateService {
  private readonly talkApi = inject(TalkApiService);

  private readonly _scenarioId = signal<string | null>(null);
  private readonly _conversationId = signal<string | null>(null);
  private readonly _messages = signal<ConversationMessage[]>([]);
  private readonly _status = signal<ConversationStatus>('idle');
  private readonly _error = signal<string | null>(null);
  private readonly _endResult = signal<TalkEndResponse | null>(null);
  private readonly _suggestEnd = signal(false);
  private readonly _level = signal<string>('a2');

  readonly scenarioId = this._scenarioId.asReadonly();
  readonly conversationId = this._conversationId.asReadonly();
  readonly messages = this._messages.asReadonly();
  readonly status = this._status.asReadonly();
  readonly error = this._error.asReadonly();
  readonly endResult = this._endResult.asReadonly();
  readonly suggestEnd = this._suggestEnd.asReadonly();
  readonly level = this._level.asReadonly();
  readonly isActive = computed(() => !!this._conversationId());
  readonly messageCount = computed(() => this._messages().length);
  readonly isSending = computed(() => this._status() === 'sending');

  startConversation(scenarioId: string, level: string): void {
    this._status.set('sending');
    this._error.set(null);
    this._endResult.set(null);
    this._scenarioId.set(scenarioId);
    this._level.set(level);

    this.talkApi.startConversation({ scenarioId, level }).subscribe({
      next: (res) => {
        this._conversationId.set(res.id);
        this._messages.set(res.messages);
        this._status.set('idle');
      },
      error: (err) => {
        this._status.set('error');
        this._error.set(err.error?.message ?? 'Could not start conversation');
      },
    });
  }

  sendMessage(content: string, confidence?: number): void {
    const conversationId = this._conversationId();
    if (!conversationId) return;

    const userMessage: ConversationMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
      confidence,
    };
    this._messages.update((msgs) => [...msgs, userMessage]);
    this._status.set('sending');
    this._error.set(null);

    this.talkApi.sendMessage(conversationId, content, confidence).subscribe({
      next: (res) => {
        const assistantMessage: ConversationMessage = {
          id: crypto.randomUUID(),
          role: 'assistant',
          content: res.content,
          createdAt: new Date().toISOString(),
          correction: res.correction,
        };
        this._messages.update((msgs) => [...msgs, assistantMessage]);
        this._suggestEnd.set(res.suggestEnd);
        this._status.set('idle');
      },
      error: () => {
        this._status.set('error');
        this._error.set('Error sending message');
      },
    });
  }

  endConversation(): void {
    const conversationId = this._conversationId();
    if (!conversationId) return;

    this._status.set('sending');

    this.talkApi.endConversation(conversationId).subscribe({
      next: (res) => {
        this._endResult.set(res);
        this._status.set('idle');
      },
      error: () => {
        this._status.set('error');
        this._error.set('Could not end conversation');
      },
    });
  }

  resetConversation(): void {
    this._scenarioId.set(null);
    this._conversationId.set(null);
    this._messages.set([]);
    this._status.set('idle');
    this._error.set(null);
    this._endResult.set(null);
    this._suggestEnd.set(false);
    this._level.set('a2');
  }
}
