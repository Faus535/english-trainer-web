import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  OnInit,
  DestroyRef,
  inject,
} from '@angular/core';

@Component({
  selector: 'app-level-up-popup',
  templateUrl: './level-up-popup.html',
  styleUrl: './level-up-popup.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelUpPopup implements OnInit {
  private readonly destroyRef = inject(DestroyRef);

  readonly type = input.required<'xp' | 'cefr'>();
  readonly level = input.required<string>();
  readonly module = input<string>();

  readonly dismissed = output<void>();

  protected readonly visible = signal(false);

  ngOnInit(): void {
    requestAnimationFrame(() => this.visible.set(true));

    const timer = setTimeout(() => this.dismiss(), 4000);
    this.destroyRef.onDestroy(() => clearTimeout(timer));
  }

  protected dismiss(): void {
    this.visible.set(false);
    setTimeout(() => this.dismissed.emit(), 300);
  }
}
