import { Component, ChangeDetectionStrategy, inject, DestroyRef, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { TtsService } from '../../features/speak/services/tts.service';
import { Icon } from '../../shared/components/icon/icon';
import { ConnectionStatus } from '../../shared/components/connection-status/connection-status';
import { Toast } from '../../shared/components/toast/toast';
import {
  LucideIconData,
  LayoutDashboard,
  Mic,
  Trophy,
  Settings,
  Square,
  BotMessageSquare,
} from 'lucide-angular';

interface NavTab {
  path: string;
  label: string;
  icon: LucideIconData;
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
  private readonly destroyRef = inject(DestroyRef);

  protected readonly speaking = this.tts.speaking;
  protected readonly stopIcon = Square;
  protected readonly showChrome = signal(!this.router.url.startsWith('/auth'));

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.showChrome.set(!event.urlAfterRedirects.startsWith('/auth'));
        const main = document.querySelector<HTMLElement>('main');
        main?.focus();
      });
  }

  protected stopAudio(): void {
    this.tts.stop();
  }

  protected isActive(path: string): boolean {
    return this.router.url.startsWith(path);
  }

  protected readonly tabs: NavTab[] = [
    { path: '/dashboard', label: 'Sesiones', icon: LayoutDashboard },
    { path: '/speak', label: 'Hablar', icon: Mic },
    { path: '/tutor', label: 'Tutor', icon: BotMessageSquare },
    { path: '/achievements', label: 'Logros', icon: Trophy },
    { path: '/settings', label: 'Ajustes', icon: Settings },
  ];
}
