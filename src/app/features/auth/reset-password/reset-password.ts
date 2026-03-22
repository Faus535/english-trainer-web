import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPassword {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly showPassword = signal(false);

  private readonly token = toSignal(
    this.route.queryParamMap.pipe(map((params) => params.get('token') ?? '')),
  );

  readonly form = this.fb.nonNullable.group(
    {
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: [this.passwordsMatch] },
  );

  protected togglePassword(): void {
    this.showPassword.update((v) => !v);
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const tokenValue = this.token();
    if (!tokenValue) {
      this.error.set('Token de recuperacion no valido');
      return;
    }
    this.loading.set(true);
    this.error.set(null);

    this.auth
      .resetPassword({ token: tokenValue, newPassword: this.form.getRawValue().password })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/auth/login'], { queryParams: { reset: 'success' } });
        },
        error: (err) => {
          this.loading.set(false);
          this.error.set(
            err.status === 400
              ? 'El enlace ha expirado o no es valido'
              : 'Error al restablecer la contrasena',
          );
        },
      });
  }

  private passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const pw = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return pw === confirm ? null : { passwordsMismatch: true };
  }
}
