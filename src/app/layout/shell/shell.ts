import {
  Component,
  ChangeDetectionStrategy,
  inject,
  DestroyRef,
  signal,
  effect,
} from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { TtsService } from '../../shared/services/tts.service';
import { Icon } from '../../shared/components/icon/icon';
import { ConnectionStatus } from '../../shared/components/connection-status/connection-status';
import { Toast } from '../../shared/components/toast/toast';
import { IdleWarningModal } from '../../shared/components/idle-warning-modal/idle-warning-modal';
import { Onboarding } from '../../shared/components/onboarding/onboarding';
import { IdleService } from '../../core/services/idle.service';
import { AuthService } from '../../core/services/auth.service';
import { LucideIconData, House, Mic, Square, BookOpen, RotateCcw, Newspaper } from 'lucide-angular';

interface NavTab {
  path: string;
  label: string;
  icon: LucideIconData;
}

@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    Icon,
    ConnectionStatus,
    Toast,
    IdleWarningModal,
    Onboarding,
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {
  private readonly tts = inject(TtsService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly idle = inject(IdleService);
  private readonly auth = inject(AuthService);

  protected readonly speaking = this.tts.speaking;
  protected readonly stopIcon = Square;
  protected readonly showChrome = signal(this.shouldShowChrome(this.router.url));

  protected readonly visibleTabs: NavTab[] = [
    { path: '/home', label: 'Home', icon: House },
    { path: '/talk', label: 'Talk', icon: Mic },
    { path: '/immerse', label: 'Immerse', icon: BookOpen },
    { path: '/article', label: 'Article', icon: Newspaper },
    { path: '/review', label: 'Review', icon: RotateCcw },
  ];

  constructor() {
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

    this.idle.start();

    effect(() => {
      if (this.idle.isIdle()) {
        this.auth.logout();
      }
    });
  }

  protected onIdleLogout(): void {
    this.auth.logout();
  }

  protected onOnboardingCompleted(): void {
    this.router.navigate(['/home']);
  }

  protected stopAudio(): void {
    this.tts.stop();
  }

  protected isActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }

  private shouldShowChrome(url: string): boolean {
    return !url.startsWith('/auth');
  }
}
