import { Injectable, inject, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../core/services/environment';
import { AuthService } from '../../../core/services/auth.service';
import { TutorFeedback } from '../models/tutor.model';

export interface SseChunkEvent {
  type: 'chunk';
  text: string;
}

export interface SseFeedbackEvent {
  type: 'feedback';
  data: TutorFeedback;
}

export type SseEvent = SseChunkEvent | SseFeedbackEvent;

@Injectable({ providedIn: 'root' })
export class TutorSseService {
  private readonly zone = inject(NgZone);
  private readonly auth = inject(AuthService);
  private readonly baseUrl = `${environment.apiUrl}/conversations`;

  streamMessage(
    conversationId: string,
    content: string,
    confidence?: number,
  ): Observable<SseEvent> {
    return new Observable((subscriber) => {
      const token = this.auth.token();
      const url = `${this.baseUrl}/${conversationId}/messages/stream`;

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          Accept: 'text/event-stream',
        },
        body: JSON.stringify({ content, confidence }),
      })
        .then(async (response) => {
          if (!response.ok || !response.body) {
            subscriber.error(new Error('Stream failed'));
            return;
          }
          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();
                if (data === '[DONE]') {
                  this.zone.run(() => subscriber.complete());
                  return;
                }
                const event = this.parseEvent(data);
                if (event) {
                  this.zone.run(() => subscriber.next(event));
                }
              }
            }
          }
          this.zone.run(() => subscriber.complete());
        })
        .catch((err) => {
          this.zone.run(() => subscriber.error(err));
        });
    });
  }

  private parseEvent(data: string): SseEvent | null {
    try {
      const parsed = JSON.parse(data);
      if (parsed.type === 'chunk') {
        return { type: 'chunk', text: parsed.text };
      }
      if (parsed.type === 'feedback') {
        return { type: 'feedback', data: parsed.data };
      }
      return null;
    } catch {
      // Fallback: plain text chunk (backwards compatibility)
      return { type: 'chunk', text: data };
    }
  }
}
