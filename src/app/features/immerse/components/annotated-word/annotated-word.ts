import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { WordAnnotation } from '../../models/immerse.model';

@Component({
  selector: 'app-annotated-word',
  templateUrl: './annotated-word.html',
  styleUrl: './annotated-word.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnnotatedWord {
  readonly annotation = input.required<WordAnnotation>();
  readonly wordSelected = output<WordAnnotation>();

  protected onClick(): void {
    this.wordSelected.emit(this.annotation());
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.wordSelected.emit(this.annotation());
    }
  }
}
