import { Injectable, inject, signal, computed } from '@angular/core';
import { Level } from '../../../shared/models/learning.model';
import { AuthService } from '../../../core/services/auth.service';
import { StateService } from '../../../shared/services/state.service';
import { TutorApiService } from './tutor-api.service';
import { TutorSseService } from './tutor-sse.service';
import {
  ConversationMessage,
  ConversationStatus,
  EndConversationResponse,
} from '../models/tutor.model';

@Injectable({ providedIn: 'root' })
export class ConversationStateService {
  private readonly tutorApi = inject(TutorApiService);
  private readonly sseService = inject(TutorSseService);
  private readonly auth = inject(AuthService);
  private readonly state = inject(StateService);

  private readonly _conversationId = signal<string | null>(null);
  private readonly _messages = signal<ConversationMessage[]>([]);
  private readonly _status = signal<ConversationStatus>('idle');
  private readonly _currentLevel = signal<Level>('a1');
  private readonly _error = signal<string | null>(null);
  private readonly _endResult = signal<EndConversationResponse | null>(null);
  private readonly _streaming = signal(false);

  readonly conversationId = this._conversationId.asReadonly();
  readonly messages = this._messages.asReadonly();
  readonly status = this._status.asReadonly();
  readonly currentLevel = this._currentLevel.asReadonly();
  readonly error = this._error.asReadonly();
  readonly endResult = this._endResult.asReadonly();
  readonly streaming = this._streaming.asReadonly();
  readonly isActive = computed(() => !!this._conversationId());
  readonly messageCount = computed(() => this._messages().length);

  setStatus(status: ConversationStatus): void {
    this._status.set(status);
  }

  startConversation(level: Level, topic?: string): void {
    const profileId = this.auth.profileId();
    if (!profileId) return;

    this._status.set('sending');
    this._error.set(null);
    this._endResult.set(null);
    this._currentLevel.set(level);

    this.tutorApi.startConversation(profileId, { level, topic }).subscribe({
      next: (res) => {
        this._conversationId.set(res.id);
        this._messages.set(res.messages);
        this._status.set('idle');
      },
      error: (err) => {
        this._status.set('error');
        this._error.set(err.error?.message ?? 'No se pudo iniciar la conversacion');
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
      timestamp: new Date().toISOString(),
      confidence,
    };

    this._messages.update((msgs) => [...msgs, userMessage]);
    this._status.set('sending');
    this._error.set(null);

    this.tutorApi.sendMessage(conversationId, { content, confidence }).subscribe({
      next: (res) => {
        this._messages.update((msgs) => [...msgs, res.message]);
        this._status.set('speaking');
      },
      error: (err) => {
        this._status.set('error');
        this._error.set(err.error?.message ?? 'Error al enviar el mensaje');
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
      next: (chunk) => {
        accumulated += chunk;
        this._messages.update((msgs) => {
          const updated = [...msgs];
          updated[updated.length - 1] = { ...updated[updated.length - 1], content: accumulated };
          return updated;
        });
      },
      complete: () => {
        this._streaming.set(false);
        this._status.set('speaking');
      },
      error: () => {
        this._streaming.set(false);
        this._status.set('error');
        this._error.set('Error en el streaming de respuesta');
      },
    });
  }

  endConversation(): void {
    const conversationId = this._conversationId();
    if (!conversationId) return;

    this._status.set('sending');

    this.tutorApi.endConversation(conversationId).subscribe({
      next: (res) => {
        this._endResult.set(res);
        this._status.set('idle');
      },
      error: () => {
        this.resetConversation();
      },
    });
  }

  resetConversation(): void {
    this._conversationId.set(null);
    this._messages.set([]);
    this._status.set('idle');
    this._error.set(null);
    this._endResult.set(null);
  }

  clearError(): void {
    this._error.set(null);
    if (this._status() === 'error') {
      this._status.set('idle');
    }
  }

  defaultLevel(): Level {
    return this.state.getModuleLevel('pronunciation');
  }
}
