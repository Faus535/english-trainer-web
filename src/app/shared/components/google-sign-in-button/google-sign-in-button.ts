import { Component, ChangeDetectionStrategy, inject, input, output, signal } from '@angular/core';
import { GoogleAuthService } from '../../../core/services/google-auth.service';

@Component({
  selector: 'app-google-sign-in-button',
  templateUrl: './google-sign-in-button.html',
  styleUrl: './google-sign-in-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoogleSignInButton {
  private readonly googleAuth = inject(GoogleAuthService);

  readonly label = input('Continuar con Google');
  readonly authenticated = output<string>();
  readonly authError = output<string>();

  protected readonly loading = signal(false);

  protected async onClick(): Promise<void> {
    this.loading.set(true);

    try {
      const idToken = await this.googleAuth.signIn();
      this.authenticated.emit(idToken);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'google_unknown_error';
      if (message !== 'google_prompt_dismissed') {
        this.authError.emit(message);
      }
    } finally {
      this.loading.set(false);
    }
  }
}
