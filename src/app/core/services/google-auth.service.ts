import { Injectable, signal } from '@angular/core';
import { environment } from './environment';

@Injectable({ providedIn: 'root' })
export class GoogleAuthService {
  private readonly clientId = environment.googleClientId;
  private readonly _scriptLoaded = signal(false);

  signIn(): Promise<string> {
    return this.loadScript().then(
      () =>
        new Promise<string>((resolve, reject) => {
          google.accounts.id.initialize({
            client_id: this.clientId,
            callback: (response) => resolve(response.credential),
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          google.accounts.id.prompt((notification) => {
            if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
              reject(new Error('google_prompt_not_available'));
            }
            if (notification.isDismissedMoment()) {
              reject(new Error('google_prompt_dismissed'));
            }
          });
        }),
    );
  }

  private loadScript(): Promise<void> {
    if (this._scriptLoaded()) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      if (document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
        this._scriptLoaded.set(true);
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        this._scriptLoaded.set(true);
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load Google Identity Services script'));
      document.head.appendChild(script);
    });
  }
}
