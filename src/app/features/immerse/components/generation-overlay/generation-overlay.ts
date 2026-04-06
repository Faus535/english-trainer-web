import {
  Component,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
  DestroyRef,
  output,
} from '@angular/core';
import { input } from '@angular/core';
import { GenerationStep, GENERATION_STEPS } from '../../models/immerse.model';

@Component({
  selector: 'app-generation-overlay',
  templateUrl: './generation-overlay.html',
  styleUrl: './generation-overlay.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenerationOverlay {
  private readonly destroyRef = inject(DestroyRef);

  readonly step = input.required<GenerationStep>();
  readonly progress = input.required<number>();
  readonly error = input.required<string | null>();

  readonly cancelled = output<void>();
  readonly retried = output<void>();

  protected readonly elapsed = signal(0);
  protected readonly GENERATION_STEPS = GENERATION_STEPS;

  private readonly timerId: ReturnType<typeof setInterval>;

  protected readonly elapsedDisplay = computed(() => {
    const s = this.elapsed();
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}m ${secs}s`;
  });

  protected readonly activeStepIndex = computed(() => {
    const current = this.step();
    return GENERATION_STEPS.findIndex((s) => s.key === current);
  });

  protected readonly isError = computed(() => !!this.error());

  constructor() {
    this.timerId = setInterval(() => {
      this.elapsed.update((v) => v + 1);
    }, 1000);

    this.destroyRef.onDestroy(() => {
      clearInterval(this.timerId);
    });
  }
}
