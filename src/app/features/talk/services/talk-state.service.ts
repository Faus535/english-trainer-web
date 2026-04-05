import { Injectable, inject, signal, computed } from '@angular/core';
import { Level } from '../../../shared/models/learning.model';
import { AuthService } from '../../../core/services/auth.service';
import { TalkApiService } from './talk-api.service';
import { TalkSseService } from './talk-sse.service';
import {
  ConversationMessage,
  ConversationStatus,
  EndConversationResponse,
} from '../models/talk.model';

@Injectable({ providedIn: 'root' })
export class TalkStateService {
  private readonly talkApi = inject(TalkApiService);
  private readonly sseService = inject(TalkSseService);
  private readonly auth = inject(AuthService);

  private readonly _scenarioId = signal<string | null>(null);
  private readonly _scenarioType = signal<string | null>(null);
  private readonly _conversationId = signal<string | null>(null);
  private readonly _messages = signal<ConversationMessage[]>([]);
  private readonly _status = signal<ConversationStatus>('idle');
  private readonly _streaming = signal(false);
  private readonly _error = signal<string | null>(null);
  private readonly _endResult = signal<EndConversationResponse | null>(null);

  readonly scenarioId = this._scenarioId.asReadonly();
  readonly scenarioType = this._scenarioType.asReadonly();
  readonly conversationId = this._conversationId.asReadonly();
  readonly messages = this._messages.asReadonly();
  readonly status = this._status.asReadonly();
  readonly streaming = this._streaming.asReadonly();
  readonly error = this._error.asReadonly();
  readonly endResult = this._endResult.asReadonly();
  readonly isActive = computed(() => !!this._conversationId());
  readonly messageCount = computed(() => this._messages().length);

  selectScenario(scenarioId: string, scenarioType: string): void {
    this._scenarioId.set(scenarioId);
    this._scenarioType.set(scenarioType);
  }

  startConversation(scenarioId: string, level: Level): void {
    const profileId = this.auth.profileId();
    if (!profileId) return;

    this._status.set('sending');
    this._error.set(null);
    this._endResult.set(null);
    this._scenarioId.set(scenarioId);

    this.talkApi.startConversation(profileId, { scenarioId, level }).subscribe({
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

  sendMessageStreaming(content: string, confidence?: number): void {
    const conversationId = this._conversationId();
    if (!conversationId) return;

    const userMessage: ConversationMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
      confidence,
    };
    this._messages.update((msgs) => [...msgs, userMessage]);
    this._status.set('sending');
    this._streaming.set(true);
    this._error.set(null);

    const assistantMessage: ConversationMessage = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    };
    this._messages.update((msgs) => [...msgs, assistantMessage]);

    let accumulated = '';
    this.sseService.streamMessage(conversationId, content, confidence).subscribe({
      next: (event) => {
        if (event.type === 'chunk') {
          accumulated += event.text;
          this._messages.update((msgs) => {
            const updated = [...msgs];
            updated[updated.length - 1] = { ...updated[updated.length - 1], content: accumulated };
            return updated;
          });
        } else if (event.type === 'feedback') {
          this._messages.update((msgs) => {
            const updated = [...msgs];
            updated[updated.length - 1] = { ...updated[updated.length - 1], feedback: event.data };
            return updated;
          });
        }
      },
      complete: () => {
        this._streaming.set(false);
        this._status.set('idle');
      },
      error: () => {
        this._streaming.set(false);
        this._status.set('error');
        this._error.set('Error streaming response');
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
    this._scenarioType.set(null);
    this._conversationId.set(null);
    this._messages.set([]);
    this._status.set('idle');
    this._streaming.set(false);
    this._error.set(null);
    this._endResult.set(null);
  }
}
