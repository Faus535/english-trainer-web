import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-achievement-popup',
  templateUrl: './achievement-popup.html',
  styleUrl: './achievement-popup.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AchievementPopup {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly icon = input<string>('🏆');
  readonly type = input<'achievement' | 'levelup' | 'streak'>('achievement');
  readonly dismissed = output<void>();
  protected readonly visible = signal(true);

  protected dismiss(): void {
    this.visible.set(false);
    this.dismissed.emit();
  }
}
