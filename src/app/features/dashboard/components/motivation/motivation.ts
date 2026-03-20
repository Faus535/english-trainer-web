import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MOTIVATIONS } from '../../data/gamification.data';

@Component({
  selector: 'app-motivation',
  templateUrl: './motivation.html',
  styleUrl: './motivation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Motivation {
  protected readonly message = MOTIVATIONS[new Date().getDate() % MOTIVATIONS.length];
}
