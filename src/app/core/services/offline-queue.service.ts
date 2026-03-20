import { Injectable, inject, signal, computed, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface QueuedRequest {
  id: string;
  method: 'POST' | 'PUT' | 'DELETE';
  url: string;
  body: unknown;
  timestamp: number;
}

const QUEUE_KEY = 'et_offline_queue';

@Injectable({ providedIn: 'root' })
export class OfflineQueueService implements OnDestroy {
  private readonly http = inject(HttpClient);
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

    this._queue.update(q => [...q, request]);
    this.persistQueue();

    if (this._online()) {
      this.flush();
    }
  }

  flush(): void {
    const queue = this._queue();
    if (queue.length === 0) return;

    for (const req of queue) {
      this.executeRequest(req).subscribe({
        next: () => this.removeFromQueue(req.id),
        error: () => {
          // Keep in queue for retry
        },
      });
    }
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
    this._queue.update(q => q.filter(r => r.id !== id));
    this.persistQueue();
  }

  private persistQueue(): void {
    localStorage.setItem(QUEUE_KEY, JSON.stringify(this._queue()));
  }

  private loadQueue(): QueuedRequest[] {
    try {
      const val = localStorage.getItem(QUEUE_KEY);
      return val ? JSON.parse(val) as QueuedRequest[] : [];
    } catch {
      return [];
    }
  }
}
