import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { TtsService } from '../speak/services/tts.service';
import { StateService } from '../../shared/services/state.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings {
  private readonly tts = inject(TtsService);
  private readonly state = inject(StateService);
  private readonly router = inject(Router);

  protected readonly rate = this.tts.rate;
  protected readonly voices = computed(() => this.tts.getVoices());
  protected readonly exportReady = signal(false);
  protected readonly isDark = signal(!document.documentElement.classList.contains('light-theme'));

  protected toggleTheme(): void {
    this.isDark.update(v => !v);
    document.documentElement.classList.toggle('light-theme', !this.isDark());
    localStorage.setItem('english_plan_theme', this.isDark() ? 'dark' : 'light');
  }

  protected onRateChange(event: Event): void {
    const value = parseFloat((event.target as HTMLInputElement).value);
    this.tts.setRate(value);
  }

  protected onVoiceChange(event: Event): void {
    const idx = parseInt((event.target as HTMLSelectElement).value, 10);
    const voices = this.tts.getVoices();
    if (voices[idx]) {
      this.tts.selectVoice(voices[idx]);
    }
  }

  protected exportProgress(): void {
    const json = this.state.exportProgress();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `english-trainer-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.exportReady.set(true);
  }

  protected retakeTest(): void {
    if (confirm('Repetir el test de nivel? Tu progreso en modulos se mantendra, pero se recalcularan tus niveles.')) {
      this.state.markTestIncomplete();
      this.router.navigate(['/level-test']);
    }
  }

  protected resetAll(): void {
    if (confirm('Reiniciar todo el progreso? Esto borrara tu test de nivel y progreso en todos los modulos.')) {
      this.state.resetProgress();
      this.router.navigate(['/level-test']);
    }
  }
}
