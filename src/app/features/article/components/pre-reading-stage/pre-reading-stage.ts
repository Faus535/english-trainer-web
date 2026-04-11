import {
  Component,
  ChangeDetectionStrategy,
  input,
  output,
  signal,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { PreReadingKeyWord } from '../../models/article.model';

@Component({
  selector: 'app-pre-reading-stage',
  templateUrl: './pre-reading-stage.html',
  styleUrl: './pre-reading-stage.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreReadingStage implements OnInit, OnDestroy {
  readonly keyWords = input.required<PreReadingKeyWord[]>();
  readonly question = input<string | null>(null);
  readonly loading = input(false);

  readonly startReading = output<void>();

  protected readonly expandedWordId = signal<string | null>(null);

  private boundOnKeydown = this.onKeydown.bind(this);

  ngOnInit(): void {
    document.addEventListener('keydown', this.boundOnKeydown);
  }

  ngOnDestroy(): void {
    document.removeEventListener('keydown', this.boundOnKeydown);
  }

  protected toggleWord(wordId: string): void {
    this.expandedWordId.update((id) => (id === wordId ? null : wordId));
  }

  protected onStart(): void {
    this.startReading.emit();
  }

  private onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.startReading.emit();
    }
  }
}
