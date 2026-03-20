import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Toast {
  protected readonly notificationService = inject(NotificationService);
  protected readonly notifications = this.notificationService.notifications;

  protected dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }
}
