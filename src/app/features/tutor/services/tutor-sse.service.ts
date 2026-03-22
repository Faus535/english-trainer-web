import { Injectable, inject, NgZone } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../core/services/environment';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({ providedIn: 'root' })
export class TutorSseService {
  private readonly zone = inject(NgZone);
  private readonly auth = inject(AuthService);
  private readonly baseUrl = `${environment.apiUrl}/conversations`;

  streamMessage(conversationId: string, content: string, confidence?: number): Observable<string> {
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
                const data = line.slice(6);
                if (data === '[DONE]') {
                  this.zone.run(() => subscriber.complete());
                  return;
                }
                this.zone.run(() => subscriber.next(data));
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
}
