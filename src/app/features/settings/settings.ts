import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { TtsService } from '../../shared/services/tts.service';
import { StateService } from '../../shared/services/state.service';
import { I18nService, Locale } from '../../shared/services/i18n.service';
import { FocusModeService } from '../../shared/services/focus-mode.service';
import { ProfileApiService } from '../../core/services/profile-api.service';
import { AuthService } from '../../core/services/auth.service';
import { AssessmentApiService } from '../../core/services/assessment-api.service';
import { TestHistoryResponse } from '../../shared/models/api.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Settings implements OnInit {
  private readonly tts = inject(TtsService);
  private readonly state = inject(StateService);
  private readonly router = inject(Router);
  private readonly i18n = inject(I18nService);
  private readonly focusMode = inject(FocusModeService);
  private readonly profileApi = inject(ProfileApiService);
  private readonly auth = inject(AuthService);
  private readonly assessmentApi = inject(AssessmentApiService);

  protected readonly locale = this.i18n.locale;
  protected readonly isFocusMode = this.focusMode.active;

  protected readonly rate = this.tts.rate;
  protected readonly voices = computed(() => this.tts.getVoices());
  protected readonly exportReady = signal(false);
  protected readonly isDark = signal(!document.documentElement.classList.contains('light-theme'));
  protected readonly retaking = signal(false);

  private readonly _testHistory = signal<TestHistoryResponse[]>([]);

  protected readonly testAttempts = computed(() => this._testHistory().length);

  protected readonly cooldownRemaining = computed(() => {
    const history = this._testHistory();
    if (history.length === 0) return null;

    const sorted = [...history].sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime(),
    );
    const lastTest = new Date(sorted[0].completedAt).getTime();
    const cooldownMs = 24 * 60 * 60 * 1000;
    const remaining = lastTest + cooldownMs - Date.now();

    if (remaining <= 0) return null;

    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
    return `${hours}h ${minutes}m`;
  });

  protected readonly showPracticeTip = computed(() => this.testAttempts() >= 3);

  ngOnInit(): void {
    const profileId = this.auth.profileId();
    if (profileId) {
      this.assessmentApi.getTestHistory(profileId).subscribe({
        next: (history) => this._testHistory.set(history),
      });
    }
  }

  protected toggleTheme(): void {
    this.isDark.update((v) => !v);
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
    if (
      !confirm(
        'Repetir el test de nivel? Tu progreso en modulos se mantendra, pero se recalcularan tus niveles.',
      )
    ) {
      return;
    }

    const profileId = this.auth.profileId();
    if (!profileId) {
      this.state.markTestIncomplete();
      this.router.navigate(['/level-test']);
      return;
    }

    this.retaking.set(true);
    this.profileApi.resetTest(profileId).subscribe({
      next: () => {
        this.state.markTestIncomplete();
        this.retaking.set(false);
        this.router.navigate(['/level-test']);
      },
      error: () => {
        this.state.markTestIncomplete();
        this.retaking.set(false);
        this.router.navigate(['/level-test']);
      },
    });
  }

  protected resetAll(): void {
    if (
      confirm(
        'Reiniciar todo el progreso? Esto borrara tu test de nivel y progreso en todos los modulos.',
      )
    ) {
      this.state.resetProgress();
      this.router.navigate(['/level-test']);
    }
  }

  protected onLocaleChange(event: Event): void {
    this.i18n.setLocale((event.target as HTMLSelectElement).value as Locale);
  }

  protected toggleFocusMode(): void {
    this.focusMode.toggle();
  }
}
