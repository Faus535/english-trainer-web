import { Injectable, inject, signal, computed, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../shared/services/notification.service';

interface QueuedRequest {
  id: string;
  method: 'POST' | 'PUT' | 'DELETE';
  url: string;
  body: unknown;
  timestamp: number;
  retryCount?: number;
}

const QUEUE_KEY = 'et_offline_queue';

@Injectable({ providedIn: 'root' })
export class OfflineQueueService implements OnDestroy {
  private static readonly MAX_RETRIES = 5;

  private readonly http = inject(HttpClient);
  private readonly notification = inject(NotificationService);
  private readonly _online = signal(navigator.onLine);
  private readonly _queue = signal<QueuedRequest[]>(this.loadQueue());
  private readonly onlineHandler = () => this.handleOnline();
  private readonly offlineHandler = () => this._online.set(false);

  readonly online = this._online.asReadonly();
  readonly pendingCount = computed(() => this._queue().length);

  constructor() {
    window.addEventListener('online', this.onlineHandler);
    window.addEventListener('offline', this.offlineHandler);
  }

  ngOnDestroy(): void {
    window.removeEventListener('online', this.onlineHandler);
    window.removeEventListener('offline', this.offlineHandler);
  }

  enqueue(method: 'POST' | 'PUT' | 'DELETE', url: string, body: unknown): void {
    const request: QueuedRequest = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      method,
      url,
      body,
      timestamp: Date.now(),
    };

    this._queue.update((q) => [...q, request]);
    this.persistQueue();

    if (this._online()) {
      this.flush();
    }
  }

  flush(): void {
    const queue = this._queue();
    if (queue.length === 0) return;

    for (const req of queue) {
      this.executeWithRetry(req);
    }
  }

  private executeWithRetry(req: QueuedRequest): void {
    const attempt = req.retryCount ?? 0;

    if (attempt >= OfflineQueueService.MAX_RETRIES) {
      this.notification.error(
        `No se pudo enviar una solicitud despues de ${OfflineQueueService.MAX_RETRIES} intentos.`,
      );
      this.removeFromQueue(req.id);
      return;
    }

    this.executeRequest(req).subscribe({
      next: () => this.removeFromQueue(req.id),
      error: () => {
        this._queue.update((q) =>
          q.map((r) => (r.id === req.id ? { ...r, retryCount: attempt + 1 } : r)),
        );
        this.persistQueue();

        const delay = Math.min(1000 * Math.pow(2, attempt), 30000);
        setTimeout(() => {
          if (this._online()) {
            const current = this._queue().find((r) => r.id === req.id);
            if (current) this.executeWithRetry(current);
          }
        }, delay);
      },
    });
  }

  private handleOnline(): void {
    this._online.set(true);
    this.flush();
  }

  private executeRequest(req: QueuedRequest) {
    switch (req.method) {
      case 'POST':
        return this.http.post(req.url, req.body);
      case 'PUT':
        return this.http.put(req.url, req.body);
      case 'DELETE':
        return this.http.delete(req.url);
    }
  }

  private removeFromQueue(id: string): void {
    this._queue.update((q) => q.filter((r) => r.id !== id));
    this.persistQueue();
  }

  private persistQueue(): void {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(this._queue()));
  }

  private loadQueue(): QueuedRequest[] {
    try {
      const val = localStorage.getItem(QUEUE_KEY);
      return val ? (JSON.parse(val) as QueuedRequest[]) : [];
    } catch {
      return [];
    }
  }
}
