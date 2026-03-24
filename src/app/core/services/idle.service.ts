import { Injectable, inject, signal, computed, NgZone, DestroyRef } from '@angular/core';

const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const WARNING_BEFORE_MS = 60 * 1000;
const DEBOUNCE_MS = 500;
const TICK_MS = 1000;

const ACTIVITY_EVENTS: (keyof DocumentEventMap)[] = [
  'mousemove',
  'keydown',
  'click',
  'scroll',
  'touchstart',
];

@Injectable({ providedIn: 'root' })
export class IdleService {
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _isIdle = signal(false);
  private readonly _showWarning = signal(false);
  private readonly _remainingSeconds = signal(0);

  readonly isIdle = this._isIdle.asReadonly();
  readonly showWarning = this._showWarning.asReadonly();
  readonly remainingSeconds = this._remainingSeconds.asReadonly();

  readonly remainingDisplay = computed(() => {
    const s = this._remainingSeconds();
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}`;
  });

  private timeoutId: number | null = null;
  private warningId: number | null = null;
  private tickId: number | null = null;
  private debounceId: number | null = null;
  private running = false;
  private deadline = 0;

  private readonly onActivity = (): void => {
    if (!this.running) return;
    if (this.debounceId !== null) return;

    this.debounceId = window.setTimeout(() => {
      this.debounceId = null;
    }, DEBOUNCE_MS);

    this.resetTimers();
  };

  start(): void {
    if (this.running) return;
    this.running = true;

    this.zone.runOutsideAngular(() => {
      ACTIVITY_EVENTS.forEach((evt) =>
        document.addEventListener(evt, this.onActivity, { passive: true }),
      );
    });

    this.resetTimers();

    this.destroyRef.onDestroy(() => this.stop());
  }

  stop(): void {
    if (!this.running) return;
    this.running = false;

    ACTIVITY_EVENTS.forEach((evt) => document.removeEventListener(evt, this.onActivity));
    this.clearAllTimers();

    this._isIdle.set(false);
    this._showWarning.set(false);
    this._remainingSeconds.set(0);
  }

  reset(): void {
    if (!this.running) return;
    this.resetTimers();
  }

  private resetTimers(): void {
    this.clearAllTimers();

    this.zone.run(() => {
      this._isIdle.set(false);
      this._showWarning.set(false);
      this._remainingSeconds.set(0);
    });

    this.deadline = Date.now() + IDLE_TIMEOUT_MS;

    this.zone.runOutsideAngular(() => {
      this.warningId = window.setTimeout(() => {
        this.startWarningCountdown();
      }, IDLE_TIMEOUT_MS - WARNING_BEFORE_MS);

      this.timeoutId = window.setTimeout(() => {
        this.zone.run(() => {
          this._isIdle.set(true);
          this._showWarning.set(false);
          this._remainingSeconds.set(0);
        });
        this.clearTick();
      }, IDLE_TIMEOUT_MS);
    });
  }

  private startWarningCountdown(): void {
    const remaining = Math.ceil((this.deadline - Date.now()) / 1000);

    this.zone.run(() => {
      this._showWarning.set(true);
      this._remainingSeconds.set(remaining);
    });

    this.tickId = window.setInterval(() => {
      const secs = Math.max(0, Math.ceil((this.deadline - Date.now()) / 1000));
      this.zone.run(() => {
        this._remainingSeconds.set(secs);
      });
    }, TICK_MS);
  }

  private clearAllTimers(): void {
    if (this.timeoutId !== null) {
      window.clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
    if (this.warningId !== null) {
      window.clearTimeout(this.warningId);
      this.warningId = null;
    }
    if (this.debounceId !== null) {
      window.clearTimeout(this.debounceId);
      this.debounceId = null;
    }
    this.clearTick();
  }

  private clearTick(): void {
    if (this.tickId !== null) {
      window.clearInterval(this.tickId);
      this.tickId = null;
    }
  }
}
