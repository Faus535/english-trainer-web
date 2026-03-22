import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { PushNotificationService } from './services/push-notification.service';

@Component({
  selector: 'app-notification-settings',
  templateUrl: './notification-settings.html',
  styleUrl: './notification-settings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationSettings {
  protected readonly push = inject(PushNotificationService);
  protected readonly supported = this.push.supported;
  protected readonly permission = this.push.permission;
  protected readonly preferences = this.push.preferences;
  protected readonly registering = this.push.registering;
  protected readonly isEnabled = this.push.isEnabled;

  protected async enableNotifications(): Promise<void> {
    await this.push.requestPermission();
  }
  protected toggleDaily(): void {
    this.push.updatePref('dailyReminder', !this.preferences().dailyReminder);
  }
  protected toggleStreak(): void {
    this.push.updatePref('streakAlert', !this.preferences().streakAlert);
  }
  protected toggleReview(): void {
    this.push.updatePref('reviewReminder', !this.preferences().reviewReminder);
  }
  protected onHourChange(e: Event): void {
    this.push.updatePref('reminderHour', parseInt((e.target as HTMLSelectElement).value, 10));
  }
  protected onMinuteChange(e: Event): void {
    this.push.updatePref('reminderMinute', parseInt((e.target as HTMLSelectElement).value, 10));
  }
  protected readonly hours = Array.from({ length: 24 }, (_, i) => i);
  protected readonly minutes = [0, 15, 30, 45];
}
