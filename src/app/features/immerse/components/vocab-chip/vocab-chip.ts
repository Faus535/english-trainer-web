import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { VocabEntry } from '../../models/immerse.model';

@Component({
  selector: 'app-vocab-chip',
  templateUrl: './vocab-chip.html',
  styleUrl: './vocab-chip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VocabChip {
  readonly entry = input.required<VocabEntry>();
}
