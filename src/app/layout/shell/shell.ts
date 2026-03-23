import {
  Component,
  ChangeDetectionStrategy,
  inject,
  DestroyRef,
  signal,
  computed,
} from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { TtsService } from '../../features/speak/services/tts.service';
import { Icon } from '../../shared/components/icon/icon';
import { ConnectionStatus } from '../../shared/components/connection-status/connection-status';
import { Toast } from '../../shared/components/toast/toast';
import { environment } from '../../core/services/environment';
import { CurrentUserResponse } from '../../shared/models/api.model';
import {
  LucideIconData,
  LayoutDashboard,
  Mic,
  Square,
  BotMessageSquare,
  GraduationCap,
  UserCircle,
} from 'lucide-angular';

interface NavTab {
  path: string;
  label: string;
  icon: LucideIconData;
  adminOnly?: boolean;
}

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon, ConnectionStatus, Toast],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {
  private readonly tts = inject(TtsService);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly speaking = this.tts.speaking;
  protected readonly stopIcon = Square;
  protected readonly showChrome = signal(this.shouldShowChrome(this.router.url));
  private readonly _isAdmin = signal(false);

  protected readonly visibleTabs = computed(() =>
    this._allTabs.filter((t) => !t.adminOnly || this._isAdmin()),
  );

  constructor() {
    this.http.get<CurrentUserResponse>(`${environment.apiUrl}/auth/me`).subscribe({
      next: (user) => this._isAdmin.set(user.role === 'ADMIN'),
    });

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.showChrome.set(this.shouldShowChrome(event.urlAfterRedirects));
        const main = document.querySelector<HTMLElement>('main');
        main?.focus();
      });
  }

  protected stopAudio(): void {
    this.tts.stop();
  }

  private readonly profilePaths = [
    '/profile',
    '/achievements',
    '/analytics',
    '/notifications',
    '/settings',
  ];
  private readonly practicePaths = ['/practice', '/reading', '/writing'];

  protected isActive(path: string): boolean {
    const url = this.router.url;
    if (path === '/profile') return this.profilePaths.some((p) => url.startsWith(p));
    if (path === '/practice') return this.practicePaths.some((p) => url.startsWith(p));
    return url.startsWith(path);
  }

  private shouldShowChrome(url: string): boolean {
    return !url.startsWith('/auth');
  }

  private readonly _allTabs: NavTab[] = [
    { path: '/dashboard', label: 'Sesiones', icon: LayoutDashboard },
    { path: '/speak', label: 'Hablar', icon: Mic, adminOnly: true },
    { path: '/tutor', label: 'Tutor', icon: BotMessageSquare, adminOnly: true },
    { path: '/practice', label: 'Mejorar', icon: GraduationCap },
    { path: '/profile', label: 'Perfil', icon: UserCircle },
  ];
}
