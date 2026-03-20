import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { TtsService } from '../../features/speak/services/tts.service';
import { Icon } from '../../shared/components/icon/icon';
import { LucideIconData, LayoutDashboard, Mic, Trophy, Settings, Square } from 'lucide-angular';

interface NavTab {
  path: string;
  label: string;
  icon: LucideIconData;
}

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Icon],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {
  private readonly tts = inject(TtsService);

  protected readonly speaking = this.tts.speaking;
  protected readonly stopIcon = Square;

  protected stopAudio(): void {
    this.tts.stop();
  }

  protected readonly tabs: NavTab[] = [
    { path: '/dashboard', label: 'Sesiones', icon: LayoutDashboard },
    { path: '/speak', label: 'Hablar', icon: Mic },
    { path: '/achievements', label: 'Logros', icon: Trophy },
    { path: '/settings', label: 'Ajustes', icon: Settings },
  ];
}
