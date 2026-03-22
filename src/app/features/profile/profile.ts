import { Component, ChangeDetectionStrategy, inject, signal, OnInit } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProfileApiService } from '../../core/services/profile-api.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../shared/services/notification.service';
import { UserAccountResponse } from '../../shared/models/api.model';
import { Icon } from '../../shared/components/icon/icon';
import {
  LucideIconData,
  Trophy,
  BarChart3,
  Bell,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-angular';

type ProfileTab = 'account' | 'password';

interface ProfileMenuItem {
  label: string;
  icon: LucideIconData;
  path: string;
}

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, RouterLink, Icon],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Profile implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly profileApi = inject(ProfileApiService);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly notification = inject(NotificationService);

  protected readonly account = signal<UserAccountResponse | null>(null);
  protected readonly loading = signal(true);
  protected readonly savingProfile = signal(false);
  protected readonly savingPassword = signal(false);
  protected readonly deleting = signal(false);
  protected readonly showDeleteConfirm = signal(false);
  protected readonly isGoogle = signal(false);
  protected readonly activeTab = signal<ProfileTab>('account');

  protected readonly chevronIcon: LucideIconData = ChevronRight;
  protected readonly logoutIcon: LucideIconData = LogOut;

  protected readonly menuItems: ProfileMenuItem[] = [
    { label: 'Logros', icon: Trophy, path: '/achievements' },
    { label: 'Progreso', icon: BarChart3, path: '/analytics' },
    { label: 'Notificaciones', icon: Bell, path: '/notifications' },
    { label: 'Ajustes', icon: Settings, path: '/settings' },
  ];

  readonly profileForm = this.fb.nonNullable.group({
    name: [''],
    avatarUrl: [''],
  });

  readonly passwordForm = this.fb.nonNullable.group(
    {
      currentPassword: ['', [Validators.required, Validators.minLength(6)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: [this.passwordsMatch] },
  );

  readonly deleteForm = this.fb.nonNullable.group({
    password: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.profileApi.getCurrentUser().subscribe({
      next: (user) => {
        this.account.set(user);
        this.isGoogle.set(user.provider === 'google');
        this.profileForm.patchValue({ name: user.name ?? '', avatarUrl: user.avatarUrl ?? '' });
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notification.error('No se pudo cargar la informacion de la cuenta');
      },
    });
  }

  protected getInitials(): string {
    const user = this.account();
    if (!user) return '?';
    if (user.name) return user.name.slice(0, 2).toUpperCase();
    return user.email.slice(0, 2).toUpperCase();
  }

  protected setTab(tab: ProfileTab): void {
    this.activeTab.set(tab);
  }

  protected onLogout(): void {
    this.auth.logout();
  }

  protected onSaveProfile(): void {
    this.savingProfile.set(true);
    const profileId = this.auth.profileId();
    if (!profileId) return;

    this.profileApi.updateProfile(profileId, this.profileForm.getRawValue()).subscribe({
      next: (updated) => {
        this.account.set(updated);
        this.savingProfile.set(false);
        this.notification.success('Perfil actualizado');
      },
      error: () => {
        this.savingProfile.set(false);
        this.notification.error('Error al actualizar el perfil');
      },
    });
  }

  protected onChangePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }
    this.savingPassword.set(true);
    const { currentPassword, newPassword } = this.passwordForm.getRawValue();

    this.profileApi.changePassword({ currentPassword, newPassword }).subscribe({
      next: () => {
        this.savingPassword.set(false);
        this.passwordForm.reset();
        this.notification.success('Contrasena actualizada');
        this.activeTab.set('account');
      },
      error: (err) => {
        this.savingPassword.set(false);
        this.notification.error(
          err.status === 400
            ? 'La contrasena actual no es correcta'
            : 'Error al cambiar la contrasena',
        );
      },
    });
  }

  protected onDeleteAccount(): void {
    if (this.deleteForm.invalid) {
      this.deleteForm.markAllAsTouched();
      return;
    }
    this.deleting.set(true);

    this.profileApi.deleteAccount(this.deleteForm.getRawValue()).subscribe({
      next: () => {
        this.deleting.set(false);
        this.auth.logout();
        this.notification.success('Cuenta eliminada');
      },
      error: () => {
        this.deleting.set(false);
        this.notification.error('Error al eliminar la cuenta');
      },
    });
  }

  private passwordsMatch(control: AbstractControl): ValidationErrors | null {
    const pw = control.get('newPassword')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return pw === confirm ? null : { passwordsMismatch: true };
  }
}
