import { Component, ChangeDetectionStrategy, input, signal } from '@angular/core';
import { SavedWord } from '../../models/article.model';

@Component({
  selector: 'app-saved-words-list',
  templateUrl: './saved-words-list.html',
  styleUrl: './saved-words-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SavedWordsList {
  readonly words = input.required<SavedWord[]>();

  protected readonly expanded = signal(false);

  protected toggle(): void {
    this.expanded.update((v) => !v);
  }
}
