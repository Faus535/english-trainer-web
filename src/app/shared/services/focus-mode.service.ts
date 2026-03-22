import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FocusModeService {
  private readonly _active = signal(false);
  readonly active = this._active.asReadonly();

  toggle(): void {
    this._active.update((v) => !v);
    document.documentElement.classList.toggle('focus-mode', this._active());
  }
  enable(): void {
    this._active.set(true);
    document.documentElement.classList.add('focus-mode');
  }
  disable(): void {
    this._active.set(false);
    document.documentElement.classList.remove('focus-mode');
  }
}
