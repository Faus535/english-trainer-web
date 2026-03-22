import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { WeakAreaResponse } from '../../../../shared/models/api.model';

@Component({
  selector: 'app-weak-areas',
  templateUrl: './weak-areas.html',
  styleUrl: './weak-areas.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeakAreas {
  readonly areas = input.required<WeakAreaResponse[]>();
}
