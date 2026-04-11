import { Component, ChangeDetectionStrategy, input, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-level-badge',
  imports: [],
  templateUrl: './level-badge.html',
  styleUrl: './level-badge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelBadge {
  readonly level = input.required<string | null>();
  private readonly router = inject(Router);

  protected navigate(): void {
    this.router.navigate(['/profile']);
  }
}
