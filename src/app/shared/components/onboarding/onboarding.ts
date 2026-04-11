import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  output,
  computed,
} from '@angular/core';
import { ProfileStateService } from '../../services/profile-state.service';

const CEFR_LEVELS = [
  { code: 'A1', name: 'Beginner', description: 'Just starting out with English' },
  { code: 'A2', name: 'Elementary', description: 'Can handle simple conversations' },
  { code: 'B1', name: 'Intermediate', description: 'Comfortable with everyday topics' },
  { code: 'B2', name: 'Upper-Intermediate', description: 'Can discuss complex topics' },
  { code: 'C1', name: 'Advanced', description: 'Near-fluent in most situations' },
  { code: 'C2', name: 'Proficient', description: 'Mastery of English language' },
];

const STORAGE_KEY = 'et_onboarding_completed';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.html',
  styleUrl: './onboarding.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Onboarding {
  private readonly profileState = inject(ProfileStateService);

  readonly completed = output<void>();

  protected readonly visible = signal(false);
  protected readonly _step = signal<'welcome' | 'level' | 'ready'>('welcome');
  protected readonly _selectedLevel = signal<string | null>(null);
  protected readonly levels = CEFR_LEVELS;

  protected readonly canContinue = computed(() => this._selectedLevel() !== null);

  constructor() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      this.visible.set(true);
    }
  }

  protected goToLevel(): void {
    this._step.set('level');
  }

  protected selectLevel(code: string): void {
    this._selectedLevel.set(code);
  }

  protected confirm(): void {
    const level = this._selectedLevel();
    if (!level) return;
    this.profileState.updateEnglishLevel(level);
    this._step.set('ready');
  }

  protected finish(): void {
    localStorage.setItem(STORAGE_KEY, 'true');
    this.visible.set(false);
    this.completed.emit();
  }
}
