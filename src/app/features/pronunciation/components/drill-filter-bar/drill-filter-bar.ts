import { Component, ChangeDetectionStrategy, inject, output } from '@angular/core';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-drill-filter-bar',
  imports: [ReactiveFormsModule],
  templateUrl: './drill-filter-bar.html',
  styleUrl: './drill-filter-bar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrillFilterBar {
  private readonly fb = inject(FormBuilder);

  readonly filterChanged = output<{ level: string; focus: string | null }>();

  protected readonly form = this.fb.nonNullable.group({
    level: ['b1'],
    focus: ['all'],
  });

  protected readonly levels = [
    { value: 'a1', label: 'A1' },
    { value: 'a2', label: 'A2' },
    { value: 'b1', label: 'B1' },
    { value: 'b2', label: 'B2' },
    { value: 'c1', label: 'C1' },
    { value: 'c2', label: 'C2' },
  ];

  protected readonly focuses = [
    { value: 'all', label: 'All' },
    { value: 'th-sound', label: 'TH Sound' },
    { value: 'sh-vs-s', label: 'SH vs S' },
    { value: 'vowels', label: 'Vowels' },
    { value: 'consonants', label: 'Consonants' },
    { value: 'stress', label: 'Stress' },
  ];

  protected onChange(): void {
    const { level, focus } = this.form.getRawValue();
    this.filterChanged.emit({ level, focus: focus === 'all' ? null : focus });
  }
}
