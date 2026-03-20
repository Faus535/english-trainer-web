import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { OfflineQueueService } from '../../../core/services/offline-queue.service';

@Component({
  selector: 'app-connection-status',
  template: `
    @if (!online()) {
      <div class="offline-bar">
        Sin conexion
        @if (pending() > 0) {
          <span class="pending">{{ pending() }} pendientes</span>
        }
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
    }
    .offline-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 0.5rem 1rem;
      background: var(--color-warning, #f59e0b);
      color: #000;
      font-size: 0.875rem;
      font-weight: 600;
      text-align: center;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    .pending {
      font-weight: 400;
      opacity: 0.8;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectionStatus {
  private readonly queue = inject(OfflineQueueService);

  protected readonly online = this.queue.online;
  protected readonly pending = this.queue.pendingCount;
}
