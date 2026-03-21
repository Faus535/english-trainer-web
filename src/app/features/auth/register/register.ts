import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { StateService } from '../../../shared/services/state.service';
import { GoogleSignInButton } from '../../../shared/components/google-sign-in-button/google-sign-in-button';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, GoogleSignInButton],
  templateUrl: './register.html',
  styleUrl: './register.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Register {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly state = inject(StateService);
  private readonly router = inject(Router);

  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  });

  protected onGoogleAuth(idToken: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.auth.loginWithGoogle({ idToken }).subscribe({
      next: () => {
        this.state.loadFromBackend();
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: () => {
        this.loading.set(false);
        this.error.set('Error al registrarse con Google');
      },
    });
  }

  protected onGoogleError(message: string): void {
    if (message !== 'google_prompt_not_available') {
      this.error.set('No se pudo conectar con Google');
    }
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { password, confirmPassword } = this.form.getRawValue();
    if (password !== confirmPassword) {
      this.error.set('Las contrasenas no coinciden');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const { email } = this.form.getRawValue();
    this.auth.register({ email, password }).subscribe({
      next: () => {
        this.state.loadFromBackend();
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(
          err.status === 409 ? 'Ya existe una cuenta con ese email' : 'Error al crear la cuenta',
        );
      },
    });
  }
}
