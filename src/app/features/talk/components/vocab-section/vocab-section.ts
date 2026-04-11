import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { VocabItem } from '../../models/talk.model';

@Component({
  selector: 'app-vocab-section',
  imports: [],
  templateUrl: './vocab-section.html',
  styleUrl: './vocab-section.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VocabSection {
  readonly items = input.required<VocabItem[]>();
}
