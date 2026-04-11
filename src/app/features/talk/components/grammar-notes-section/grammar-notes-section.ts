import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { GrammarNote } from '../../models/talk.model';

@Component({
  selector: 'app-grammar-notes-section',
  imports: [],
  templateUrl: './grammar-notes-section.html',
  styleUrl: './grammar-notes-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GrammarNotesSection {
  readonly notes = input.required<GrammarNote[]>();
}
