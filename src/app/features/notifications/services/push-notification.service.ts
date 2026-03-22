import { Injectable, inject, signal, computed, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../core/services/environment';
import { AuthService } from '../../../core/services/auth.service';

interface NotificationPreferences {
  enabled: boolean;
  dailyReminder: boolean;
  streakAlert: boolean;
  reviewReminder: boolean;
  reminderHour: number;
  reminderMinute: number;
}
const STORAGE_KEY = 'et_notification_prefs';

@Injectable({ providedIn: 'root' })
export class PushNotificationService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly zone = inject(NgZone);
  private readonly baseUrl = `${environment.apiUrl}/notifications`;
  private readonly _permission = signal<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'denied',
  );
  private readonly _preferences = signal<NotificationPreferences>(this.loadPrefs());
  private readonly _registering = signal(false);

  readonly permission = this._permission.asReadonly();
  readonly preferences = this._preferences.asReadonly();
  readonly registering = this._registering.asReadonly();
  readonly supported = computed(
    () => typeof Notification !== 'undefined' && 'serviceWorker' in navigator,
  );
  readonly isEnabled = computed(
    () => this._permission() === 'granted' && this._preferences().enabled,
  );

  async requestPermission(): Promise<boolean> {
    if (!this.supported()) return false;
    this._registering.set(true);
    try {
      const result = await Notification.requestPermission();
      this.zone.run(() => {
        this._permission.set(result);
        if (result === 'granted') {
          this.registerSub();
          this.updatePref('enabled', true);
        }
        this._registering.set(false);
      });
      return result === 'granted';
    } catch {
      this._registering.set(false);
      return false;
    }
  }

  updatePref<K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K],
  ): void {
    this._preferences.update((p) => ({ ...p, [key]: value }));
    this.savePrefs();
  }

  private async registerSub(): Promise<void> {
    try {
      const reg = await navigator.serviceWorker.ready;
      const key = this.urlBase64ToUint8Array(environment.vapidPublicKey ?? '');
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: key.buffer as ArrayBuffer,
      });
      const pid = this.auth.profileId();
      if (pid)
        this.http
          .post(`${this.baseUrl}/subscribe`, { profileId: pid, subscription: sub.toJSON() })
          .subscribe();
    } catch {
      /* push subscription failed */
    }
  }

  private loadPrefs(): NotificationPreferences {
    try {
      const s = localStorage.getItem(STORAGE_KEY);
      if (s) return JSON.parse(s);
    } catch {
      /* ignore */
    }
    return {
      enabled: false,
      dailyReminder: true,
      streakAlert: true,
      reviewReminder: true,
      reminderHour: 20,
      reminderMinute: 0,
    };
  }

  private savePrefs(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._preferences()));
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
    return outputArray;
  }
}
